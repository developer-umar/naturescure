import React from 'react';
import { motion } from "framer-motion";

function Content() {
    return (
        <div className="bg-white py-16">
            <motion.div 
                className="flex flex-col md:flex-row items-center max-w-6xl mx-auto px-6 md:px-16 gap-10 md:gap-16"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1 }}
            >
                {/* Text Section (Left) */}
                <motion.div
                    className="md:w-1/2 text-left flex flex-col justify-center space-y-5"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                >
                    <motion.h2 
                        className="text-5xl font-extrabold text-green-900 leading-tight"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, delay: 0.4 }}
                    >
                        Unlock the Power of Nature  
                    </motion.h2>
                    <motion.p 
                        className="text-lg text-gray-800 leading-relaxed"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.6 }}
                    >
                        Nature has been the greatest healer for centuries.  
                        From the wisdom of Ayurveda to the precision of Homeopathy,  
                        every leaf, root, and flower holds the potential to restore  
                        health, balance, and vitality.  
                    </motion.p>
                    <motion.p 
                        className="text-lg text-gray-800 leading-relaxed"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 1, delay: 0.8 }}
                    >
                        Step into the world of herbal medicine and discover the  
                        science behind nature’s pharmacy.
                    </motion.p>
                </motion.div>

                {/* Image Section (Right) */}
                <motion.div 
                    className="md:w-1/2 flex justify-end"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                >
                    <motion.img 
                        src="/images/medicine.jpg" 
                        alt="Herbal Medicine" 
                        className="w-full max-w-[450px] h-auto object-cover rounded-lg shadow-lg"
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.5 }}
                        loading='lazy'
                    />
                </motion.div>
            </motion.div>
        </div>
    );
}

export default Content;
