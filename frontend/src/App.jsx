import { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "./components/SearchBar";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import SearchHistory from "./components/SearchHistory";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "./api";

function App() {
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchHistory = async () => {
    try {
      const res = await api.get("/history");
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history");
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearch = async (city) => {
  setLoading(true);
  setError("");

  try {
    const [weatherRes, forecastRes] = await Promise.all([
      api.get(`/current/${city}`),
      api.get(`/forecast/${city}`)
    ]);

    setWeather(weatherRes.data);
    setForecast(forecastRes.data);
    fetchHistory();
  } catch (err) {
    console.log(err);
    setError("Failed to fetch weather");
    setWeather(null);
    setForecast(null);
  } finally {
    setLoading(false);
  }
};

  const handleLocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      setError(null);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const [weatherRes, forecastRes] = await Promise.all([
              api.get(`/current/coords`, { params: { lat: latitude, lon: longitude } }),
              api.get(`/forecast/coords`, { params: { lat: latitude, lon: longitude } }),
            ]);
            setWeather(weatherRes.data);
            setForecast(forecastRes.data);
            fetchHistory();
          } catch (err) {
            setError("Failed to fetch location weather");
            setWeather(null);
            setForecast(null);
          } finally {
            setLoading(false);
          }
        },
        (err) => {
          console.error(err);
         // Fallback explicitly requested
          handleSearch("London"); 
        }
      );
    } else {
      handleSearch("London");
    }
  };

  useEffect(() => {
    // Initial fetch based on location or default
    handleLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getBgClass = () => {
    // Elegant, soft default theme
    if (!weather) return "from-sky-200 via-sky-300 to-blue-400";
    
    const main = weather.weather[0].main.toLowerCase();
    const icon = weather.weather[0].icon; // Ends with 'd' for day, 'n' for night
    const isNight = icon.endsWith('n');

    if (isNight) {
        // Deep, elegant night sky
        return "from-slate-900 via-indigo-900 to-purple-950";
    }
    
    if (main.includes("clear")) {
        // Soft, vibrant day sky
        return "from-sky-300 via-cyan-400 to-blue-500";
    }
    if (main.includes("rain") || main.includes("drizzle")) {
        // Moody, cool grey-blue
        return "from-slate-500 via-slate-600 to-slate-800";
    }
    if (main.includes("thunderstorm")) {
        // Deep purple/slate for storms
        return "from-indigo-950 via-slate-900 to-black";
    }
    if (main.includes("clouds")) {
        // Soft overcast
        return "from-slate-300 via-gray-400 to-slate-500";
    }
    if (main.includes("snow")) {
        // Crisp, bright winter day
        return "from-blue-50 via-sky-100 to-blue-200";
    }
    
    return "from-sky-400 via-blue-500 to-indigo-600";
  };

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br transition-all duration-1000 ease-in-out ${getBgClass()} overflow-x-hidden p-0 m-0 fixed inset-0 overflow-y-auto`}>
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 text-white/90">
        <motion.div
           initial={{ opacity: 0, y: -20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-center drop-shadow-xl mb-8 flex items-center justify-center gap-3">
             <span className="text-white">Weather</span>
             <span className="font-light text-white/70">Dashboard</span>
          </h1>

          <SearchBar onSearch={handleSearch} onLocation={handleLocation} />

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center h-40 mt-8"
              >
                <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin shadow-lg"></div>
              </motion.div>
            ) : error ? (
              <motion.div
                key="error"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center bg-red-500/30 backdrop-blur-md rounded-2xl p-4 mt-6 border border-red-500/20"
              >
                <p className="text-red-100">{error}</p>
              </motion.div>
            ) : (
              <motion.div
                 key="content"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ duration: 0.5 }}
              >
                <WeatherCard data={weather} />
                <ForecastCard data={forecast} />
                <SearchHistory history={history} onSelect={handleSearch} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

export default App;