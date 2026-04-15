import { motion } from "framer-motion";

export default function WeatherCard({ data }) {
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl mt-8 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] border border-white/20 relative overflow-hidden group"
    >
      {/* Decorative blurred background element */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none group-hover:bg-white/20 transition-all duration-700"></div>

      <div className="flex flex-col md:flex-row justify-between items-center z-10 relative">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <h2 className="text-3xl font-bold tracking-wide">
            {data.name}, <span className="font-light">{data.sys.country}</span>
          </h2>
          <p className="capitalize text-lg text-white/80 mt-1 font-medium tracking-wide">
            {data.weather[0].description}
          </p>
        </div>

        <div className="flex flex-col items-center">
            {/* We can use the OpenWeatherMap icons directly */}
            <img 
               src={`https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`} 
               alt={data.weather[0].description} 
               className="w-32 h-32 drop-shadow-xl -my-4 animate-[pulse_4s_ease-in-out_infinite]"
            />
        </div>

        <div className="text-center md:text-right mt-6 md:mt-0">
          <h1 className="text-7xl font-light tracking-tighter drop-shadow-lg">
            {Math.round(data.main.temp)}<span className="text-4xl">°C</span>
          </h1>
          <p className="text-white/80 font-medium">
             Feels like {Math.round(data.main.feels_like)}°C
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10 z-10 relative">
        <div className="flex flex-col items-center bg-black/5 rounded-2xl p-3">
           <span className="text-white/60 text-sm mb-1 uppercase tracking-wider font-semibold">Humidity</span>
           <span className="font-bold text-xl">{data.main.humidity}%</span>
        </div>
        <div className="flex flex-col items-center bg-black/5 rounded-2xl p-3">
           <span className="text-white/60 text-sm mb-1 uppercase tracking-wider font-semibold">Wind</span>
           <span className="font-bold text-xl">{data.wind.speed} m/s</span>
        </div>
        <div className="flex flex-col items-center bg-black/5 rounded-2xl p-3">
           <span className="text-white/60 text-sm mb-1 uppercase tracking-wider font-semibold">Pressure</span>
           <span className="font-bold text-xl">{data.main.pressure} hPa</span>
        </div>
        <div className="flex flex-col items-center bg-black/5 rounded-2xl p-3">
           <span className="text-white/60 text-sm mb-1 uppercase tracking-wider font-semibold">Visibility</span>
           <span className="font-bold text-xl">{(data.visibility / 1000).toFixed(1)} km</span>
        </div>
      </div>
    </motion.div>
  );
}