const express = require("express");
const router = express.Router();
const asychandler=require("express-async-handler");
const { Author, validateCreateAuthor, validateUpdateAuthor } = require("../models/Author");//the class that we will use it to create objects authors

/**
 * @desc   Get all authors
 * @route  /api/authors
 * @method GET
 * @access public
*/
/*router.get("/", (req,res)=>{
    res.status(200).json(authors);
})*/
router.get("/", asychandler(async (req, res) => {
        const authorList = await Author.find().sort({ name: 1 }).select("name nationality -_id");//- for not display
        res.status(200).json(authorList);
    }
))

/**
 * @desc   Get author by id
 * @route  /api/authors
 * @method GET
 * @access public
*/
/**router.get("/:id", (req,res)=>{
    const author = authors.find(a => a.id === parseInt(req.params.id));
    if(author){
        res.status(200).json(author);
    }else{
        res.status(404).json({message:"author not found"});
    }
})*/
router.get("/:id", asychandler(async (req, res) => {
        const author = await Author.findById(req.params.id);
        if (author) {
            res.status(200).json(author);
        } else {
            res.status(404).json({ message: "author not found" });
        }
    }
))

/**
 * @desc   Create new author
 * @route  /api/authors
 * @method POST
 * @access public
*/
/*router.post("/",(req,res)=>{
    const {error}= validateCreateAuthor(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }
    const author={
        id:authors.length+1,
        name:req.body.name,
        nationality:req.body.nationality,
    }
    authors.push(author);
    res.status(201).json(author);//201 create success
});*/
router.post("/", asychandler(async (req, res) => {
        const { error } = validateCreateAuthor(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }
        const author = new Author({
            name: req.body.name,
            nationality: req.body.nationality,
        });
        const result = await author.save();
        res.status(201).json(result);//201 create success
    }
));

/**
 * @desc   Update a author
 * @route  /api/authors/:id
 * @method PUT
 * @access public
*/
/*router.put("/:id", (req,res)=>{
    const {error}= validateUpdateAuthor(req.body);
    if(error){
        return res.status(400).json({message:error.details[0].message});
    }
    const author = authors.find(a => a.id === parseInt(req.params.id));
    if(author){
        res.status(200).json({message:"author has been updated"});
    }else{
        res.status(404).json({message:"author not found"});
    }
});*/
router.put("/:id", asychandler(async (req, res) => {
    const { error } = validateUpdateAuthor(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    const author = await Author.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            nationality: req.body.nationality,
        }
    }, { new: true });
    res.status(200).json(author);
    }    
));

/**
 * @desc   Delete a author
 * @route  /api/authors/:id
 * @method DELETE
 * @access public
*/
/*router.delete("/:id", (req,res)=>{
    const author = authors.find(a => a.id === parseInt(req.params.id));
    if(author){
        res.status(200).json({message:"author has been deleted"});
    }else{
        res.status(404).json({message:"author not found"});
    }
});*/
router.delete("/:id", asychandler(async (req, res) => {
    const author = await Author.findById(req.params.id);
    if (author) {
        await Author.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "author has been deleted" });
    } else {
        res.status(404).json({ message: "author not found" });
    }
}
));

module.exports = router;