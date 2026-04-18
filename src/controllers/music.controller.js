const musicModel = require("../models/music.model");
const {uploadFiles} = require("../services/storage.service");
const jwt = require("jsonwebtoken");


async function createMusic(req, res) {

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: "Unauthorised"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if(decoded.role != "artist"){
            return res.status(404).json({message: "Error: Go signup as artist to get access"});
        }

        const {title} = req.body;
        const file = req.file;

        const result = await uploadFiles(file.buffer.toString('base64'));
        const music = await musicModel.create({
            uri: result.url,
            title,
            artist: decoded.id
        })

        res.status(201).json({
            message: "Music created successfully",
            music: {
                id: music._id,
                uri: music.uri,
                title: music.title,
                artist: music.artist
            }
        })
    } catch (err) {
        console.log(err);
        res.status(401).json({message: "Unauthorized"})
    }
}

module.exports = { createMusic }