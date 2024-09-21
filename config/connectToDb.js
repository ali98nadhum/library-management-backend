const mongoose = require('mongoose');

module.exports = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connect to DB ^_^");  
    } catch (error) {
        console.log("Connection faild to DB ): " , error);
        
    }
}