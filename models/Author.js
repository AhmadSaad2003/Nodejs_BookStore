const mongoose = require("mongoose");
const joi = require("joi");

const AuthorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlenght: 3,
        maxlenght: 100
    },

    nationality: {
        type: String,
        required: true,
        trim: true,
        minlenght: 3,
        maxlenght: 100
    }
}, {
    timestamps: true
});

function validateCreateAuthor(obj) {
    const schema = joi.object({
        name: joi.string().trim().min(3).max(100).required(),
        nationality: joi.string().trim().min(3).max(100).required(),
    });

    return schema.validate(obj);
}

function validateUpdateAuthor(obj) {
    const schema = joi.object({
        name: joi.string().trim().min(3).max(100),
        nationality: joi.string().trim().min(3).max(100),
    });

    return schema.validate(obj);
}

const Author = mongoose.model("Author", AuthorSchema);
module.exports = {
    Author,
    validateCreateAuthor,
    validateUpdateAuthor
}