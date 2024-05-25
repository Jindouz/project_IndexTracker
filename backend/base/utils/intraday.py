import os
from django.conf import settings
import yfinance as yf
import pandas as pd
import pytz
from datetime import datetime, timedelta


BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

def get_csv_folder_path():
    return os.path.join(BASE_DIR, 'data')


# Function to fetch intraday data and save it to CSV
def intraday_daily(symbol):
    try:
        # Calculate the end date
        current_time = datetime.now()
        # Define the current time as Eastern Timezone
        eastern = pytz.timezone('US/Eastern')
        # Convert UTC time to Eastern Time
        end_date = current_time.astimezone(eastern)
        # start_date = (end_date - timedelta(hours=24)).strftime('%Y-%m-%d')
        start_date = end_date - timedelta(hours=24)

        # Fetch the intraday stock data for the last 24 hours
        # start_date = (datetime.now() - timedelta(hours=24)).strftime('%Y-%m-%d')

        data = yf.download(tickers=symbol, start=start_date, interval='1m', progress=False)
        
        # Check if the data is empty or contains error messages
        if data.empty:
            print(f"No data available for symbol '{symbol}'. Trying '{symbol}-USD' instead.")
            data = yf.download(tickers=f"{symbol}-USD", start=start_date, interval='1m', progress=False)
        
        if data.empty:
            print(f"No data available for symbol '{symbol}' or '{symbol}-USD'.")
            return None
        elif 'Error' in data.columns:
            print(f"Error fetching data for symbol '{symbol}': {data['Error'].iloc[0]}")
            return None
        
        # csv_file = f'Intraday_24h.csv'
        csv_file = os.path.join(get_csv_folder_path(), 'Intraday_24h.csv')

        # Save the data to a CSV file
        data.to_csv(csv_file)

        print(f"Data has been saved to {csv_file}")

        return csv_file  # Return the CSV file path
    except Exception as e:
        print(f"Error fetching data for symbol '{symbol}': {str(e)}")
        return None



def intraday_weekly(symbol):
    try:
        # Fetch the intraday stock data from the last week
        # start_date = (datetime.now() - timedelta(days=6)).strftime('%Y-%m-%d')
        # Calculate the end date
        current_time = datetime.now()
        # Define the current time as Eastern Timezone
        eastern = pytz.timezone('US/Eastern')
        # Convert UTC time to Eastern Time
        end_date = current_time.astimezone(eastern)
        # start_date = (end_date - timedelta(days=6)).strftime('%Y-%m-%d')
        start_date = end_date - timedelta(days=6)

        data = yf.download(tickers=symbol, start=start_date, interval='1m', progress=False)
        
        # Check if the data is empty or contains error messages
        if data.empty:
            print(f"No data available for symbol '{symbol}'. Trying '{symbol}-USD' instead.")
            data = yf.download(tickers=f"{symbol}-USD", start=start_date, interval='1m', progress=False)
        
        if data.empty:
            print(f"No data available for symbol '{symbol}' or '{symbol}-USD'.")
            return None
        elif 'Error' in data.columns:
            print(f"Error fetching data for symbol '{symbol}': {data['Error'].iloc[0]}")
            return None
        
        # csv_file = f'Intraday_7days.csv'
        csv_file = os.path.join(get_csv_folder_path(), 'Intraday_7days.csv')

        # Save the data to a CSV file
        data.to_csv(csv_file)

        print(f"Data has been saved to {csv_file}")

        return csv_file  # Return the CSV file path
    except Exception as e:
        print(f"Error fetching data for symbol '{symbol}': {str(e)}")
        return None

# intraday_weekly("TSLA")
# intraday_daily("TSLA")