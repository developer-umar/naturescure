import { motion } from "framer-motion";

const HerbalWisdom = () => {
  return (
    <motion.div
      className="flex justify-center items-center min-h-[50vh] bg-gradient-to-r from-green-100 to-green-300 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        className="max-w-3xl bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-green-200"
        whileHover={{ scale: 1.02 }}
      >
        {/* Title with Animation */}
        <motion.h2
          className="text-2xl md:text-4xl font-bold text-green-700 mb-4 text-center"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
           Virtual Herbal Garden
        </motion.h2>

        {/* Description */}
        <motion.p
          className="text-gray-700 text-lg md:text-xl text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          The world of herbal medicine is vast and powerful, yet not everyone has access to 
          physical herbal gardens. Our <strong>Virtual Herbal Garden</strong> bridges this gap by bringing 
          centuries-old herbal wisdom into the digital world.
        </motion.p>
      </motion.div>
    </motion.div>
  );
};

export default HerbalWisdom;
