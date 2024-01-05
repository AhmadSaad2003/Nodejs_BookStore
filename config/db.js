const mongoose = require("mongoose");
async function connectToDB(){
    //connection to database
 await mongoose
.connect(process.env.MONGO_URI)//mongodb:database name on the local host with the database bookstoreDB
.then(() => console.log("Connected to MongoDB..."))
.catch((error) => console.log("Connection failed to MongoDB!", error));
}

module.exports=connectToDB;