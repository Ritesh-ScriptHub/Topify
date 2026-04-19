const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const { uploadFiles } = require("../services/storage.service");
const jwt = require("jsonwebtoken");


async function createMusic(req, res) {

    const { title } = req.body;
    const file = req.file;

    const result = await uploadFiles(file.buffer.toString('base64'));
    const music = await musicModel.create({
        uri: result.url,
        title,
        artist: req.user.id
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
}

async function createAlbum(req, res) {

    const { title, musicIds } = req.body;

    const album = await albumModel.create({
        title,
        musics: musicIds,
        artist: req.user.id
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

}

async function getAllMusics(req, res){

    try {
        const music = await musicModel.find().limit(5).populate("artist", "username")

        res.status(200).json({
            message: "Musics fetched successfully.",
            musics: music
        })
    } catch (err) {
        console.log(err)
        return res.status(404).json({message: "Failed to load Music | No data found"})
    }
    
}

async function getAllAlbums(req, res){
    const albums = await albumModel.find().select("title artist").populate("artist", "username email")
    res.status(200).json({
        message: "Album fetched successfully.",
        musics: albums
    })
}

async function getAlbumById(req, res){

    const albumId = req.params.albumId;
    const albums = await albumModel.findById(albumId).populate("artist", "username email");

    if(!albums) {
        return res.status(404).json({message: "Album not found"})
    }

    res.status(200).json({
        message: "Album fetched successfully.",
        musics: albums
    })
}

module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById }