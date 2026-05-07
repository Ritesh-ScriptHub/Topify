const musicModel = require("../models/music.model");
const albumModel = require("../models/album.model");
const userModel = require("../models/user.model");
const { uploadFiles } = require("../services/storage.service");


async function createMusic(req, res) {
    try{
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
    } catch (err) {
        console.error("CreateMusic error: ", err);
        res.status(500).json({ message: "Internal Server Error ", error: err.message})
    }
}

async function createAlbum(req, res) {

    try {
        const { title, musicIds } = req.body;

        if (!title || !musicIds || musicIds.length === 0) {
            return res.status(400).json({ message: "Title and at least one track are required." })
        }

        const tracks = await musicModel.find({
            _id: { $in: musicIds },
        }).select("artist")
        if (tracks.length !== musicIds.length) {
            return res.status(400).json({ message: "One or more track IDs are invalid." })
        }
        const unauthorised = tracks.some(
            (t) => t.artist.toString() !== req.user.id
        )
        if (unauthorised) {
            return res.status(403).json({
                message: "You can only add your own tracks to an album.",
            })
        }

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
    } catch (err) {
        console.error("createAlbum error: ", err);
        res.status(500).json({ message: "Internal Server Error ", error: err.message})
    }
}

async function getAllMusics(req, res){

    try {
        const page  = parseInt(req.query.page)  || 1
        const limit = parseInt(req.query.limit) || 10
        const skip  = (page - 1) * limit

        const [musics, total] = await Promise.all([
        musicModel
            .find()
            .skip(skip)
            .limit(limit)
            .populate("artist", "username"),
        musicModel.countDocuments(),
        ])

        res.status(200).json({
        message: "Musics fetched successfully.",
        musics,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasMore: page * limit < total,
        },
        })

    } catch (err) {
        console.error("getAllMusics error: ", err);
        res.status(500).json({ message: "Internal Server Error ", error: err.message})
    }
    
}

async function getAllAlbums(req, res){
    try{
        const albums = await albumModel.find().select("title artist").populate("artist", "username email")
        res.status(200).json({
            message: "Album fetched successfully.",
            albums: albums
        })
    } catch (err){
        console.error("CreateMusic error: ", err);
        res.status(500).json({ message: "Internal Server Error ", error: err.message})
    }
}

async function getAlbumById(req, res){
    try{
        const albumId = req.params.albumId;
        const albums = await albumModel
            .findById(albumId)
            .populate("artist", "username email")
            .populate({
                path: "musics",
                populate: { path: "artist", select: "username" }
            })

        if(!albums) {
            return res.status(404).json({message: "Album not found"})
        }

        res.status(200).json({
            message: "Album fetched successfully.",
            albums: albums
        })
    } catch (err) {
        console.error("getAlbumById error: ", err);
        res.status(500).json({ message: "Internal Server Error ", error: err.message})
    }
}

async function getArtistProfile(req, res) {
    try{
        const {username} = req.params;

        const artist = await userModel.findOne({username, role:"artist"}).select("Username email role createdAt");
        if(!artist){
            return res.status(404).json({message: "Artist not found"})
        }
        const [tracks, albums] = await Promise.all([
            musicModel
                .find({ artist: artist._id })
                .populate("artist", "username")
                .sort({ createdAt: -1 }),
            albumModel
                .find({ artist: artist._id })
                .populate("artist", "username")
                .sort({ createdAt: -1 }),
        ])  
        res.status(200).json({
            message: "Artist profile fetched successfully.",
            artist,
            tracks,
            albums,
        })
    } catch (err) {
        console.error("getArtistProfile error: ", err);
        res.status(500).json({message: "Internal Server Error"})
    }
}

module.exports = { createMusic, createAlbum, getAllMusics, getAllAlbums, getAlbumById, getArtistProfile }