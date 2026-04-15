import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

export default function SearchBar({ onSearch, onLocation }) {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const typingTimeoutRef = useRef(null);
  
  // Debounce fetching suggestions
  useEffect(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    if (city.trim().length > 2) {
        typingTimeoutRef.current = setTimeout(async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/weather/suggestions", {
                    params: { q: city.trim() }
                });
                setSuggestions(res.data);
                setShowDropdown(true);
            } catch (err) {
                console.error("Failed to fetch suggestions", err);
            }
        }, 500); // 500ms debounce for suggestions
    } else {
        setSuggestions([]);
        setShowDropdown(false);
    }
    
    return () => {
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current);
        }
    };
  }, [city]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (city.trim()) {
      setShowDropdown(false);
      onSearch(city.trim());
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCity(suggestion.name);
    setShowDropdown(false);
    // Passing "City, Country" is supported by OpenWeatherMap API and improves accuracy.
    onSearch(`${suggestion.name},${suggestion.country}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full mt-6 relative z-50">
      <div className="relative flex-1">
        <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onFocus={() => { if(suggestions.length > 0) setShowDropdown(true); }}
            onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // delay to allow onClick to fire
            placeholder="Search for a city..."
            className="w-full p-4 pl-5 pr-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-white placeholder-white/60 outline-none focus:bg-white/20 focus:ring-2 focus:ring-white/50 transition-all shadow-xl font-medium text-lg"
            autoComplete="off"
        />
        <svg xmlns="http://www.w3.org/2000/svg" className="absolute right-4 top-1/2 -translate-y-1/2 h-6 w-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>

        <AnimatePresence>
            {showDropdown && suggestions.length > 0 && (
                <motion.div 
                   initial={{ opacity: 0, y: -10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="absolute top-full left-0 right-0 mt-2 bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden z-50"
                >
                   {suggestions.map((s, i) => (
                       <div 
                         key={`${s.name}-${s.lat}-${s.lon}-${i}`}
                         onClick={() => handleSuggestionClick(s)}
                         className="px-5 py-3 hover:bg-white/30 cursor-pointer text-white border-b border-white/10 last:border-b-0 transition-colors flex justify-between items-center"
                       >
                           <span className="font-semibold text-lg">{s.name}</span>
                           <span className="text-sm opacity-80">{s.state ? `${s.state}, ` : ''}{s.country}</span>
                       </div>
                   ))}
                </motion.div>
            )}
        </AnimatePresence>
      </div>

      {onLocation && (
          <motion.button 
              type="button"
              onClick={onLocation}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-blue-500/30 hover:bg-blue-500/50 p-4 rounded-2xl backdrop-blur-md border border-white/20 transition-colors shadow-lg flex items-center justify-center shrink-0"
              title="Use current location"
          >
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </motion.button>
      )}
    </form>
  );
}