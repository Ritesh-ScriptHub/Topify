const mongoose = require("mongoose");

async function connectDB(){
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Database connected Successfully");
    } catch (err) {
        console.log("Database connection failed!", err);
        process.exit(1);
    }
}

module.exports= connectDB;
