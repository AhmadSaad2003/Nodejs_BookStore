const mongoose = require("mongoose");
const joi = require("joi");

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlenght: 3,
        maxlenght: 100
    },

    author: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Author"
    },

    price: {
        type: Number,
        required: true,
        min: 0,
    }
}, {
    timestamps: true
});

const Book = mongoose.model("Book", BookSchema);

function validateCreateBook(obj) {
    const schema = joi.object({
        title: joi.string().trim().min(3).max(100).required(),
        author: joi.string().required(),
        price: joi.number().min(0).required()
    });

    return schema.validate(obj);
}

function validateUpdateBook(obj) {
    const schema = joi.object({
        title: joi.string().trim().min(3).max(100),
        author: joi.string(),
        price: joi.number().min(0)
    });

    return schema.validate(obj);
}

module.exports = {
    Book,
    validateCreateBook,
    validateUpdateBook
}