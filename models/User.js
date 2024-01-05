const mongoose = require("mongoose");
const Joi = require("joi");

const UserSchema = mongoose.Schema({
    email:{
        type: String,
        required:true,
        trim:true,
        minlenght:5,
        maxlenght:100,
        unique:true,
    },
    password:{
        type: String,
        required:true,
        trim:true,
        minlenght:6,
    },
},{timestamps:true});

const User = mongoose.model("User",UserSchema);

function validateRegisterUser(obj){
    const schema = Joi.object({
        email:Joi.string().trim().min(5).max(100).required().email(),
        password: Joi.string().trim().min(6).required(),
    });
    return schema.validate(obj);
}

function validateLoginUser(obj){
    const schema = Joi.object({
        email:Joi.string().trim().min(5).max(100).required().email(),
        password: Joi.string().trim().min(6).required(),
    });
    return schema.validate(obj);
}

function validateUpdateUser(obj){
    const schema = Joi.object({
        email:Joi.string().trim().min(5).max(100).email(),
        password: Joi.string().trim().min(6),
    });
    return schema.validate(obj);
}

module.exports={
    User,
    validateLoginUser,
    validateRegisterUser,
    validateUpdateUser
}