import { useState } from "react";
import React from 'react';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";


function Categories() {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(`/categories/${path}`);
  };

  const Card = ({ image, title, description, onClick }) => {
    return (

    
      <motion.div
        className="bg-white shadow-xl rounded-xl p-6 w-72 text-center cursor-pointer transition-all hover:shadow-2xl hover:scale-105"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClick}
      >
        <img src={image} alt={title} className="w-full h-36 object-cover rounded-lg" />
        <h2 className="text-xl font-bold mt-3 text-gray-800">{title}</h2>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
      </motion.div>
    );
  };

  return (
   <div>


    
    <div className="flex flex-wrap justify-center gap-8 p-10 bg-gradient-to-r from-green-100 to-green-300 min-h-screen mt-2">
      <Card
        image="/images/ayurveda.png"
        title="Ayurveda"
        description="Ancient herbal medicine for holistic healing."
        onClick={() => handleNavigation("ayurveda")}
      />
      <Card
        image="/images/neuro.jpeg"
        title="Yoga & Naturopathy"
        description="Natural therapies and yoga for wellness."
        onClick={() => handleNavigation("naturopathy")}
      />
      <Card
        image="/images/unani.webp"
        title="Unani"
        description="Traditional healing based on natural elements."
        onClick={() => handleNavigation("unani")}
      />
      <Card
        image="images/siddha.jpg"
        title="Siddha"
        description="An ancient South Indian healing system."
        onClick={() => handleNavigation("siddha")}
      />
      <Card
        image="images/homeo.jpg"
        title="Homeopathy"
        description="Healing with natural diluted substances."
        onClick={() => handleNavigation("homeopathy")}
      />
    </div>
    </div>
  );
}

export default Categories;
