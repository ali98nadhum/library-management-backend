const express = require('express');
require("dotenv").config();
const connectToDB  = require("./config/connectToDb")
const cors = require('cors');



// Connect To DB
connectToDB()


// run app
const app = express();


// Middleware
app.use(cors({
    origin: "*",
}));


// Run Server
const port = process.env.PORT || 8000;
app.listen(port , () => console.log(`Server run on port ${port}`)
)