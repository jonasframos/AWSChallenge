const tableName = process.env.dynamodbTableName
const AWS = require("aws-sdk")
const dynamoClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

module.exports.getClassificationHistory = async () => {
    try{
        //assembling the params for the query
        const params = {
            TableName: tableName,
            ProjectionExpression: "id, dimension1, dimension2, dimension3, classification, createdAt"
        }

        //querying results
        const data = await dynamoClient.scan(params).promise();
        return data
    } catch(e) {
        throw e
    }
} 

