const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async function registerUser(req, res) {
    try {
        const {username, email, password, role="user"} = req.body;

        // Validation
        if (!username || !email || !password) {
            return res.status(400).json({message: "Username, email, and password are required"});
        }

        const alreadyExists = await userModel.findOne({
            $or: [{username}, {email}]
        })

        if (alreadyExists) {
            return res.status(409).json({message: "User already exists"});
        }

        const passHash = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            email,
            password: passHash,
            role
        })

        const token = jwt.sign({
            id: user._id,
            role: user.role
        }, process.env.JWT_SECRET)

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        })

        res.status(201).json({
            message: "user registered successfully",
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

module.exports = {registerUser}