import csv
import json
import os
import nltk
from datetime import datetime, timedelta
from nltk.sentiment import SentimentIntensityAnalyzer
from .google_get_news import scrape_google_news
from .tweets_get_news import scrape_finviz_tweets

# Set the path to the NLTK data
nltk.data.path.append('./')

# Download the Vader lexicon - REQUIRED FOR DEPLOY
# nltk.download('vader_lexicon')

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def get_csv_folder_path():
    return os.path.join(BASE_DIR, 'data')


def read_stock_news(filename):
    stock_news = []
    with open(filename, "r", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # Convert ISO 8601 date string to datetime object
            pub_date = datetime.strptime(row["Publication Date"], "%Y-%m-%d %H:%M:%S")
            row["Publication Date"] = pub_date
            stock_news.append(row)
    return stock_news

def filter_news_within_range(stock_news, days_back=14):
    today = datetime.now()
    min_date = today - timedelta(days=days_back)
    filtered_news = [article for article in stock_news if article["Publication Date"] >= min_date]
    print(f"{len(filtered_news)} relevant news articles found within the last {days_back} days.")
    return filtered_news

def read_tweets(filename):
    with open(filename, "r", encoding="utf-8") as jsonfile:
        tweets = json.load(jsonfile)
    return tweets

def analyze_sentiment(text):
    sia = SentimentIntensityAnalyzer()
    sentiment_score = sia.polarity_scores(text)["compound"]
    if sentiment_score > 0.02:
        return "Positive"
    elif sentiment_score < -0.02:
        return "Negative"
    else:
        return "Neutral"

def main(stock_symbol):
    # Scrape stock symbols
    scrape_google_news(stock_symbol)
    scrape_finviz_tweets(stock_symbol)

    # Read stock news
    stock_news = read_stock_news(os.path.join(get_csv_folder_path(),"stock_news.csv"))
    filtered_news = filter_news_within_range(stock_news)

    # Read tweets
    tweets = read_tweets(os.path.join(get_csv_folder_path(),"tweets.json"))

    if not filtered_news and not tweets:
        print("No relevant news or tweets found within the specified date range.")
        return

    total_sentiment = 0

    # Analyze sentiment for news
    for news in filtered_news:
        sentiment = analyze_sentiment(news["Title"])
        # print(f"Title: {news['Title']}")
        # print(f"Publication Date: {news['Publication Date']}")
        # print(f"Source: {news['Source']}")
        # print(f"Sentiment: {sentiment}")
        # print("----------------------------------------")
        if sentiment == "Positive":
            total_sentiment += 1
        elif sentiment == "Negative":
            total_sentiment -= 1

    # Analyze sentiment for tweets
    for tweet in tweets:
        sentiment = analyze_sentiment(tweet)
        if sentiment == "Positive":
            total_sentiment += 1
        elif sentiment == "Negative":
            total_sentiment -= 1

    overall_sentiment = "Positive" if total_sentiment > 0 else "Negative" if total_sentiment < 0 else "Neutral"
    print(f"Overall sentiment for the stock: {overall_sentiment}")
    return overall_sentiment

if __name__ == "__main__":
    main()


# main("TSLA")