module.exports = {
  SuccessResponseWithData: (res, msg, data) => {
    return res.status(200).json({
      statusCode: 200,
      message: msg,
      data: data,
    });
  },
  SuccessResponseWithDataCount: (res, msg, data, totalCount) => {
    return res.status(200).json({
      statusCode: 200,
      message: msg,
      data: data,
      totalCount: totalCount,
    });
  },

  SuccessResponseWithOutData: (res, msg) => {
    return res.status(200).json({
      statusCode: 200,
      message: msg,
    });
  },

  SuccessResponseWithNoData: (res, msg) => {
    return res.status(200).json({
      statusCode: 200,
      message: msg,
    });
  },

  FailedResponseWithOutData: (res, msg) => {
    return res.status(400).json({
      statusCode: 400,
      message: msg,
    });
  },
  InternalServerError: (res, e) => {
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: e.message,
    });
  },
  SomethingWentWrong: (res, e) => {
    return res.status(400).json({
      statusCode: 400,
      message: "Something Went Wrong",
      error: e.message,
    });
  },

  UnAuthorized: (res, msg) => {
    return res.status(401).json({
      statusCode: 401,
      message: msg,
    });
  },
  NotFound: (res, msg) => {
    return res.status(404).json({
      statusCode: 404,
      message: msg,
    });
  },
  DuplicateEmail: (res) => {
    return res.status(400).json({
      statusCode: 400,
      message: "Email already exist",
    });
  },
  ValidationError: (res, err) => {
    return res.status(422).json({
      statusCode: 422,
      message: err,
    });
  },

  TokenExpiredError: (res, e) => {
    return res.status(401).json({
      statusCode: 401,
      message: "Token Expired",
      error: e.message,
    });
  },
  Conflict: (res, msg) => {
    return res.status(409).json({
      statusCode: 409,
      message: msg,
    });
  },
};
