import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <motion.footer
      className="bg-green-900 text-white py-10 px-6 md:px-16 lg:px-24 relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between">
        {/* Left Section - Logo & Description */}
        <div className="text-center md:text-left">
          <motion.h2
            className="text-3xl font-extrabold text-green-300 animate-pulse"
            whileHover={{ textShadow: "0px 0px 8px rgba(34, 197, 94, 1)" }}
          >
            Virtual Herbal Garden
          </motion.h2>
          <p className="text-gray-300 mt-2 max-w-md">
            Explore the rich world of medicinal plants with 3D models, virtual tours, and in-depth knowledge at your fingertips.
          </p>
        </div>

        {/* Middle Section - Quick Links */}
        <div className="mt-6 md:mt-0">
          <h3 className="text-lg font-semibold mb-2 underline">Quick Links</h3>
          <ul className="text-gray-300 space-y-2">
            {["Home", "About", "Plants", "Contact"].map((link, index) => (
              <motion.li
                key={index}
                className="hover:text-green-400 transition duration-300 cursor-pointer relative"
                whileHover={{ scale: 1.1 }}
              >
                {link}
                <motion.div
                  className="w-0 h-1 bg-green-400 mx-auto mt-1"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </motion.li>
            ))}
          </ul>
        </div>

        {/* Right Section - Social Media Icons */}
        <div className="mt-6 md:mt-0">
          <h3 className="text-lg font-semibold mb-2 underline">Follow Us</h3>
          <div className="flex space-x-4">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedin].map((Icon, index) => (
              <motion.div
                key={index}
                className="text-xl cursor-pointer"
                whileHover={{ scale: 1.2, rotate: 10, color: "#22c55e" }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <Icon />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-8 border-t border-gray-600 pt-4 text-center">
        <p className="text-sm text-gray-300">&copy; 2025 Virtual Herbal Garden. All rights reserved.</p>
      </div>
    </motion.footer>
  );
};

export default Footer;
