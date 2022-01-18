const tableName = process.env.dynamodbTableName
const { v4 } = require('uuid')
const AWS = require("aws-sdk")
const dynamoClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

module.exports.saveClassification = async (dimension1, dimension2, dimension3, classification) => {
    try{
        //validating lambda tableName env var
        if(!tableName) throw new Error('Missing table name')
        
        //assembling params
        const uid = v4()
        const params = {
            TableName: tableName,
            Item: {
                id: uid,
                dimension1: dimension1,
                dimension2: dimension2,
                dimension3: dimension3,
                classification: classification,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        }

        //inserting to the database
        await dynamoClient.put(params).promise()

        //logging the newly inserted item
        console.log('New history entry created:\n')
        console.table(params)
        
        return uid
    } catch(e) {
        throw e
    }
} 

