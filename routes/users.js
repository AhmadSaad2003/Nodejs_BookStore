const express = require("express");
const router = express.Router();
const asychandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const {User, validateUpdateUser}=require("../models/User");
const{verifyToken, verifyTokenAnd}=require("../middlewars/verifyToken");
/**
 * @desc   Update user
 * @route  /api/users/:id
 * @method PUT
 * @access private
*/
router.put("/:id", verifyTokenAnd, asychandler(async(req,res)=>{
    const{error}=validateUpdateUser(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }

    if(req.body.password){
        const salt = await bcrypt.genSalt(10);//for the security in the database we should hash the code using a salt
        req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id,{
        $set:{
            email:req.body.email,
            password:req.body.password
        }
    },{new:true}).select("-password");
    res.status(200).json(updatedUser);
}));

/**
 * @desc   Get user
 * @route  /api/users
 * @method GET
 * @access private
*/
router.get("/:id", verifyTokenAnd, asychandler(async(req,res)=>{
    const users = await User.find().select("-password");
    res.status(200).json(users);
}));

/**
 * @desc   Delete user
 * @route  /api/users/:id
 * @method GET
 * @access private
*/
router.delete("/:id", verifyToken, asychandler(async(req,res)=>{
    const user = await User.findById(req.params.id).select("-password");
    if(user){
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({message:"user has been deleted"});
    }else{
        res.status(404).json({message: "user not found"});
    }
    
}));

module.exports = router;