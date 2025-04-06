const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No Token Provided" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "defaultSecretKey");
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid Token", error: error.message });
    }
};

module.exports = authMiddleware;
