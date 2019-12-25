from get_emails import get_messages
from get_tweets import get_tweets

def lambda_handler(event, context):
    get_messages()
    get_tweets()

if __name__ == '__main__':
    lambda_handler(None, None)
