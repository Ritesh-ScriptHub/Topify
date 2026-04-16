const mongoose = require("mongoose");

async function connectDB(){
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database connected Successfully");
}

module.exports= connectDB;

// https://chatgpt.com/s/t_69dfacef1b608191a06f29133bab2c50