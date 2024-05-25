import csv
import os
from bs4 import BeautifulSoup
from datetime import datetime
from django.conf import settings
import requests


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def get_csv_folder_path():
    return os.path.join(BASE_DIR, 'data')



def get_stock_name(stock_symbol):
    with open(os.path.join(get_csv_folder_path(), "stock_symbols.csv"), "r", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            if row["Symbol"] == stock_symbol:
                return row["Name"].split()[0]  # Extracting the first word from the name
    return None

def scrape_google_news(stock_symbol):

    stock_name = get_stock_name(stock_symbol)
    if stock_name is None:
        print("Stock symbol not found in the stock_symbols.csv file.")
        return

    url=f"https://news.google.com/rss/search?q={stock_name}+stock+news&hl=en"
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")

    # Find all items in the RSS feed
    items = soup.find_all("item")

    # Sort items by publication date in descending order
    items.sort(key=lambda x: datetime.strptime(x.find("pubdate").text, "%a, %d %b %Y %H:%M:%S %Z"), reverse=True)

    # Create a CSV file and write headers
    with open(os.path.join(get_csv_folder_path(), "stock_news.csv"), "w", newline="", encoding="utf-8") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(["Title", "Link", "Publication Date", "Source"])

        # Loop through each item and extract relevant information
        for item in items:
            title = item.find("title").text
            link = item.find("link").text
            pub_date_tag = item.find("pubdate")
            pub_date_str = pub_date_tag.text if pub_date_tag else "N/A"
            
            # Convert date string to ISO 8601 format
            pub_date = datetime.strptime(pub_date_str, "%a, %d %b %Y %H:%M:%S %Z").strftime("%Y-%m-%d %H:%M:%S")
            
            source_tag = item.find("source")
            source = source_tag["url"] if source_tag else "N/A"

            # Print HTML content for debugging
            # print("HTML content of item:")
            # print(item)

            # Write data to CSV file
            writer.writerow([title, link, pub_date, source])

    print("Data has been scraped and saved to stock_news.csv")

# scrape_google_news("NVDA")
