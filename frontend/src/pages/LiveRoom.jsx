import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { io } from 'socket.io-client';

// 1. Establish the connection to the backend
const socket = io('https://auction-platfrom-ft07.onrender.com');

export default function LiveRoom() {
    const { id } = useParams(); // Gets the auction ID from the URL
    const [auction, setAuction] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [error, setError] = useState('');

    // Check if the user is logged in
    const userId = localStorage.getItem('userId');
    const isAuthenticated = !!userId;

    useEffect(() => {
        // 2. Fetch the initial auction data via traditional REST API
        const fetchAuction = async () => {
            try {
                const response = await fetch(`https://auction-platfrom-ft07.onrender.com/api/auctions/${id}`);
                const data = await response.json();
                setAuction(data);
            } catch (err) {
                console.error("Failed to fetch auction", err);
            }
        };
        fetchAuction();

        // 3. Tell the Socket server we want to join this specific item's room
        socket.emit('join_auction', id);

        // 4. Listen for real-time updates from the server
        socket.on('receive_bid', (updatedAuction) => {
            setAuction(updatedAuction); // This instantly updates the UI!
        });

        // Cleanup: Stop listening when the user leaves the page
        return () => {
            socket.off('receive_bid');
        };
    }, [id]);

    const handleBid = (e) => {
        e.preventDefault();
        
        const bidValue = Number(bidAmount);

        if (bidValue <= auction.currentPrice) {
            setError("Your bid must be higher than the current price!");
            return;
        }

        // 5. Send the bid to the server via WebSockets
        socket.emit('place_bid', {
            auctionId: id,
            userId: userId,
            amount: bidValue
        });

        setBidAmount(''); // Clear the input field
        setError(''); // Clear any errors
    };

    if (!auction) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading Auction Room...</h2>;

    return (
        <div className="container">
            <Link to="/" style={{ color: '#007BFF', textDecoration: 'none', fontWeight: 'bold' }}>← Back to Dashboard</Link>
            
            <div className="live-room-box">
                <div style={{ borderBottom: '2px solid #eee', paddingBottom: '15px', marginBottom: '25px' }}>
                    <h1 style={{ marginBottom: '10px' }}>{auction.title}</h1>
                    <p style={{ color: '#666', fontSize: '1.1em', lineHeight: '1.5' }}>{auction.description}</p>
                </div>

                <div style={{ textAlign: 'center', margin: '40px 0' }}>
                    <h2 style={{ margin: 0, color: '#888', fontWeight: 'normal' }}>Current Highest Bid</h2>
                    <h1 className="current-price-display" style={{ fontSize: '4.5em', margin: '15px 0', color: '#28A745' }}>
                        ${auction.currentPrice}
                    </h1>
                    <p style={{ fontSize: '1.2em', color: '#444' }}>
                        Highest Bidder: <strong>{auction.highestBidder ? auction.highestBidder.username : "No bids yet!"}</strong>
                    </p>
                </div>

                {isAuthenticated ? (
                    <form onSubmit={handleBid} style={{ marginTop: '30px' }}>
                        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}
                        
                        <div className="bid-controls">
                            <input 
                                type="number" 
                                required 
                                min={auction.currentPrice + 1}
                                value={bidAmount} 
                                onChange={(e) => setBidAmount(e.target.value)}
                                placeholder={`Bid > $${auction.currentPrice}`}
                                style={{ width: '100%', maxWidth: '250px' }}
                            />
                            <button type="submit" className="btn btn-warning" style={{ width: 'auto', margin: 0, padding: '0 30px' }}>
                                Place Bid
                            </button>
                        </div>
                    </form>
                ) : (
                    <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#fff3cd', borderRadius: '6px', color: '#856404', marginTop: '30px' }}>
                        <h3 style={{ marginBottom: '10px' }}>You must be logged in to place a bid.</h3>
                        <Link to="/login" style={{ color: '#0056b3', fontWeight: 'bold' }}>Click here to login</Link>
                    </div>
                )}
            </div>
        </div>
    );
}