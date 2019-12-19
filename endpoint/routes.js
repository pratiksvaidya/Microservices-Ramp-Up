const AWS = require('aws-sdk');
const express = require('express');

const IS_OFFLINE = process.env.NODE_ENV !== 'production';
const METRICS_TABLE = process.env.TABLE;

const dynamoDb = IS_OFFLINE === true ?
    new AWS.DynamoDB.DocumentClient({
        region: 'us-east-1',
        endpoint: 'http://127.0.0.1:8080',
    }) :
    new AWS.DynamoDB.DocumentClient();
const router = express.Router();
router.get('/metrics', (req, res) => {
    const params = {
        TableName: METRICS_TABLE
    };
    dynamoDb.scan(params, (error, result) => {
        if (error) {
            res.status(400).json({ error: 'Error fetching the metric counts' });
        }
        res.json(result.Items);
    });
});
module.exports = router;