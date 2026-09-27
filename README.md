# Weather Forecast App

A weather web app showing current conditions and a 5-day forecast for any city (or your current location), built with **Node.js, Express** and **HTML/CSS/vanilla JavaScript**, powered by the **OpenWeatherMap API**.

## Features
- Search weather by city name
- Or use "📍 my location" (browser geolocation) for local weather
- Current temperature, feels-like, humidity, wind speed, and condition icon
- 5-day forecast strip with daily icons and temperatures
- API key kept safely on the server (never exposed to the browser)

## Tech Stack
- Backend: Node.js, Express, Axios (proxies OpenWeatherMap so the API key stays secret)
- Frontend: HTML, CSS, vanilla JavaScript (fetch API, Geolocation API)
- External API: [OpenWeatherMap](https://openweathermap.org/api)

## Project Structure
```
weather-forecast-app/
├── server/
│   ├── index.js
│   └── routes/weather.js     # proxies OpenWeatherMap current + forecast endpoints
├── public/
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
├── .env.example
├── .gitignore
└── package.json
```

## Setup & Run Locally
1. **Get a free API key**: sign up at [openweathermap.org/api](https://openweathermap.org/api) → generate an API key (it can take a few minutes to activate after signup)
2. `npm install`
3. `cp .env.example .env` and paste your key into `OPENWEATHER_API_KEY`
4. `npm start` (or `npm run dev`)
5. Open **http://localhost:5004**

## API Endpoints (your own backend, proxying OpenWeatherMap)

| Method | Endpoint                                  | Description                          |
|--------|--------------------------------------------|----------------------------------------|
| GET    | /api/weather/current?city=London           | Current weather by city name          |
| GET    | /api/weather/current?lat=..&lon=..         | Current weather by coordinates        |
| GET    | /api/weather/forecast?city=London          | 5-day / 3-hour forecast by city       |
| GET    | /api/weather/forecast?lat=..&lon=..        | 5-day / 3-hour forecast by coordinates|

## Pushing to GitHub
```bash
cd weather-forecast-app
git init
git add .
git commit -m "Initial commit: Weather Forecast App"
git branch -M main
git remote add origin https://github.com/<your-username>/weather-forecast-app.git
git push -u origin main
```

## Internship Note
Built as part of the CODTECH internship.

**Intern ID:** CITS7667
