import { motion } from "framer-motion";

const HerbalIntro = () => {
  return (
    <motion.div
      className="flex justify-center items-center min-h-[50vh] bg-gradient-to-r from-green-700 to-green-500 p-6 mt-6 mb-4"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-3xl text-center text-white">
        {/* Animated Title */}
        <motion.h1
          className="text-3xl md:text-5xl font-extrabold mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
        >
          Discover Our Traditional Herbs <br />
          <motion.span
            className="text-yellow-300"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          >
            Virtually
          </motion.span>
        </motion.h1>

        {/* Animated Paragraph */}
        <motion.p
          className="text-lg md:text-xl text-white/90"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Explore the rich world of herbal medicine from the comfort of your home.  
          Learn about ancient remedies, medicinal benefits, and the healing power of nature.
        </motion.p>
      </div>
    </motion.div>
  );
};

export default HerbalIntro;
