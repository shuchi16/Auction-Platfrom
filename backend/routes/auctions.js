// routes/auctions.js
const express = require('express');
const router = express.Router();
const Auction = require('../models/Auction');
const auth = require('../middleware/authMiddleware'); // Import our security check
const upload = require('../config/cloudinary');

// @route   GET /api/auctions
// @desc    Get all active auctions
// @access  Public (Anyone can see the dashboard)
router.get('/', async (req, res) => {
    try {
        // Fetch all auctions, sorted by when they were created
        const auctions = await Auction.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(auctions);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET /api/auctions/:id
// @desc    Get a single auction by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        // .populate() replaces the User ID with the actual User object (minus the password)
        const auction = await Auction.findById(req.params.id)
            .populate('highestBidder', 'username')
            .populate('bids.user', 'username'); 
            
        if (!auction) {
            return res.status(404).json({ message: 'Auction not found' });
        }
        res.json(auction);
    } catch (err) {
        console.error(err.message);
        // If the ID is completely invalid format
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ message: 'Auction not found' });
        }
        res.status(500).send('Server Error');
    }
});

// @route   POST /api/auctions
// @desc    Create a new auction item
// @access  Private (Requires JWT token)
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        // req.body contains the text fields
        const { title, description, startingPrice, endTime } = req.body;
        
        // req.file contains the file data returned from Cloudinary
        if (!req.file) {
            return res.status(400).json({ message: "An image file is required" });
        }

        const newAuction = new Auction({
            title,
            description,
            imageUrl: req.file.path, // This is the secure Cloudinary URL
            startingPrice,
            currentPrice: startingPrice,
            endTime
        });

        const auction = await newAuction.save();
        res.status(201).json(auction);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error during auction creation');
    }
});

module.exports = router;