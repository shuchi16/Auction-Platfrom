const express = require('express');
const router = express.Router();
const Auction = require('../models/Auction');
const auth = require('../middleware/authMiddleware'); // Requires user to be logged in

// @route   GET /api/users/profile
// @desc    Get all auctions the user has interacted with
// @access  Private
router.get('/profile', auth, async (req, res) => {
    try {
        const userId = req.user.userId;

        // 1. Find all auctions where the user exists in the 'bids' array
        const myActivity = await Auction.find({ 'bids.user': userId }).sort({ createdAt: -1 });

        // 2. Find auctions where the user is currently winning (highest bidder)
        const currentlyWinning = await Auction.find({ highestBidder: userId, isActive: true });

        res.json({
            myActivity,
            currentlyWinning
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;