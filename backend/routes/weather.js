const router = require("express").Router();
const ctrl = require("../controllers/weatherController");

// Coordinate-based endpoints MUST come before /:city to avoid "coords" being treated as a city name
router.get("/current/coords", ctrl.getCurrentWeatherByCoords);
router.get("/forecast/coords", ctrl.getForecastByCoords);
router.get("/suggestions", ctrl.getSuggestions);

// City-based endpoints
router.get("/current/:city", ctrl.getCurrentWeather);
router.get("/forecast/:city", ctrl.getForecast);
router.get("/history", ctrl.getHistory);

module.exports = router;