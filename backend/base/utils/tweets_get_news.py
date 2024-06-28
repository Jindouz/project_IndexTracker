# this script is used to get stock related tweets from stocktwits
# it uses the requests library

import os
import requests
import json

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def get_csv_folder_path():
    return os.path.join(BASE_DIR, 'data')


def scrape_finviz_tweets(stock_symbol):
    print(f"Scraping news and tweets for {stock_symbol}...")
    # Initialize the headers to simulate a browser request
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3"
    }
    
    # Make a request to the StockTwits API to fetch the tweets
    url = f"https://api.stocktwits.com/api/2/streams/symbol/{stock_symbol}.json"
    response = requests.get(url, headers=headers)

    if response.ok:
        data = response.json()
        if "messages" in data:
            # Extract tweet messages from the API response
            tweets = [message["body"] for message in data["messages"]]
        else:
            print("No tweets found.")
            tweets = []
    else:
        print("Failed to fetch tweets.")
        tweets = []

    # Print the first few tweets
    # print("First few tweets:")
    # for tweet in tweets[:5]:
    #     print(tweet)

    # Save the tweets to a JSON file
    if tweets:
        with open(os.path.join(get_csv_folder_path(),"tweets.json"), "w", encoding="utf-8") as jsonfile:
            json.dump(tweets, jsonfile, ensure_ascii=False, indent=4)

        print("Tweets have been scraped and saved.")
    else:
        print("No tweets to save.")

# scrape_finviz_tweets("TSLA")

