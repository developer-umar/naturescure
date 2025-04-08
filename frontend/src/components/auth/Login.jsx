import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { motion } from "framer-motion";
import { loginSuccess } from "../../features/authSlice"; // Redux Action
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState(""); // "success" or "error"

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/users/login", formData);

      // Show success message in modal
      setModalMessage("Login Successful!");
      setModalType("success");
      setModalVisible(true);

      // Store token and user data in LocalStorage and Redux
      localStorage.setItem("tokenid", res.data.token);
      dispatch(loginSuccess(res.data.user));

      // Redirect to Home after 1.5 seconds
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } catch (error) {
      // Show error message in modal
      setModalMessage(error.response?.data?.message || "Login Failed");
      setModalType("error");
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md mt-10"
      >
        <h2 className="text-3xl font-extrabold text-center text-green-700">Login</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-lg text-gray-800 font-semibold">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-lg text-gray-800 font-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-green-600 text-white p-4 rounded-lg shadow-md hover:bg-green-700 transition-all"
          >
            Login
          </motion.button>
        </form>

        {/* Forgot Password & Sign Up Link */}
        {/* <div className="mt-4 text-center text-gray-600">
          <motion.span
            onClick={() => navigate("/forgot-password")}
            whileHover={{ scale: 1.05 }}
            className="text-green-700 font-semibold cursor-pointer hover:underline"
          >
            Forgot Password?
          </motion.span>
        </div> */}

        <p className="mt-6 text-center text-gray-600">
          Don't have an account?{" "}
          <motion.span
            onClick={() => navigate("/signup")}
            whileHover={{ scale: 1.05 }}
            className="text-green-700 font-semibold cursor-pointer hover:underline"
          >
            Sign Up
          </motion.span>
        </p>
      </motion.div>

      {/* Custom Modal for Alerts */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div
            className={`bg-white p-6 rounded-lg shadow-xl w-80 ${
              modalType === "success" ? "border-green-500" : "border-red-500"
            } border-2`}
          >
            <h3
              className={`text-lg font-semibold ${
                modalType === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {modalType === "success" ? "Success!" : "Error!"}
            </h3>
            <p className="mt-2 text-gray-700">{modalMessage}</p>
            <div className="mt-4 text-center">
              <button
                onClick={closeModal}
                className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
