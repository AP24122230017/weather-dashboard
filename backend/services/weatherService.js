const axios = require("axios");

const api = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5",
  timeout: 5000,
});

exports.fetchCurrentWeather = async (city) => {
  const res = await api.get("/weather", {
    params: {
      q: city,
      appid: process.env.OPENWEATHER_API_KEY,
      units: "metric",
    },
  });
  return res.data;
};

exports.fetchForecast = async (city) => {
  const res = await api.get("/forecast", {
    params: {
      q: city,
      appid: process.env.OPENWEATHER_API_KEY,
      units: "metric",
    },
  });
  return res.data;
};

exports.fetchCurrentWeatherByCoords = async (lat, lon) => {
  const res = await api.get("/weather", {
    params: {
      lat,
      lon,
      appid: process.env.OPENWEATHER_API_KEY,
      units: "metric",
    },
  });
  return res.data;
};

exports.fetchForecastByCoords = async (lat, lon) => {
  const res = await api.get("/forecast", {
    params: {
      lat,
      lon,
      appid: process.env.OPENWEATHER_API_KEY,
      units: "metric",
    },
  });
  return res.data;
};

exports.fetchSuggestions = async (query) => {
  const res = await axios.get("https://api.openweathermap.org/geo/1.0/direct", {
    params: {
      q: query,
      limit: 5,
      appid: process.env.OPENWEATHER_API_KEY,
    },
  });
  return res.data;
};