const { default: axios } = require("axios");
const response = require("../common/response");
const { getUserById } = require("../helpers/userHelper");
const sql = require("mssql");
const { connectToDatabase } = require("../config/config");
require("dotenv").config();

exports.chatBot = async (req, res) => {
  const userId = req.user.userId;
  const user = await getUserById(userId);
  if (!user) {
    return response.NotFound(res, "User not found");
  }
  try {
    const chatLogin = await axios.post(process.env.AI_CHATBOT_LOGIN_API, {
      emma_user_id: userId,
      email: process.env.AI_CHATBOT_LOGIN_EMAIL,
      password: process.env.AI_CHATBOT_LOGIN_PASSWORD,
    });
    const accessToken = chatLogin.data.access_token;

    const createchatSession = await axios.post(
      process.env.AI_CHATBOT_SESSION_API,
      {
        emma_user_id: userId,
        email: process.env.AI_CHATBOT_LOGIN_EMAIL,
        password: process.env.AI_CHATBOT_LOGIN_PASSWORD,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const sessionId = createchatSession.data.session_id;
    return response.SuccessResponseWithData(
      res,
      "session create successfully",
      {
        session_id: sessionId,
        token: accessToken,
      }
    );
  } catch (error) {
    return response.FailedResponseWithOutData(
      res,
      error.response?.data || error.message
    );
  }
};

exports.chatAssistant = async (req, res) => {
  const userId = req.user.userId;
  const user = await getUserById(userId);
  if (!user) {
    return response.NotFound(res, "User not found");
  }

  const { session_id, prompt, history, accessToken } = req.body;
  if (!session_id) {
    return response.ValidationError(res, "session id is required");
  }
  if (!prompt) {
    return response.ValidationError(res, "prompt is required");
  }
  if (!accessToken) {
    return response.ValidationError(res, "accessToken is required");
  }

  try {
    const chatResponse = await axios.post(
      process.env.AI_CHATBOT_CHAT_API,
      {
        emma_user_id: userId,
        session_id: session_id,
        prompt: prompt,
        history: [],
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const aiReply = chatResponse.data?.response || "No response from AI";

    const pool = await connectToDatabase();
    const request = pool.request();
    request.input("EmmaUserId", sql.UniqueIdentifier, userId);
    request.input("SessionId", sql.NVarChar(100), session_id);
    request.input("Prompt", sql.NVarChar(sql.MAX), prompt);
    request.input("Response", sql.NVarChar(sql.MAX), aiReply);
    await request.execute("sp_InsertEmmaChatbotConversation");

    return response.SuccessResponseWithData(res, "AI reply generated", {
      reply: aiReply,
    });
  } catch (error) {
    console.error("Error in chatAssistant:", error.message);
    return response.FailedResponseWithOutData(
      res,
      error.response?.data || error.message
    );
  }
};

exports.getChatHistory = async (req, res) => {
  const userId = req.user.userId;
  const { pageNumber = 1, pageSize = 10 } = req.query;

  try {
    const pool = await connectToDatabase();
    const request = await pool.request();

    request.input("EmmaUserId", sql.UniqueIdentifier, userId);
    request.input("StartDate", sql.DateTime, new Date("2000-01-01")); // optional
    request.input("EndDate", sql.DateTime, new Date());
    request.input("PageNumber", sql.Int, pageNumber);
    request.input("PageSize", sql.Int, pageSize);

    const result = await request.execute("sp_GetEmmaChatbotConversationsPaged");

    return response.SuccessResponseWithData(
      res,
      "Paged chat history fetched",
      result.recordset
    );
  } catch (error) {
    console.error("❌ Error fetching paged chat history:", error);
    return response.FailedResponseWithOutData(res, error.message);
  }
};
