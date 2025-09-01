const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    btc: { type: Number, default: "0"},
    eth: { type: Number, default: "0"}
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
