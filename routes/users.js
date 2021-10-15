const express = require("express");
const mongoose = require("mongoose");
const {userSchema, User, validateUser } = require("../models/user");
const login = require('../middleware/login');
const shopOwner = require('../middleware/shopOwner');
const bcrypt = require("bcrypt");

const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send('Email already registered');

    let phoneNumber = req.body.phonenumber ? req.body.phonenumber : null;
    let isShopOwner = req.body.isShopOwner ? req.body.isShopOwner : false;
    user = new User({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phoneNumber,
        isShopOwner
    });
    
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    await user.save();

    const token = user.generateAuthToken();

    res.header('x-auth-token', token);
    res.send(token);
});

module.exports = router;


