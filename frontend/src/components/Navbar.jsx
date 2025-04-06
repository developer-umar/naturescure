import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../assets/Logo.jpg";
import SearchBar from "./SearchBar";
import { useSelector, useDispatch } from "react-redux";
import { logoutSuccess } from "../features/authSlice";
import chatbot from "../../public/images/chatbot.mp4";
import cartimg from "../../public/images/cart.svg";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import { Avatar, AvatarImage } from "../components/ui/avatar";
import { Menu, X } from "lucide-react"; // Hamburger & Close Icons

const Navbar = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.cartItems);
  console.log(cartItems)


  const [isOpen, setIsOpen] = useState(false); // State to handle menu visibility
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
          const response = await fetch(`https://naturescure-n7ie.onrender.com/api/cart/${user._id}/totalquantity`);
          const data = await response.json();

          if (data.totalQuantity !== totalQuantity) {
            setTotalQuantity(data.totalQuantity); // React will re-render now
          }

          localStorage.setItem("cartQuantity", data.totalQuantity); // optional
        } catch (error) {
          console.error("Error fetching cart quantity:", error);
        }
      };

      fetchTotalQuantity();

      // ✅ Optional auto-refresh every 10s
      const interval = setInterval(fetchTotalQuantity, 1000);

      return () => clearInterval(interval);
    }
  }, [user?._id, totalQuantity]);

  const handleOrder = () => {
    navigate("/yourorder")
  }

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate("/login");


  };
  return (
    <>
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="sticky top-0 z-50 bg-white py-4 shadow-lg"
      >
        <div className="container mx-auto flex justify-between items-center px-6 lg:px-12">
          {/* Logo */}
          <motion.a
            href="/"
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-3"
          >
            <motion.img
              src={logo}
              alt="Logo"
              className="w-10 h-10 object-contain rounded-full"
            />
            <div className="flex items-baseline">
              <span className="text-2xl font-bold italic text-green-700">N</span>
              <span className="text-xl font-semibold text-gray-800">ature's</span>
              <span className="ml-1 text-2xl font-bold italic text-green-700">C</span>
              <span className="text-xl font-semibold text-gray-800">ure</span>
            </div>
          </motion.a>

          {
            user ? (<div className="flex flex-col md:flex-row items-center gap-6 w-full md:w-auto">
              {/* Search Bar */}
              <div className="w-full md:w-96 hidden md:block">
                <SearchBar />
              </div>
            </div>) : ("")
          }
          {/* Search & Navigation Links */}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <motion.a
              href="/"
              whileHover={{ scale: 1.05 }}
              className="hover:text-green-600 transition-colors duration-200"
            >
              Home
            </motion.a>
            <motion.a
              href="/categories"
              whileHover={{ scale: 1.05 }}
              className="hover:text-green-600 transition-colors duration-200"
            >
              Categories
            </motion.a>
            <motion.button
              onClick={() => navigate("/remidy")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-green-700 px-4 py-2 rounded-md hover:bg-green-50 transition-colors duration-200"
            >
              HerbaCure
            </motion.button>
            <motion.button
              onClick={() => navigate("/quiz")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-green-700 px-4 py-2 rounded-md hover:bg-green-50 transition-colors duration-200"
            >
              Quiz
            </motion.button>
            {
              user ? (<motion.button
                onClick={() => navigate("/cart")}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative bg-white text-green-700 p-2 rounded-full hover:bg-green-50 transition-colors duration-200"
              >
                <img src={cartimg} className="h-10" />
                {
                 totalQuantity > 0 && (
                    <span className="text-red-500">✔</span>
                 )
                }
                
  
              </motion.button>):("")
            }
            
          </div>

          {/* User & Cart Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>


                <Popover>
                  <PopoverTrigger>
                    <Avatar>
                      <AvatarImage src={user?.profilePic} />
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent className="flex flex-col">
                    <h1><b>{user?.name}</b></h1><hr />
                    <motion.button
                      onClick={() => navigate("/profile")}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-black px-4 py-2 text-start  transition-colors duration-200">
                      Profile
                    </motion.button>
                    <motion.button
                      onClick={handleOrder}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-black px-4 py-2 text-start  transition-colors duration-200">
                      Your Order
                    </motion.button>
                    <motion.button
                      onClick={() => navigate("/trackorder")}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-black px-4 py-2 text-start  transition-colors duration-200">
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
              </>
            ) : (
              <>
                <motion.button
                  onClick={() => navigate("/login")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white text-green-700 px-4 py-2 rounded-full hover:bg-green-100 transition-colors duration-200"
                >
                  Login
                </motion.button>
                <motion.button
                  onClick={() => navigate("/signup")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-100 hover:text-green-500 transition-colors duration-200"
                >
                  Sign Up
                </motion.button>
              </>
            )}

            <div className="fixed bottom-20 right-10 w-20 h-20 rounded-full shadow-md overflow-hidden bg-transparent">
              <video
                autoPlay
                loop
                muted
                className="absolute inset-0 w-full h-full object-cover bg-transparent"
              >
                <source src={chatbot} type="video/mp4" />
              </video>
              <motion.button
                onClick={() => navigate("/herba")}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="absolute inset-0 w-full h-full bg-transparent"
              ></motion.button>
            </div>

          </div>

          {/* Mobile Menu Button */}
          {/* Mobile Menu Button & Search Icon */}
          <div className="md:hidden flex items-center gap-4">
            {/* Search Icon */}
            {/* <button onClick={() => navigate("/search")} className="text-gray-800">
              🔍
            </button> */}

            {/* Hamburger Menu */}
            <button className="text-gray-800" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {/* Mobile Menu */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden absolute top-16 left-0 w-full bg-white shadow-lg p-4 px-10 flex flex-col space-y-4"
          >
            <motion.a href="/" whileHover={{ scale: 1.05 }} className="text-left">
              Home
            </motion.a>
            <motion.a href="/categories" whileHover={{ scale: 1.05 }} className="text-left">
              Categories
            </motion.a>
            <motion.button
              onClick={() => navigate("/remidy")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-left"
            >
              HerbaCure
            </motion.button>
            <motion.button
              onClick={() => navigate("/quiz")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-left"
            >
              Quiz
            </motion.button>



            {/* Cart & User Section in Mobile */}
            {user ? (
              <div className="flex flex-col items-start gap-4 mt-4">
                <motion.button
                  onClick={() => navigate("/cart")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="relative bg-white text-green-700 p-2 rounded-full hover:bg-green-50 transition-colors duration-200"
                >
                  🛒 {totalQuantity > 0 && (
                    <span className="text-red-500">✔</span>
                  )}
                </motion.button>

                <Popover>
                  <PopoverTrigger>
                    <Avatar>
                      <AvatarImage src="https://github.com/shadcn.png" />
                    </Avatar>
                  </PopoverTrigger>
                  <PopoverContent>
                    <motion.button
                      onClick={handleLogout}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="bg-red-500 text-white  px-4 py-2 rounded-full hover:bg-red-600 transition-colors duration-200"
                    >
                      Logout
                    </motion.button>

                  </PopoverContent>
                </Popover>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 mt-4">
                <motion.button
                  onClick={() => navigate("/login")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-white text-green-700 px-4 py-2 rounded-full hover:bg-green-100 transition-colors duration-200"
                >
                  Login
                </motion.button>
                <motion.button
                  onClick={() => navigate("/signup")}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-100 hover:text-green-500 transition-colors duration-200"
                >
                  Sign Up
                </motion.button>
              </div>
            )}

            {
              user && (<div className="w-full">

                <SearchBar />
              </div>)
            }

          </motion.div>

        )}

      </motion.nav>
    </>
  );
};

export default Navbar;
