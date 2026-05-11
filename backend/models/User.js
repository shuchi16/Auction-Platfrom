const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true 
        // Note: We will hash this with bcrypt later in the backend phase
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

module.exports = mongoose.model('User', userSchema);