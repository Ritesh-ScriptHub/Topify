const express = require("express");
const authMiddleware = require("../middleware/auth.middleware");
const multer = require("multer")
const musicController = require("../controllers/music.controller")


const upload = multer({
    storage: multer.memoryStorage()
})


const router = express.Router();

router.post("/upload", authMiddleware.authArtist, upload.single("music"), musicController.createMusic);

router.post("/album", authMiddleware.authArtist, musicController.createAlbum);

router.put("/albums/:albumId", authMiddleware.authArtist, musicController.updateAlbum);

router.get("/", authMiddleware.authUser, musicController.getAllMusics);

router.get("/albums", authMiddleware.authUser, musicController.getAllAlbums);

router.get("/albums/:albumId", authMiddleware.authUser, musicController.getAlbumById);

router.get("/artist/:username", authMiddleware.authUser, musicController.getArtistProfile);

router.get("/search", authMiddleware.authUser, musicController.searchAll);


module.exports = router;