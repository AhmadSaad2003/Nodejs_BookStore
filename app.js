const express = require("express");
const logger = require("./middlewars/logger");
const {notFound, errorhandler} = require("./middlewars/errors");
require("dotenv").config();
const connectToDB = require("./config/db");


//connect to db
connectToDB();

//Init app
const app = express();

//Apply midellware
app.use(express.json());

app.use(logger);

//Routes
app.use("/api/books", require("./routes/books"));
app.use("/api/authors", require("./routes/authors"));
app.use("/api/auth",require("./routes/auth"));
app.use("/api/users",require("./routes/users"));

//Error handler middelware
app.use(errorhandler);

//runing the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`server is running in ${process.env.NODE_ENV} mode on port ${port}`));