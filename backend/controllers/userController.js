const User = require('../models/user.js');
const bcrypt = require('bcryptjs');  // ✅ पहले ही require हो चुका है, इसलिए नीचे से हटा दिया
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinary.js'); // Cloudinary Config Import

// User Register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        let user = await User.findOne({ email });

        if (user) {
            return res.status(409).json({ message: "User already exists! Please login." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({ name, email, password: hashedPassword });

        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error! Please try again." });
    }
};

// User Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'defaultSecretKey', { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// User Logout (Client-side token removal is required)
const logout = async (req, res) => {
    try {
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUser = async (req, res) => {
    try {
      // Password को exclude करने के लिए .select("-password") का उपयोग किया गया है
      const user = await User.findById(req.params.id).select("-password");
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
// Update User Profile
const updateUser = async (req, res) => {
    try {
      const { name, address, password, phone } = req.body;
      const userId = req.params.id;
  
      let updateData = { name, address, phone };
  
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }
      
      if (req.file) {
        // Use Cloudinary's upload_stream for memory storage
        const streamUpload = (buffer) => {
          return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
              {
                folder: 'user_profiles',
                width: 200,
                crop: "scale",
              },
              (error, result) => {
                if (error) {
                  reject(error);
                } else {
                  resolve(result);
                }
              }
            );
            stream.end(buffer);
          });
        };
  
        const uploadedImage = await streamUpload(req.file.buffer);
        updateData.profilePic = uploadedImage.secure_url;
      }
  
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        updateData,
        { new: true, runValidators: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.status(200).json({ message: 'Profile updated successfully', updatedUser });
    } catch (error) {
      console.error("Error in updateUser:", error);
      res.status(500).json({ message: error.message });
    }
  };
  


module.exports = { register, login, logout, updateUser, getUser};
