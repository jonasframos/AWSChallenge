const GetClassificationHistory = require("./services/GetClassificationHistory")

exports.lambdaHandler = async (event) => {
  try {

    //retrieving history from dynamo
    const history = await GetClassificationHistory.getClassificationHistory()

    return  {
      statusCode: 200,
      body: JSON.stringify(history)
    }

  } catch(e){
    console.error(e)
    return  {
      statusCode: 400,
      body: JSON.stringify(e)
    }
  }
}