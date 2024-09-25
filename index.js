const express = require('express');
require("dotenv").config();
const connectToDB  = require("./config/connectToDb")
const cors = require('cors');



// Connect To DB
connectToDB()


// run app
const app = express();


// Middleware
app.use(express.json());
app.use(cors({
    origin: "*",
}));

// Routes
app.use("/api/category" , require("./routes/categoryRoute"));
app.use("/api/book" , require("./routes/BookRoute"));
app.use("/api/orders" , require("./routes/OrderRoute"));


// Run Server
const port = process.env.PORT || 8000;
app.listen(port , () => console.log(`Server run on port ${port}`)
)