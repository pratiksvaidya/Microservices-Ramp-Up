import arrow
import boto3
import json 

dynamodb = boto3.resource('dynamodb', region_name='us-east-1')

def store_data(table, data):
    table = dynamodb.Table(table)

    response = table.put_item(
        Item=data
    )

    print(json.dumps(response, indent=4))