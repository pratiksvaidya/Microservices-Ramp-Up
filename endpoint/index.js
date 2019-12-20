// https://firstclassjs.com/serverless-crud-api-using-aws-lambda-dynamodb-api-gateway-and-node-js/

const awsServerlessExpress = require('aws-serverless-express')
const app = require('./app')
const server = awsServerlessExpress.createServer(app)
exports.handler = (event, context) => { awsServerlessExpress.proxy(server, event, context) }