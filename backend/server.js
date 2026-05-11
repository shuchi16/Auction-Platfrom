const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db'); // Imports your DB connection
const Auction = require('./models/Auction');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express
const app = express();

// Middleware
app.use(cors()); // Allows frontend to make requests to backend
app.use(express.json()); // Allows backend to parse JSON data from requests
app.use('/api/auth', require('./routes/auth'));
app.use('/api/auctions', require('./routes/auctions'));
app.use('/api/users', require('./routes/users'));

// Create HTTP Server (needed for Socket.io)
const server = http.createServer(app);

// Setup Socket.io
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // This is Vite's default React port
        methods: ["GET", "POST"]
    }
});

// Real-time Socket Connection
io.on('connection', (socket) => {
    console.log(`User Connected: ${socket.id}`);

    // 1. User joins a specific auction room
    // This ensures bids are only sent to people looking at this specific item
    socket.on('join_auction', (auctionId) => {
        socket.join(auctionId);
        console.log(`User joined room: ${auctionId}`);
    });

    // 2. Listen for a new bid
    socket.on('place_bid', async (data) => {
        const { auctionId, userId, amount } = data;

        try {
            // Find the auction in the database
            const auction = await Auction.findById(auctionId);

            if (!auction) return; // Ignore if item doesn't exist
            if (!auction.isActive) return; // Ignore if auction ended
            
            // Validate the bid is higher than the current price
            if (amount > auction.currentPrice) {
                // Update the database
                auction.currentPrice = amount;
                auction.highestBidder = userId;
                
                // Add to bid history
                auction.bids.push({ user: userId, amount: amount });
                
                // Save changes to MongoDB
                await auction.save();

                // Fetch the updated auction with the user's name populated
                const updatedAuction = await Auction.findById(auctionId)
                    .populate('highestBidder', 'username')
                    .populate('bids.user', 'username');

                // 3. Broadcast the new price to EVERYONE in that specific room
                io.to(auctionId).emit('receive_bid', updatedAuction);
            }
        } catch (error) {
            console.error("Error processing bid:", error);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User Disconnected: ${socket.id}`);
    });
});

// A simple test route
app.get('/api/test', (req, res) => {
    res.json({ message: "Backend is running successfully!" });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});