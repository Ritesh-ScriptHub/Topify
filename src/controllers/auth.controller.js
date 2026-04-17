const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

async  function registerUser(req, res) {

    const {username, email, password, role="user"} = req.body;


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

    res.cookie("token", token)

    res.status(201).json({
        message: "user registered successfully",
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role
        }
    })
}

module.exports = {registerUser}