const jwt = require("jsonwebtoken");

async function authArtist (req, res, next) {
    
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({message:"Unauthorised"})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded.role != "artist"){
            return res.status(403).json({message:"You don't have access"});
        }

        req.user = decoded;

        next();

    } catch (err) {
        console.log(err);
        res.status(403).json({message: "You don't have access to these features."})
    }

}

async function authUser(req, res, next) {
    const token = req.cookies.token;

    if(!token) {
        return res.status(401).json({message:"Unauthorised"})
    }

    try {
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.role != "user" && decoded.role != "artist" ){
            return res.status(403).json({message: "You don't have access"})
        }
        req.user = decoded;
        next();

    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: "Unauthorised"})
    }
}

module.exports = { authArtist, authUser }