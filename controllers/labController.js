const { connectToDatabase } = require('../config/config');
const sql = require('mssql');
const response = require('../common/response');
const { getUserById } = require('../helpers/userHelper'); // Add this line

// Get results by Kit Order ID
exports.getResultsByKit = async (req, res) => {
  const { kitOrderId } = req.params;

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('KitId', sql.NVarChar, kitOrderId)
      .execute('pwa_GetResultsByKit');

    if (result.recordset.length === 0) {
      return response.NotFound(res, 'No results found for the given Kit Order ID');
    }

    console.log("rsult",result);
    // Extract and parse the nested JSON data
    let parsedResults;
    try {
      parsedResults = result.recordset.map((record) => {
        // The key "JSON_F52E2B61-18A1-11d1-B105-00805F49916B" holds the JSON string
        const jsonDataKey = Object.keys(record)[0]; // Dynamically get the key
        return JSON.parse(record[jsonDataKey]);
      });
    } catch (parseError) {
      console.error('Error parsing JSON response:', parseError);
      return response.InternalServerError(res, 'Failed to parse results data');
    }

    // Extract meaningful data
    const formattedResults = parsedResults.map(({ RESULTS }) => ({
      OrderNo: RESULTS[0].OrderNo,
      DateReported: RESULTS[0].DateReported,
      DateCollected: RESULTS[0].DateCollected,
      DateReceived: RESULTS[0].DateReceived,
      Overview: RESULTS[0]["RESULTS OVERVIEW"],
      DownloadResultsURL: RESULTS[0].DownloadResultsURL,
      QuickOverview: RESULTS[0]["Quick Overview"],
      MicrobiomeCompositionSummary: RESULTS[0]["Microbiome Composition Summary"],
      Microbiome: RESULTS[0].Microbiome,
      CompoundScores: RESULTS[0].CompoundScores,
      Metabolites: RESULTS[0].Metabolites,
      'Digestive Function' :RESULTS[0]["Digestive Function"],
      'Inflammation and Immunity' :RESULTS[0]['Inflammation and Immunity'],
    }));

    // Send structured response
    response.SuccessResponseWithData(res, 'Results retrieved successfully', formattedResults);
  } catch (err) {
    console.error('Error retrieving results by Kit Order ID:', err);
    response.InternalServerError(res, 'Failed to retrieve results');
  }
};

// Get lab result detail by metric
exports.getLabResultDetailByMetric = async (req, res) => {
  const { kitOrderId, metricId } = req.query;

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('KitOrderId', sql.NVarChar, kitOrderId)
      .input('MetricId', sql.Int, metricId)
      .execute('pwa_GetLabResultDetailByMetric');

    if (result.recordset.length === 0) {
      return response.NotFound(res, 'No lab result details found for the given Kit Order ID and Metric ID');
    }

    response.SuccessResponseWithData(res, 'Lab result details retrieved successfully', result.recordset);
  } catch (err) {
    console.error('Error retrieving lab result details by metric:', err);
    response.InternalServerError(res, 'Failed to retrieve lab result details');
  }
};

// Get lab order details
exports.getLabOrderDetails = async (req, res) => {
  const { orderNo } = req.params;
  const userId = req.user.userId; // Get userId from decoded token

  // Check if user exists
  const user = await getUserById(userId);
  if (!user) {
    return response.NotFound(res, 'User not found');
  }

  try {
    const pool = await connectToDatabase();
    const result = await pool.request()
      .input('OrderNo', sql.NVarChar, orderNo)
      .query(`
        SELECT 
          lod.LabOrderDetailId,
          lod.OrderNo,
          lod.DateCollected,
          lod.DateReceived,
          lod.DateReported,
          lod.OrderComments,
          lod.LabComments,
          lod.PhysicianName,
          lod.GdxClientId,
          lod.PatientId,
          lod.PatientAge,
          lod.CreateDate,
          lod.UpdateDate,
          lod.LabOrderHeaderId,
          lod.MemberId,
          loh.PatientFirstName,
          loh.PatientLastName,
          loh.PatientDateOfBirth
        FROM LabOrderDetail lod
        INNER JOIN LabOrderHeader loh ON loh.OrderNo = lod.OrderNo
        WHERE lod.OrderNo = @OrderNo
      `);

    if (result.recordset.length === 0) {
      return response.NotFound(res, 'Lab order not found');
    }

    response.SuccessResponseWithData(res, 'Lab order details retrieved successfully', result.recordset[0]);
  } catch (err) {
    console.error('Error retrieving lab order details:', err);
    response.InternalServerError(res, 'Failed to retrieve lab order details');
  }
};
