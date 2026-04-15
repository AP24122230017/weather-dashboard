const cache = require("node-cache");
const NodeCache = new cache({ stdTTL: 600 });

const {
  fetchCurrentWeather,
  fetchForecast,
  fetchCurrentWeatherByCoords,
  fetchForecastByCoords,
  fetchSuggestions,
} = require("../services/weatherService");

const Search = require("../models/Search");

exports.getCurrentWeather = async (req, res) => {
  const key = `weather_${req.params.city.toLowerCase()}`;
  if (NodeCache.has(key)) return res.json(NodeCache.get(key));

  try {
    const data = await fetchCurrentWeather(req.params.city);
    NodeCache.set(key, data);
    
    // Save to history async
    Search.create({ city: req.params.city }).catch(() => {});
    
    res.json(data);
  } catch {
    res.status(404).json({ message: "City not found" });
  }
};

exports.getForecast = async (req, res) => {
  const key = `forecast_${req.params.city.toLowerCase()}`;
  if (NodeCache.has(key)) return res.json(NodeCache.get(key));

  try {
    const data = await fetchForecast(req.params.city);
    NodeCache.set(key, data);
    res.json(data);
  } catch {
    res.status(404).json({ message: "Error fetching forecast" });
  }
};

exports.getCurrentWeatherByCoords = async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ message: "Missing coordinates" });
  
  const key = `weather_${lat}_${lon}`;
  if (NodeCache.has(key)) return res.json(NodeCache.get(key));

  try {
    const data = await fetchCurrentWeatherByCoords(lat, lon);
    NodeCache.set(key, data);
    
    // Attempt to save city name resolving from coordinates to history
    if (data.name) {
       Search.create({ city: data.name }).catch(() => {});
    }

    res.json(data);
  } catch (error) {
    res.status(404).json({ message: "Location not found" });
  }
};

exports.getForecastByCoords = async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) return res.status(400).json({ message: "Missing coordinates" });

  const key = `forecast_${lat}_${lon}`;
  if (NodeCache.has(key)) return res.json(NodeCache.get(key));

  try {
    const data = await fetchForecastByCoords(lat, lon);
    NodeCache.set(key, data);
    res.json(data);
  } catch {
    res.status(404).json({ message: "Error fetching forecast" });
  }
};

exports.getSuggestions = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: "Missing query" });

  const key = `suggest_${q.toLowerCase()}`;
  if (NodeCache.has(key)) return res.json(NodeCache.get(key));

  try {
    const data = await fetchSuggestions(q);
    NodeCache.set(key, data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch suggestions" });
  }
};

exports.getHistory = async (req, res) => {
  try {
      const data = await Search.find().sort({ createdAt: -1 }).limit(10);
      res.json(data);
  } catch {
      res.status(500).json({ message: "Error fetching history" });
  }
};