const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const crypto = require("crypto")
const { sendVerificationEmail } = require("../services/email.service")

function buildCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  }
}

function buildClearCookieOptions() {
  const { maxAge, ...cookieOptions } = buildCookieOptions();
  return cookieOptions;
}

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

        const verificationToken = crypto.randomBytes(32).toString("hex");
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const user = await userModel.create({
            username,
            email,
            password: passHash,
            role,
            isverified: false,
            verificationToken,
            verificationTokenExpiry
        })

        try {
            await sendVerificationEmail(email, verificationToken)
        } catch (err) {
            console.err("Failed to send Verification email", err.message)
        }

        res.status(201).json({
            message: "Please check your email to verify",
            requiresVerification: true,
            email: user.email,
        })

        // const token = jwt.sign({
        //     id: user._id,
        //     role: user.role
        // }, process.env.JWT_SECRET,
        // {expiresIn: "1d"}
        // )

        // res.cookie("token", token, buildCookieOptions())

        // res.status(201).json({
        //     message: "user registered successfully",
        //     token,
        //     user: {
        //         id: user._id,
        //         username: user.username,
        //         email: user.email,
        //         role: user.role
        //     }
        // })
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }
}

async function loginUser(req, res) {

    try {
        const{username, email, password} = req.body;

        const user = await userModel.findOne({
            $or: [
                {username},
                {email}
            ]
        })

        if(!user) {
            return res.status(401).json({ message: "Credential failed" })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) {
            return res.status(401).json({message:"Credential failed"})
        }

        if(!user.isverified) {
            return res.status(403).json({
                message: "Please verify your email before logging in!",
                requiresVerification: true,
                email: user.email
            })
        }

        const token = await jwt.sign({
            id: user._id,
            role: user.role
            }, process.env.JWT_SECRET,
            {expiresIn: "7d"}
        )

        res.cookie("token", token, buildCookieOptions());

        res.status(200).json({
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        })
    } catch (error) {
        // console.error("LogIn error:", error);
        res.status(500).json({message: "Internal server error", error: error.message});
    }

}

async function verifyEmail(req, res){
    try{
        const {token} = req.body;
        if(!token){
            return res.status(400).json({message: "Verification token is required"})
        }

        const user = await userModel.findOne({
            verificationToken: token,
            verificationTokenExpiry: {$gt: new Date()}
        }) 

        if(!user) {
            return res.status(400).json({
                messsage: "This verification link is invalid or has expired.",
                expired: true
            })
        }

        user.isverified = true
        user.verificationToken = null
        user.verificationTokenExpiry = null
        await user.save()

        res.status(200).json({message: "Email verified successfully"})

    } catch (err) {
        console.error("VerifyEmail error: ", error)
        res.status(500).json({message: "Internal Server Error"});
    }
}

async function resendVerification(req, res) {
    try {
        const { email } = req.body

        if (!email) {
        return res.status(400).json({ message: "Email is required." })
        }

        const user = await userModel.findOne({ email })

        if (!user || user.isVerified) {
        return res.status(200).json({ message: "If that email exists and is unverified, a new link has been sent."})
        }

        const verificationToken = crypto.randomBytes(32).toString("hex")
        const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000)

        user.verificationToken = verificationToken
        user.verificationTokenExpiry = verificationTokenExpiry
        await user.save()

        await sendVerificationEmail(email, verificationToken)

        res.status(200).json({
        message: "If that email exists and is unverified, a new link has been sent.",
        })

    }catch(error) {
        console.error( "resend Verification error:" ,error)
        res.status(500).json({message: "Internal Server Error"})
    }
}
async function logoutUser(req, res){
    res.clearCookie("token", buildClearCookieOptions())
    return res.status(200).json({message: "You logged out successfully"})
}

module.exports = {registerUser, loginUser, verifyEmail, resendVerification, logoutUser}
