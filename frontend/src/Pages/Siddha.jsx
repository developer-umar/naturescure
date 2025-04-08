import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import PlantCard from "../components/PlantCard";
import { fetch_siddha } from "../api/fetchPlants";

function Siddha() {
  const [plants, setPlants] = useState([]);

  useEffect(() => {
    const getPlants = async () => {
      try {
        const data = await fetch_siddha();
        // console.log("Fetched Plants:", data);
        if (Array.isArray(data)) {
          setPlants(data);
        } else {
          console.error("Data format incorrect:", data);
        }
      } catch (error) {
        console.error("Error fetching plants:", error);
      }
    };

    getPlants();
  }, []);

  return (
    <div className="p-10 space-y-12 bg-gradient-to-b from-green-50 to-green-100 min-h-screen">
      {/* Siddha Heading and Image Section */}
      <div className="flex flex-col md:flex-row items-center gap-10">
        
        {/* Text Section */}
        <motion.div 
          className="md:w-1/2 text-center md:text-left space-y-4"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-extrabold text-green-800">Siddha</h1>
          <p className="mt-4 text-gray-700 text-lg leading-relaxed">
            The **Siddha** system of medicine is one of the oldest traditional healing systems in the world, 
            originating in South India. It focuses on balancing the body's **three humors (Vatham, Pitham, and Kapham)** 
            using herbal remedies, minerals, and lifestyle changes.
          </p>
          <p className="text-gray-600 text-lg">
            Siddha medicine emphasizes purification, detoxification, and **holistic healing** to treat ailments and 
            enhance longevity through natural means.
          </p>
        </motion.div>

        {/* Image Section */}
        <motion.div 
          className="md:w-1/2 flex justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img 
            src="/images/siddha.jpg" 
            alt="Siddha" 
            className="w-full max-w-md rounded-3xl shadow-xl"
            loading="lazy"
          />
        </motion.div>
      </div>

      {/* Siddha Plants Section */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {plants.length === 0 ? (
          <p className="text-center text-gray-500 col-span-full">No plants found</p>
        ) : (
          plants.map((plant) => <PlantCard key={plant._id} plant={plant} />)
        )}
      </motion.div>
    </div>
  );
}

export default Siddha;
