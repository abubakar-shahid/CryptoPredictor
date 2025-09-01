const mongoose = require("mongoose");

const URI = "mongodb+srv://l215845:123456!@cluster0.yipwsci.mongodb.net/mrCrypto?retryWrites=true&w=majority&appName=Cluster0";

const connectDB = async () => {
    try {
        await mongoose.connect(URI);
        console.log("Database connected successfully!");
    } catch (error) {
        console.error("Failed to connect to database.");
        process.exit(0);
    }
}

module.exports = connectDB;