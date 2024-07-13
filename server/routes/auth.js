const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../model/User.js");
const jwt = require("jsonwebtoken");
const router = express.Router();
const dotenv = require("dotenv");
dotenv.config();



router.get("/", (req, res) => {
    res.send("Hello, world!");
});

router.post("/register", async (req, res) => {
    try {
        //get all the data from body
        const { name, email, password, role} = req.body;

        // check that all the data should exists
        if (!(name && email && password && role)) {
            return res.status(400).send("Please enter all the information");
        }

        // check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(200).send("User already exists!");
        }

        // encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // save the user in DB
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        // generate a token for user and send it
        const token = jwt.sign({ id: user._id, email }, process.env.SECRET_KEY, {
            expiresIn: "2h",
        });

        user.token = token;
        user.password = undefined;
        res
            .status(200)
            .json({ message: "You have successfully registered!", user,token });

    } catch (error) {
        console.log(error);
    }
});

router.post("/login", async (req, res) => {
    try {
        //get all the user data
        const { email, password } = req.body;

        // check that all the data should exists
        if (!(email && password)) {
            return res.status(400).send("Please enter all the information");
        }

        //find the user in the database
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).send("User not found!");
        }

        //match the password
        const enteredPassword = await bcrypt.compare(password, user.password);
        if (!enteredPassword) {
            return res.status(401).send("Password is incorrect");
        }

        const token = jwt.sign({ id: user._id }, process.env.SECRET_KEY, {
            expiresIn: "1d",
        });
        user.token = token;
        user.password = undefined;

        //store cookies
        const options = {
            expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
            httpOnly: true, //only manipulate by server not by client/user
        };

        //send the token
        res.status(200).cookie("token", token, options).json({
            message: "You have successfully logged in!",
            success: true,
            token,
            role : user.role
        });
    } catch (error) {
        console.log(error.message);
    }
});

module.exports = router;
