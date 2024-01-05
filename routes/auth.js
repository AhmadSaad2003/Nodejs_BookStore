const express = require("express");
const router = express.Router();
const asychandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User, validateRegisterUser, validateLoginUser } = require("../models/User");//the class that we will use it to create objects authors

/**
 * @desc   register new user
 * @route  /api/auth/register
 * @method POST
 * @access public
*/
router.post("/register", asychandler(async (req, res) => {
    const { error } = validateRegisterUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ message: "This user is already registred" });
    }
    const salt = await bcrypt.genSalt(10);//for the security in the database we should hash the code using a salt
    req.body.password = await bcrypt.hash(req.body.password, salt);
    user = new User({
        email: req.body.email,
        password: req.body.password,
    });

    const result = await user.save();
    const token = jwt.sign({id:user._id,email:user.email}, process.env.JWT_SECRETKEY,);

    const { password, ...other } = result._doc;

    res.status(201).json({...other, token});
}));

/**
 * @desc   login user
 * @route  /api/auth/login
 * @method POST
 * @access public
*/
router.post("/login", asychandler(async (req, res) => {
    const { error } = validateLoginUser(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }
    
    const isPasswordMatch=await bcrypt.compare(req.body.password,user.password);
    if (!isPasswordMatch) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({id:user._id,email:user.email}, process.env.JWT_SECRETKEY,);//{expiresIn:4d} third parameter if we want
    const { password, ...other } = user._doc;

    res.status(200).json({...other, token});
}));

module.exports = router;