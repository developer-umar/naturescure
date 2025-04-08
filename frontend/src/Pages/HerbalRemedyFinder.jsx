import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Data for remedies based on symptoms with healing info.
const remediesData = [
  {
    symptom: "Stress",
    remedy: "Ashwagandha",
    description: "Ashwagandha helps reduce stress and anxiety by acting as a potent adaptogen.",
    healingInfo: "It restores the body's natural balance, improves energy levels, and supports mental clarity.",
    image: "/images/ashwagandha.webp",
    // Additional detailed data (if available)
    details: "Detailed info about Ashwagandha: Dosage, preparation methods, and clinical studies."
  },
  {
    symptom: "Fever",
    remedy: "Tulsi",
    description: "Tulsi is known for fighting fever and boosting immunity against common colds.",
    healingInfo: "Tulsi helps in detoxification, reduces fever, and supports overall immune function.",
    image: "/images/tulsi.jpg",
    details: "Detailed info about Tulsi: Historical usage, recommended intake, and recipes."
  },
  {
    symptom: "Digestive Issues",
    remedy: "Ginger",
    description: "Ginger aids in digestion, reduces nausea, and soothes the stomach.",
    healingInfo: "It stimulates digestive juices, alleviates indigestion, and relieves stomach discomfort.",
    image: "/images/ginger.webp",
    details: "Detailed info about Ginger: Its active compounds, benefits for digestion, and preparation tips."
  },
  {
    symptom: "Skin Problems",
    remedy: "Aloe Vera",
    description: "Aloe Vera soothes skin irritations, burns, and inflammatory conditions.",
    healingInfo: "Its cooling gel promotes rapid healing, reduces inflammation, and moisturizes the skin.",
    image: "/images/aloera.jpg",
    details: "Detailed info about Aloe Vera: How to extract the gel, application methods, and benefits."
  },
  {
    symptom: "Fatigue",
    remedy: "Moringa",
    description: "Moringa is packed with vitamins and minerals that provide a natural energy boost.",
    healingInfo: "It revitalizes the body, combats fatigue, and supports overall health with essential nutrients.",
    image: "/images/moringa.jpg",
    details: "Detailed info about Moringa: Nutritional profile, best usage practices, and health benefits."
  },
  {
    symptom: "Inflammation",
    remedy: "Turmeric",
    description: "Turmeric's curcumin is a powerful anti-inflammatory compound that helps reduce swelling.",
    healingInfo: "It fights inflammation at the cellular level and supports joint and muscle health.",
    image: "/images/turmeric.webp",
    details: "Detailed info about Turmeric: How curcumin works, dosage recommendations, and research studies."
  },
  {
    symptom: "Cough",
    remedy: "Honey & Ginger",
    description: "Honey combined with ginger is a natural remedy to soothe cough and throat irritation.",
    healingInfo: "Honey coats the throat while ginger reduces irritation and combats infection.",
    image: "/images/honey_ginger.jpg",
    details: "Detailed info about Honey & Ginger: Benefits for cough, mixing ratios, and preparation methods."
  },
  {
    symptom: "Sneezing",
    remedy: "Peppermint Tea",
    description: "Peppermint tea helps relieve sneezing and clear nasal passages naturally.",
    healingInfo: "It provides a cooling effect, reduces congestion, and calms allergic reactions.",
    image: "/images/peppermint.jpg",
    details: "Detailed info about Peppermint Tea: How it helps allergies, brewing techniques, and benefits."
  }
];

// Framer Motion variants.
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 }
};

const buttonVariants = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 }
};

// RemedyCard Component: Displays a summary remedy card.
// We add an onClick handler to open the detailed modal.
const RemedyCard = ({ remedyData, onTap }) => {
  return (
    <motion.div
      key={remedyData.symptom}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6 }}
      className="mt-8 p-6 w-full max-w-md mx-auto bg-white rounded-xl shadow-2xl cursor-pointer"
      onClick={() => onTap(remedyData)}
    >
      <img
        src={remedyData.image}
        alt={remedyData.remedy}
        className="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h2 className="text-3xl font-extrabold text-gray-800 mb-2 tracking-wide">
        {remedyData.remedy}
      </h2>
      <p className="text-gray-700 text-lg mb-3">{remedyData.description}</p>
      <p className="text-gray-700">
        <span className="font-semibold">How it helps:</span> {remedyData.healingInfo}
      </p>
    </motion.div>
  );
};

// DetailedPlantModal Component: Displays the detailed plant card in a modal.
const DetailedPlantModal = ({ remedyData, onClose }) => {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-xl shadow-2xl max-w-3xl w-full p-10 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-3xl font-bold"
          >
            &times;
          </button>
          <img
            src={remedyData.image}
            alt={remedyData.remedy}
            className="w-full h-64 object-cover rounded mb-6"
          />
          <h2 className="text-5xl font-extrabold font-serif text-gray-800 mb-4 tracking-wide">
            {remedyData.remedy}
          </h2>
          <p className="text-2xl font-light text-gray-700 mb-4 leading-relaxed">
            {remedyData.description}
          </p>
          <p className="text-xl text-gray-700 leading-relaxed">
            <span className="font-bold">How it helps:</span> {remedyData.details}
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


// HerbalRemedyFinder Component: Main component for symptom selection and remedy display.
const HerbalRemedyFinder = () => {
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [detailedRemedy, setDetailedRemedy] = useState(null);

  const openDetailedModal = (remedyData) => {
    setDetailedRemedy(remedyData);
  };

  const closeDetailedModal = () => {
    setDetailedRemedy(null);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-indigo-900 to-blue-900 p-6">
      {/* Heading */}
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-black text-white mb-8 drop-shadow-lg tracking-wider"
      >
        Herbal Remedy Finder
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.0 }}
        className="text-xl text-white font-light mb-6 text-center max-w-2xl"
      >
        Select your symptom to find the recommended herbal remedy and tap the card to see detailed information.
      </motion.p>

      {/* Symptom Buttons */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="flex flex-wrap gap-4 justify-center"
      >
        {remediesData.map((item, index) => (
          <motion.button
            key={index}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            onClick={() => setSelectedSymptom(item)}
            className="px-5 py-3 bg-green-700 text-white text-lg rounded-lg shadow-md hover:bg-green-800 transition font-semibold"
          >
            {item.symptom}
          </motion.button>
        ))}
      </motion.div>

      {/* Remedy Card Display */}
      <AnimatePresence>
        {selectedSymptom && (
          <RemedyCard
            remedyData={selectedSymptom}
            onTap={openDetailedModal}
          />
        )}
      </AnimatePresence>

      {/* Detailed Modal Display */}
      {detailedRemedy && (
        <DetailedPlantModal remedyData={detailedRemedy} onClose={closeDetailedModal} />
      )}
    </div>
  );
};

export default HerbalRemedyFinder;
