import { motion } from "framer-motion";

export default function ForecastCard({ data }) {
  if (!data) return null;

  // Filter for one forecast per day (e.g., at 12:00 PM usually index 4 roughly for middle of day)
  // Let's filter by the first occurrence of each day
  const dailyMap = new Map();
  data.list.forEach((item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!dailyMap.has(date)) {
        dailyMap.set(date, item);
    }
  });

  // Convert to array and take next 5 days
  const daily = Array.from(dailyMap.values()).slice(1, 6);

  if (daily.length === 0) return null;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemAnim = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-white/90 px-2 tracking-wide">5-Day Forecast</h3>
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 md:grid-cols-5 gap-3"
      >
        {daily.map((d) => (
          <motion.div 
            variants={itemAnim}
            key={d.dt} 
            className="bg-white/10 backdrop-blur-lg p-4 rounded-2xl text-center border border-white/20 shadow-lg hover:bg-white/20 transition-colors duration-300 group"
          >
            <p className="text-white/80 text-sm font-medium uppercase tracking-wider mb-2">
              {new Date(d.dt * 1000).toLocaleDateString("en", {
                weekday: "short"
              })}
            </p>
            
            <img 
               src={`https://openweathermap.org/img/wn/${d.weather[0].icon}@2x.png`} 
               alt={d.weather[0].description} 
               className="w-16 h-16 mx-auto drop-shadow-md group-hover:scale-110 transition-transform duration-300"
            />
            
            <p className="font-bold text-2xl mt-1">{Math.round(d.main.temp)}°</p>
            <p className="text-xs text-white/60 mt-1 capitalize truncate px-1" title={d.weather[0].description}>
                {d.weather[0].description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}