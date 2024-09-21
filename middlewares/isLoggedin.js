const jwt = require("jsonwebtoken");
const userModel = require("../models/Users");

module.exports = async (req, res, next) => {
    if (!req.cookies.token) {
        return res.redirect("/");
    }

    try {
        // Verify JWT token
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);

        // Find user by email and exclude the password field
        let user = await userModel.findOne({ email: decoded.email }).select("-password");

        // If user is not found, redirect to login page
        if (!user) {
            return res.redirect("/");
        }

        // Attach user to request object
        req.user = user;
        
        // Continue to the next middleware
        next();
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }
};
