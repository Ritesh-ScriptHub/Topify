const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
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

async function createAlbum(req, res){

    const token = req.cookies.token;

    if(!token){
        return res.status(401).json({message: "Unauthorised"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if(decoded.role != "artist"){
        return res.status(403).json({message: "Don't have access to create Album."})
        }

        const {title, musicIds} = req.body;

        const album = await albumModel.create({
            title,
            musics: musicIds,
            artist: decoded.id
        })

        res.status(201).json({
            message: "Album created successfully.",
            album: {
                id: album._id,
                title: album.title,
                artist: album.artist,
                musics: album.musics
            }
        })
    } catch (err) {
        console.log(err)
        res.status(401).json({message: "Unauthorized"})
    }

}

module.exports = { createMusic, createAlbum }