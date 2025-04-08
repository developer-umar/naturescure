const express = require("express");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();

// Protected Route Example
router.get("/protected", authMiddleware, (req, res) => {
    res.json({ message: "Access granted!", user: req.user });
});

module.exports = router;
