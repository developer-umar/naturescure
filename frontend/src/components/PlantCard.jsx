import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const PlantCard = ({ plant }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!plant._id) {
      console.error("Plant ID is missing:", plant);
      return;
    }

    
    navigate(`/plants/${plant._id}`);
  };

  return (
    <motion.div
      onClick={handleClick}
      className="cursor-pointer bg-white rounded-2xl shadow-lg overflow-hidden transform transition duration-300 hover:shadow-2xl"
      whileHover={{ scale: 1.05, boxShadow: "0px 5px 20px rgba(34, 197, 94, 0.5)" }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Image Section */}
      <motion.img
        src={plant.static_image || plant.image}
        alt={plant.common_name || plant.name}
        className="w-full h-48 object-cover"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.3 }}
        loading="lazy"
      />

      {/* Content Section */}
      <div className="p-4">
        <h3 className="text-xl font-bold text-gray-800">{plant.common_name || plant.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{plant.botanical_name || plant.category}</p>
      </div>
    </motion.div>
    
  );
};

export default PlantCard;
