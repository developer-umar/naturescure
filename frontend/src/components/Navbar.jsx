import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/Logo.jpg";
import SearchBar from "./SearchBar";
import { useSelector, useDispatch } from "react-redux";
import { logoutSuccess } from "../features/authSlice";
import chatbot from "/images/chatbot.mp4"; // Adjusted path for public folder
import cartimg from "../../public/images/cart.svg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);

  const [isOpen, setIsOpen] = useState(false);
  const [totalQuantity, setTotalQuantity] = useState(() => {
    const savedQuantity = localStorage.getItem("cartQuantity");
    return savedQuantity ? parseInt(savedQuantity) : 0;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("token", JSON.stringify(user));
    } else {
      localStorage.removeItem("token");
    }

    if (user?._id) {
      const fetchTotalQuantity = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/cart/${user._id}/totalquantity`);
          const data = await response.json();
          if (data.totalQuantity !== totalQuantity) {
            setTotalQuantity(data.totalQuantity);
          }
          localStorage.setItem("cartQuantity", data.totalQuantity);
        } catch (error) {
          console.error("Error fetching cart quantity:", error);
        }
      };
      fetchTotalQuantity();
      const interval = setInterval(fetchTotalQuantity, 1000);
      return () => clearInterval(interval);
    }
  }, [user?._id, totalQuantity]);

  const closeMenu = () => setIsOpen(false);

  const handleOrder = () => {
    navigate("/yourorder");
    closeMenu();
  };

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate("/login");
    closeMenu();
  };

  const handleNavigation = (path) => {
    navigate(path);
    closeMenu();
  };

  // Debugging chatbot visibility
  useEffect(() => {
    // console.log("Chatbot video path:", chatbot);
    const videoElement = document.querySelector(".chatbot-video");
    if (videoElement) {
      videoElement.addEventListener("error", () =>
        console.error("Chatbot video failed to load")
      );
      videoElement.addEventListener("loadeddata", () =>
        console.log("Chatbot video loaded successfully")
      );
    }
  }, []);

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-white py-3 sm:py-4 shadow-lg"
    >
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 lg:px-12">
        {/* Logo */}
        <div className="flex justify-between items-center w-full sm:w-auto">
          <motion.a
            href="/"
            onClick={closeMenu}
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 sm:space-x-3"
          >
            <motion.img
              src={logo}
              alt="Logo"
              className="w-8 h-8 sm:w-10 sm:h-10 object-contain rounded-full"
            />
            <div className="flex items-baseline">
              <span className="text-xl sm:text-2xl font-bold italic text-green-700">N</span>
              <span className="text-lg sm:text-xl font-semibold text-gray-800">ature's</span>
              <span className="ml-1 text-xl sm:text-2xl font-bold italic text-green-700">C</span>
              <span className="text-lg sm:text-xl font-semibold text-gray-800">ure</span>
            </div>
          </motion.a>
          <button
            className="sm:hidden text-gray-800"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-4 lg:gap-6">
          {user && (
            <div className="w-64 sm:w-80 md:w-96">
              <SearchBar />
            </div>
          )}
          <motion.a
            href="/"
            onClick={closeMenu}
            whileHover={{ scale: 1.05 }}
            className="hover:text-green-600 transition-colors duration-200 text-sm lg:text-base"
          >
            Home
          </motion.a>
          <motion.a
            href="/categories"
            onClick={closeMenu}
            whileHover={{ scale: 1.05 }}
            className="hover:text-green-600 transition-colors duration-200 text-sm lg:text-base"
          >
            Categories
          </motion.a>
          <motion.button
            onClick={() => handleNavigation("/remidy")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hover:text-green-600 transition-colors duration-200 text-sm lg:text-base"
          >
            HerbaCure
          </motion.button>
          <motion.button
            onClick={() => handleNavigation("/quiz")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="hover:text-green-600 transition-colors duration-200 text-sm lg:text-base"
          >
            Quiz
          </motion.button>
          {user && (
            <motion.button
              onClick={() => handleNavigation("/cart")}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="relative bg-white text-green-700 p-2 rounded-full hover:bg-green-50 transition-colors duration-200"
            >
              <img src={cartimg} className="h-6 sm:h-8 lg:h-10" />
              {totalQuantity > 0 && (
                <span className="text-red-500 text-xs sm:text-sm">
                  ({totalQuantity})
                </span>
              )}
            </motion.button>
          )}
        </div>

        {/* User & Cart Section (Desktop) */}
        <div className="hidden sm:flex items-center gap-3 lg:gap-4">
          {user ? (
            <Popover>
              <PopoverTrigger>
                <Avatar>
                  <AvatarImage src={user?.profilePic} />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="flex flex-col gap-2">
                <h1 className="font-bold">{user?.name}</h1>
                <hr />
                <motion.button
                  onClick={() => handleNavigation("/profile")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-black px-4 py-2 text-start transition-colors duration-200"
                >
                  Profile
                </motion.button>
                <motion.button
                  onClick={handleOrder}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-black px-4 py-2 text-start transition-colors duration-200"
                >
                  Your Order
                </motion.button>
                <motion.button
                  onClick={() => handleNavigation("/trackorder")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="text-black px-4 py-2 text-start transition-colors duration-200"
                >
                  Track Your Order
                </motion.button>
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                >
                  Logout
                </motion.button>
              </PopoverContent>
            </Popover>
          ) : (
            <>
              <motion.button
                onClick={() => handleNavigation("/login")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-white text-green-700 px-3 py-1 sm:px-4 sm:py-2 rounded-full hover:bg-green-100 transition-colors duration-200 text-sm lg:text-base"
              >
                Login
              </motion.button>
              <motion.button
                onClick={() => handleNavigation("/signup")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="bg-green-500 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full hover:bg-green-100 hover:text-green-500 transition-colors duration-200 text-sm lg:text-base"
              >
                Sign Up
              </motion.button>
            </>
          )}
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="sm:hidden absolute top-full left-0 w-full bg-white shadow-lg p-4 flex flex-col space-y-3 z-50"
          >
            {user && (
              <div className="w-full mb-4">
                <SearchBar onSearch={closeMenu} />
              </div>
            )}
            <motion.a
              href="/"
              onClick={closeMenu}
              whileHover={{ scale: 1.05 }}
              className="text-left"
            >
              Home
            </motion.a>
            <motion.a
              href="/categories"
              onClick={closeMenu}
              whileHover={{ scale: 1.05 }}
              className="text-left"
            >
              Categories
            </motion.a>
            <motion.button
              onClick={() => handleNavigation("/remidy")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-left "
            >
              HerbaCure
            </motion.button>
            <motion.button
              onClick={() => handleNavigation("/quiz")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-left "
            >
              Quiz
            </motion.button>
            {user ? (
              <div className="flex flex-col gap-3">
                <motion.button
                  onClick={() => handleNavigation("/cart")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="flex items-center gap-2 "
                >
                  🛒 Cart{" "}
                  {totalQuantity > 0 && (
                    <span className="text-red-500">({totalQuantity})</span>
                  )}
                </motion.button>
                {/* Avatar Trigger for Mobile */}
                <Popover>
                  <PopoverTrigger asChild>
                    <div className="flex items-center gap-3 cursor-pointer">
                      <Avatar>
                        <AvatarImage src={user?.profilePic} />
                      </Avatar>
                      <span className="font-bold">{user?.name}</span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="flex flex-col gap-2 w-full">
                    <motion.button
                      onClick={() => handleNavigation("/profile")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-black px-4 py-2 text-start transition-colors duration-200"
                    >
                      Profile
                    </motion.button>
                    <motion.button
                      onClick={handleOrder}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-black px-4 py-2 text-start transition-colors duration-200"
                    >
                      Your Order
                    </motion.button>
                    <motion.button
                      onClick={() => handleNavigation("/trackorder")}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="text-black px-4 py-2 text-start transition-colors duration-200"
                    >
                      Track Your Order
                    </motion.button>
                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-red-500 text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                    >
                      Logout
                    </motion.button>
                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <motion.button
                  onClick={() => handleNavigation("/login")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white text-green-700 px-4 py-2 rounded-full hover:bg-green-100 transition-colors duration-200"
                >
                  Login
                </motion.button>
                <motion.button
                  onClick={() => handleNavigation("/signup")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-100 hover:text-green-500 transition-colors duration-200"
                >
                  Sign Up
                </motion.button>
              </div>
            )}
          </motion.div>
        )}

        {/* Chatbot Button */}
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full shadow-md overflow-hidden bg-transparent z-50">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover chatbot-video"
          >
            <source src={chatbot} type="video/mp4" />
            <img
              src="/images/chatbot-fallback.jpg"
              alt="Chatbot Fallback"
              className="w-full h-full object-cover"
            />
          </video>
          <motion.button
            onClick={() => handleNavigation("/herba")}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="absolute inset-0 w-full h-full bg-transparent"
          />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;