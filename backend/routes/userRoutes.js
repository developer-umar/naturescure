const express = require("express");
const { register, login, logout, updateUser, getUser } = require("../controllers/userController");
const authMiddleware = require("../Middleware/authMiddleware");
const {upload, uploadMiddleware} = require("../Middleware/multer");

const router = express.Router();

// 🔓 Public Routes (No Authentication Required)
router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.get("/:id", authMiddleware, getUser); // getUser आपके controller में defined होना चाहिए

// 🔒 Protected Routes (Require Authentication)
router.put("/update/:id", uploadMiddleware, authMiddleware, updateUser);

module.exports = router;
