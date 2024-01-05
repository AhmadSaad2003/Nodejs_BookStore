const express = require("express");
const router = express.Router();
const asychandler=require("express-async-handler");
const { Book, validateCreateBook, validateUpdateBook } = require("../models/Books");

//Http methods
//url,route handler

/**
 * @desc   Get all books
 * @route  /api/books
 * @method GET
 * @access public
*/
router.get("/", asychandler(async(req, res) => {
    const bookList = await Book.find().populate("author",["_id","name"]);//populate is for showing the author details and not only his ibjectId
    res.status(200).json(bookList);
}
));

/**
 * @desc   Get book by id
 * @route  /api/books
 * @method GET
 * @access public
*/
router.get("/:id", asychandler(async(req, res) => {
    const book = await Book.findById(req.params.id);
    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).json({ message: "book not found" });
    }
}
));

/**
 * @desc   Create new book
 * @route  /api/books
 * @method POST
 * @access public
*/
router.post("/", asychandler(async(req, res) => {
    const { error } = validateCreateBook(req.body);//const result
    if (error) {//result.error
        return res.status(400).json({ message: error.details[0].message });
    }
    const book = new Book({
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        }
    )
    const result = await book.save();
    res.status(201).json(result);//201 create success
}));

/**
 * @desc   Update a book
 * @route  /api/books/:id
 * @method PUT
 * @access public
*/
router.put("/:id", asychandler(async(req, res) => {
    const { error } = validateUpdateBook(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const updatedbook= await Book.findByIdAndUpdate(req.params.id,{
        $set:{
            title: req.body.title,
            author: req.body.author,
            price: req.body.price,
        }
    },{new:true});
    res.status(200).json(updatedbook);
}));

/**
 * @desc   Delete a book
 * @route  /api/books/:id
 * @method DELETE
 * @access public
*/
router.delete("/:id", asychandler( async(req, res) => {
    const book = Book.findById(req.params.id);
    if (book) {
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "book has been deleted" });
    } else {
        res.status(404).json({ message: "book not found" });
    }
}));

module.exports = router;