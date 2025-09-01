const User = require("../models/user-schema");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../key');
const nodemailer = require('nodemailer');

const signUp = async (req, res) => {
    try {
        console.log(req.body);
        const { username, email, password } = req.body;
        const usernameExist = await User.findOne({ username });
        const emailExist = await User.findOne({ email });
        if (emailExist || usernameExist) {
            return res.status(300).json({ msg: "Credentials already registered!" });
        }
        const userCreated = await User.create({ username, email, password });
        const token = jwt.sign({ _id: userCreated._id }, JWT_SECRET);
        res.status(200).json({
            msg: "SignUp successful",
            token,
            userId: userCreated._id.toString(),
            user: usernameExist.username,
            email: usernameExist.email,
            password: usernameExist.password,
        });
    } catch (error) {
        res.status(500).json("internal server error!");
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const userExist = await User.findOne({ username });
        if (!userExist) {
            return res.status(300).json({ message: "Invalid Credentials!" });
        }
        if (password === userExist.password) {
            const token = jwt.sign({ _id: userExist._id }, JWT_SECRET);
            res.status(200).json({
                msg: "Login successful",
                token,
                userId: userExist._id.toString(),
                user: userExist.username,
                email: userExist.email,
                password: userExist.password,
                btc: userExist.btc,
                eth: userExist.eth,
            });
        } else {
            res.status(300).json({ message: "Invalid Credentials!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("Internal server error!");
    }
}

const updateProfile = async (req, res) => {
    try {
        console.log("in function body");
        const { userId, username, email, password } = req.body;
        console.log("req.body:", req.body);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (username) user.username = username;
        if (email) user.email = email;
        if (password) user.password = password;
        const updatedUser = await user.save();
        res.status(200).json({
            message: 'Profile updated successfully',
            username: updatedUser.username,
            email: updatedUser.email,
            password: updatedUser.password,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const trade = async (req, res) => {
    try {
        console.log("in function body");
        const { userId, currency, quantity } = req.body;
        console.log("req.body:", req.body);
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (currency === "BTC") {
            user.btc += parseFloat(quantity);
        } else {
            user.eth += parseFloat(quantity);
        }
        const updatedUser = await user.save();
        res.status(200).json({
            message: 'Assets updated successfully',
            btc: updatedUser.btc,
            eth: updatedUser.eth,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

const sendEmail = async (to, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail', auth: { user: 'abubakarshahid1309@gmail.com', pass: 'kaggvgypeicwmrsi' }
    });

    const mailOptions = {
        from: "abubakarshahid1309@gmail.com", to: to, subject: subject, text: text
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info.response);
            }
        });
    });
}

const forgotCredentials = async (req, res) => {
    try {
        const { username, email } = req.body;
        const usernameExist = await User.findOne({ username });
        const emailExist = await User.findOne({ email });
        const password = usernameExist.password;
        if (emailExist && usernameExist) {
            console.log("Credentials are correct!");
            const to = email;
            const subject = 'Password Reset Request';
            const text = `Dear ${username},\n\nHere is the password of your Mr.Crypto Account: ${password}\n\nThanks and Regards,\nTeam Mr.Crypto`;
            await sendEmail(to, subject, text);
            return res.status(200).json({ message: "Credentials are correct!" });
        } else {
            console.log("Invalid Credentials!");
            return res.status(300).json({ message: "Invalid Credentials!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { signUp, login, updateProfile, trade, forgotCredentials };