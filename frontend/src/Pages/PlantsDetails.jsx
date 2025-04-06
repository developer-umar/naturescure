import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux"; // Redux se cart aur auth manage karne ke liye
import { useNavigate } from "react-router-dom"; 
import { addToCart } from "../features/cartSlice"; // ✅ Redux Cart Action Import
import "@google/model-viewer";

const PlantDetails = () => {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated } = useSelector((state) => state.auth); // ✅ User aur auth state fetch ki
  const { loading } = useSelector((state) => state.cart); // ✅ Cart loading state
  
  useEffect(() => {
    const fetchPlantDetails = async () => {
      try {
        const response = await fetch(`/api/plants/${id}`);
        if (!response.ok) throw new Error("Failed to fetch plant data");
        const data = await response.json();
        setPlant(data);
      } catch (error) {
        console.error("Error fetching plant details:", error);
      }
    };
    fetchPlantDetails();
  }, [id]);

  // 🛒 ✅ **Redux-based Add to Cart Function**
  const handleAddToCart = () => {
    if (!isAuthenticated) {
      alert("Please log in to add items to the cart!");
      navigate("/login"); 
      return;
    }

    dispatch(addToCart({ userId: user._id, plantId: plant._id, quantity: 1 }));
    alert(`${plant.common_name} added to cart! 🛒`);
  };

  if (!plant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 to-gray-900">
        <motion.div
          className="text-xl font-semibold text-white flex items-center gap-3"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          >
            🌿
          </motion.span>
          Loading...
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-100 via-gray-100 to-emerald-100">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.header
          className="mb-6 text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-bold text-neutral-900">{plant.common_name}</h1>
          <p className="text-lg text-neutral-600 mt-1">{plant.botanical_name}</p>
          <p className="text-sm text-gray-500 mt-1">
            <strong>ID:</strong> {plant?._id}
          </p>
        </motion.header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div className="space-y-4" initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <motion.div className="bg-white rounded-lg shadow-md overflow-hidden" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
              <img src={plant.static_image} alt={plant.common_name} className="w-full h-[250px] object-cover" />
            </motion.div>

            <div className="bg-white rounded-lg shadow-md p-5">
              <h2 className="text-xl font-semibold text-neutral-800 mb-3">Plant Information</h2>
              <div className="space-y-2 text-neutral-600">
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                  <span className="font-medium text-teal-700">Habitat:</span> {plant.habitat}
                </motion.p>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                  <span className="font-medium text-teal-700">Medicinal Uses:</span> {plant.medicine_uses}
                </motion.p>
                <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                  <span className="font-medium text-teal-700">Cultivation:</span> {plant.method_of_cultivation}
                </motion.p>
              </div>

              {/* 🛒 Add to Cart Button */}
              <motion.button
                onClick={handleAddToCart}
                className="mt-4 w-full bg-green-500 text-white py-2 px-4 rounded-lg text-lg font-semibold hover:bg-green-100 hover:text-green-500 transition duration-300"
                whileTap={{ scale: 0.9 }}
                disabled={loading}
              >
                {loading ? "Adding..." : `Add to Cart 🛒 ₹ ${plant.price}`}
              </motion.button>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            whileHover={{ scale: 1.01 }}
          >
            {plant.models_image ? (
            <model-viewer 
                src={plant.models_image}
                alt={`3D model of ${plant.common_name}`}
                auto-rotate
                camera-controls
                ar
                shadow-intensity="1"
                exposure="1.2"
                scale="5 5 5"
                camera-orbit="0deg 75deg 1.5m"
                field-of-view="25deg"
                className="w-full h-[450px] rounded-md"
            ></model-viewer>
        ) : (
            <p>3D model not available</p>
        )}
        
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PlantDetails;
