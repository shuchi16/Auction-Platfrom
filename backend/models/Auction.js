const mongoose = require('mongoose');

const auctionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false, // 1. Change this to false so old items don't crash
        default: "https://via.placeholder.com/300?text=No+Image" // 2. (Optional) Give it a default grey box image
    },
    startingPrice: {
        type: Number,
        required: true
    },
    currentPrice: {
        type: Number,
        default: function() {
            return this.startingPrice; // Defaults to starting price when created
        }
    },
    highestBidder: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Links to the User model
        default: null
    },
    endTime: {
        type: Date,
        required: true // Crucial for the frontend countdown timer
    },
    // Optional: Keep a history of all bids for this item
    bids: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        amount: { type: Number },
        time: { type: Date, default: Date.now }
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Auction', auctionSchema);