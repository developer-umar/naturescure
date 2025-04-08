import React from 'react';
import { motion } from "framer-motion";
import { useNavigate } from 'react-router-dom';

function Content_2() {
    const navigate = useNavigate();
    const onClick = () => {
        navigate('/categories');
    };

    return (
        <div className="flex flex-col items-center px-12 py-16 max-w-6xl mx-auto gap-12">
            
            {/* Main Content Wrapper */}
            <motion.div 
                className="flex flex-col md:flex-row items-center justify-between w-full gap-12"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                {/* Content Section - Left Side */}
                <motion.div
                    className="md:w-1/2 text-left space-y-6"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    <motion.h2 
                        className="text-5xl font-extrabold text-green-900"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        Experience the Future of Herbal Learning
                    </motion.h2>
                    <motion.p 
                        className="text-lg text-gray-800 leading-relaxed"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        Step into the world of <strong>Herbal Science</strong>, where tradition  
                        meets cutting-edge technology. Our Virtual Herbal Garden  
                        offers <strong>3D interactive exploration</strong>, allowing you to  
                        rediscover the secrets of ancient healing.
                    </motion.p>
                    <motion.p 
                        className="text-lg text-gray-800 leading-relaxed"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.8 }}
                    >
                        Learn, engage, and experience the power of <strong>nature's  
                        pharmacy</strong> in an entirely new way.
                    </motion.p>
                </motion.div>

                {/* Image Section - Right Side */}
                <motion.div 
                    className="md:w-1/2 flex justify-center"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <motion.div 
                        className="w-full h-80 bg-gray-300 flex items-center justify-center rounded-lg overflow-hidden shadow-lg"
                        whileHover={{ scale: 1.05 }}
                    >
                        <motion.img 
                            src='/images/content_2.jpg' 
                            className="w-full h-full object-cover"
                            initial={{ scale: 1 }}
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                        />
                    </motion.div>
                </motion.div>
            </motion.div>

            {/* Button - Centered Below */}
            <motion.button
                onClick={onClick}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 1 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-gradient-to-r from-green-700 to-green-500 text-white text-lg font-semibold rounded-full shadow-lg hover:from-green-800 hover:to-green-600 transition-all duration-300 ease-in-out"
            >
                Explore 
            </motion.button>
        </div>
    );
}

export default Content_2;
