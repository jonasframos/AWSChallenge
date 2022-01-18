const AWS = require("aws-sdk")
const dynamoClient = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

module.exports = { dynamoCliente }