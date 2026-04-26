const {ImageKit} = require ("@imagekit/nodejs");

const imageKitClient = new ImageKit({
  privateKey: process.env['IMAGEKIT_PRIVATE_KEY'],
});

async function uploadFiles(file){
    const result =await imageKitClient.files.upload({
        file,
        fileName: "music_" + Date.now(),
        folder: "Topify/music"
    })
    return result;
}

module.exports = {uploadFiles}
