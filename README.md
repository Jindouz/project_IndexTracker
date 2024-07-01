# Index Tracker X
Index Tracker X is a comprehensive application designed to track the indices of NASDAQ and Crypto stocks. It allows users to choose a symbol and view the daily and weekly stock data on a chart and research real-time stock sentiment with an AI tool. Users can log in to download daily and weekly data of their chosen stock, add or remove stocks from their watchlist, manage their profiles, and recover passwords via email.  
  
The project is built using Django, React, TypeScript, Redux and PostgreSQL, ensuring a robust and responsive experience.

## Features

### Core Features
* **Stock Tracking:** Tracks NASDAQ and Crypto stocks, fetched from Python packages.
* **Chart Display:** Displays daily and weekly stock data on a chart.
* **User Authentication:** Login (JWT access/refresh tokens), register, password change (in the profile page).
* **PostgreSQL Database:** Stores data efficiently for streamlined retrieval and management.
* **Password Recovery via Email:** Users can initiate a password reset process that will send their registered email a link to reset their password and set a new one.
* **Watchlist:** Each registered user can manage his own watchlist. Users can add/remove chosen stocks to their watchlist, interacting with it will navigate them to the relevant page and load the stock of their choosing so they can view its data. (requires login)

### Data Handling
* **CSV Data:** Obtains daily and weekly stock data for NASDAQ and Crypto based on user-chosen symbols.
* **Market Status:** Alerts the user when the stock market opens and closes.
* **AI Sentiment Analysis:** Analyzes sentiment for a user's chosen stock based on current news and tweets. (gathers data, builds CSV files and analzyses them and decides if the data is Positive/Negative/Neutral)
* **Autocomplete Symbols:** Autocompletes stock symbol selection box from symbols CSV. Users can also search for stocks by their company name, for example searching 'tesla' will find 'TSLA' etc.
* **CSV Data Download:** Users can download daily/weekly CSV stock data (requires login).

### User Interface
* **Mobile Compatibility:** Fully responsive and mobile-friendly design.
* **GUI Frameworks:** Utilizes MUI, Bootstrap, and Animate.CSS for a modern user interface.
* **TradingView Widgets:** Includes widgets for viewing stock news and volume data.

### Backend Features
* **JWT Authentication:** Implements a JWT system for secure login and session management.
* **Login Logger:** A decorator that allows admin users to track login logs, viewable in an admin page component in the frontend.
* **Django Unittest:** Backend testing with python manage.py test.


## Installation

### Prerequisites
* Python 3.x
* Node.js
* Docker Desktop
* The .env file for Django (put in backend/myproj)

## Backend Setup
1. **Clone the Repository**
```
git clone https://github.com/Jindouz/project_IndexTracker.git

cd backend
```

2. **Create Virtual Environment**

```
python -m virtualenv env

env\Scripts\activate
```

3. **Install Dependencies**

```
pip install -r requirements.txt
```

4. **Start The Django Server**  
```
python manage.py runserver
```

## Frontend Setup

1. **Navigate to Frontend Directory**
```
cd ../frontend
```

2. **Install Dependencies**
```
npm install
```

3. **Start the React Server**
```
npm start
```

## Docker Setup
1. **Navigate to Project Directory (where docker-compose.yml is)**

```
cd ..
```

2. **Run Docker Compose**
```
docker-compose pull
docker-compose up
```

## Quick Docker-Compose Setup without Git
**docker-compose.yml**
```
version: '3'

services:
  backend:
    build: ./backend
    image: jindouz/project-stocks-compose-backend:latest
    ports:
      - "8000:8000"
    

  frontend:
    build: ./frontend
    image: jindouz/project-stocks-compose-frontend:latest
    ports:
      - "3000:3000"
  
```
Create docker-compose.yml with the above data and run the following commands in the same folder to download and start both the backend and frontend dockers together.
```
docker-compose pull
docker-compose up
```
When the dockers containers are activated open http://localhost:3000/ in a browser to use the app.
```
#to turn off the containers use CTRL+C in the terminal or:
docker-compose down
```


## Individual Docker Images

* **Backend Docker Image:** 
```
docker pull jindouz/project-stocks-compose-backend:latest

```
* **Frontend Docker Image:** 
```
docker pull jindouz/project-stocks-compose-frontend:latest
```

## Running Tests
To run backend tests, use:

```
cd backend
python manage.py test --keepdb
```

## Usage
Open your web browser and navigate to http://localhost:3000.  
(Admin Credentials: waga1/123)

## Deployed Website
https://index-tracker.netlify.app  

## Screenshots
### Homepage
<a href="https://i.imgur.com/r39RHeM.jpeg">
  <img src="https://i.imgur.com/r39RHeM.jpeg" alt="Alt text" style="max-width: 900px;">
</a>

### AI Sentiment
<a href="https://i.imgur.com/kP1LVCU.png">
  <img src="https://i.imgur.com/kP1LVCU.png" alt="Alt text" style="max-width: 900px;">
</a>

### Watchlist
<a href="https://i.imgur.com/RHJonKi.jpeg">
  <img src="https://i.imgur.com/RHJonKi.jpeg" alt="Alt text" style="max-width: 900px;">
</a>


### License
This project is licensed under the MIT License.


Made by Jindouz (2024)

