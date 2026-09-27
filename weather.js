const express = require('express');
const axios = require('axios');
const router = express.Router();

const BASE_URL = 'https://api.openweathermap.org/data/2.5';

function getApiKey() {
  const key = process.env.OPENWEATHER_API_KEY;
  if (!key || key === 'your_openweathermap_api_key_here') {
    return null;
  }
  return key;
}

// GET current weather by city name: /api/weather/current?city=London
router.get('/current', async (req, res) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENWEATHER_API_KEY. Add it to your .env file.' });
  }
  const { city, lat, lon } = req.query;
  try {
    const params = { appid: apiKey, units: 'metric' };
    if (city) params.q = city;
    else if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    } else {
      return res.status(400).json({ error: 'Provide a city name or lat/lon coordinates' });
    }
    const { data } = await axios.get(`${BASE_URL}/weather`, { params });
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.message || 'Failed to fetch current weather';
    res.status(status).json({ error: message });
  }
});

// GET 5-day / 3-hour forecast: /api/weather/forecast?city=London
router.get('/forecast', async (req, res) => {
  const apiKey = getApiKey();
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing OPENWEATHER_API_KEY. Add it to your .env file.' });
  }
  const { city, lat, lon } = req.query;
  try {
    const params = { appid: apiKey, units: 'metric' };
    if (city) params.q = city;
    else if (lat && lon) {
      params.lat = lat;
      params.lon = lon;
    } else {
      return res.status(400).json({ error: 'Provide a city name or lat/lon coordinates' });
    }
    const { data } = await axios.get(`${BASE_URL}/forecast`, { params });
    res.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.message || 'Failed to fetch forecast';
    res.status(status).json({ error: message });
  }
});

module.exports = router;
