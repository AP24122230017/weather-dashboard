import { motion } from "framer-motion";

export default function SearchHistory({ history, onSelect }) {
  if (!history || !history.length) return null;

  return (
    <div className="mt-8 mb-12">
      <h3 className="text-sm font-semibold mb-3 text-white/70 uppercase tracking-widest px-2">
        Recent Searches
      </h3>
      <div className="flex flex-wrap gap-2">
        {history.map((h, i) => (
          <motion.button
            key={h._id || i}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.4)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(h.city)}
            className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium border border-white/20 shadow-sm transition-all"
          >
            {h.city.charAt(0).toUpperCase() + h.city.slice(1)}
          </motion.button>
        ))}
      </div>
    </div>
  );
}