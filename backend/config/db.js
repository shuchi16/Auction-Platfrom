const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        // MONGO_URI will be stored in your .env file
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;