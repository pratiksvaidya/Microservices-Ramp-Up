import arrow
import os
import pickle
import tweepy

from dynamodb import store_data

def get_tweets():
    """Shows basic usage of the Twitter API.
    Queries for tweets from the specified user's accounts and stores to DynamoDB.
    """
    auth = tweepy.OAuthHandler(os.environ['CONSUMER_KEY'], os.environ['CONSUMER_SECRET'])
    auth.set_access_token(os.environ['ACCESS_TOKEN'], os.environ['TOKEN_SECRET'])
    api = tweepy.API(auth)

    users = [
        'elonmusk',
        'realDonaldTrump',
        'BarackObama',
        'TheEconomist'
    ]

    # Metric queries
    query_start = arrow.utcnow().replace(minute=0, second=0).shift(hours=-1).timestamp
    query_end = arrow.utcnow().replace(minute=0, second=0).timestamp

    # Initialize data object
    data = {
        'id': query_start
    }

    # Run each of the queries against the API and store tweet count
    for user in users:
        print(f'--- {user} ---')
        tweets = api.user_timeline(screen_name=user)

        count = 0
        for tweet in tweets:
            tweet_timestamp = arrow.get(tweet.created_at).timestamp
            if tweet_timestamp < query_start:
                break
            elif tweet_timestamp <= query_end:
                count += 1
        
        print(count)
        data[user] = count

    # Store data to DynamoDB
    store_data('twitter-metrics', data)

if __name__ == '__main__':
    get_tweets()
