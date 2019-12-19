import arrow
import pickle
import os.path
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from google.auth.transport.requests import Request

from dynamodb import store_data

SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

def lambda_handler(event, context):
    """Shows basic usage of the Gmail API.
    Queries for metrics about user's Gmail messages and stores to DynamoDB.
    """
    creds = None
    # The file token.pickle stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists('token.pickle'):
        with open('token.pickle', 'rb') as token:
            creds = pickle.load(token)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        # else:
        #     flow = InstalledAppFlow.from_client_secrets_file(
        #         'credentials.json', SCOPES)
        #     creds = flow.run_local_server(port=0)
        # # Save the credentials for the next run
        # with open('token.pickle', 'wb') as token:
        #     pickle.dump(creds, token)

    service = build('gmail', 'v1', credentials=creds)

    # Metric queries
    query_date = arrow.now().replace(minute=0, second=0).shift(hours=-1).timestamp
    queries = {
        'incoming-gmail-msgs': f'from:(gmail.com) to:(pratik.vaidya425@gmail.com) after:{query_date}',
        'incoming-non-gmail-msgs': f'from:(!gmail.com) to:(pratik.vaidya425@gmail.com) after:{query_date}',
        'outgoing-gmail-msgs': f'to:(gmail.com) from:(pratik.vaidya425@gmail.com) after:{query_date}',
        'outgoing-non-gmail-msgs': f'to:(!gmail.com) from:(pratik.vaidya425@gmail.com) after:{query_date}',
    }

    # Initialize data object
    data = {
        'timestamp': query_date
    }

    # Run each of the queries against the API and store msg count
    for key, query in queries.items():
        print(f'--- {key} ---')
        # Call the Gmail API
        results = service.users().messages().list(userId='me', q=query).execute()
        messages = results.get('messages', [])

        if not messages:
            print('No messages found.')
        else:
            print('Message IDs:')
            for message in messages:
                print(message['id'])

        data[key] = len(messages)

    # Store data to DynamoDB
    store_data('gmail-metrics', data)

if __name__ == '__main__':
    lambda_handler(None, None)
