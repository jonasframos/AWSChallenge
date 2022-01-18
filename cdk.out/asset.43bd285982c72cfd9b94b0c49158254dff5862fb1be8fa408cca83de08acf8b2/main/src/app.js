const ClassifyTriangleService = require("./services/ClassifyTriangle")
const SaveClassificationService = require("./services/SaveClassificationHistory")

exports.lambdaHandler = async (event) => {
  try {

    //Validating incoming data
    const body = JSON.parse(event.body)
    const dimension1 = body.dimension1 ? body.dimension1 : undefined
    const dimension2 = body.dimension2 ? body.dimension2 : undefined
    const dimension3 = body.dimension3 ? body.dimension3 : undefined
    if(!dimension1 || !dimension2 || !dimension3) throw new Error('dimension1, dimension2 and dimension3 are required')
    
    //Classifying the triangle
    const classification = await ClassifyTriangleService.classifyTriangle(dimension1, dimension2, dimension3)
    //Saving the history to the database
    const uid = await SaveClassificationService.saveClassification(dimension1, dimension2, dimension3, classification)

    return  {
      statusCode: 200,
      body: JSON.stringify({uid, classification})
    }

  } catch(e){
    
    console.error(e)
    return  {
      statusCode: 400,
      body: JSON.stringify(e)
    }
  }
}