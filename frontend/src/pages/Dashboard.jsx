import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Check if user is logged in by looking for the token
    const isAuthenticated = !!localStorage.getItem('token');
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                const response = await fetch('https://auction-platfrom-ft07.onrender.com/api/auctions');
                const data = await response.json();
                setAuctions(data);
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch auctions", error);
                setLoading(false);
            }
        };

        fetchAuctions();
    }, []);

    return (
        <div className="container">
            <header className="navbar">
                <h1>Live Auctions</h1>
                <div className="nav-links">
                    {isAuthenticated ? (
                        <>
                            <span>Welcome, <b>{username}</b>!</span>
                            <Link to="/profile" className="btn btn-primary">👤 Profile</Link>
                            <Link to="/create-auction" className="btn btn-primary">+ Create Item</Link>
                            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="btn btn-success">Login to Bid</Link>
                    )}
                </div>
            </header>

            {loading ? (
                <p>Loading auctions...</p>
            ) : auctions.length === 0 ? (
                <p>No active auctions right now. Be the first to create one!</p>
            ) : (
                <div className="auction-grid">
                    {auctions.map((item) => (
                        <div key={item._id} className="auction-card">
                            <div>
                                <h3 style={{ marginBottom: '10px' }}>{item.title}</h3>
                                <p style={{ color: '#666', marginBottom: '15px' }}>{item.description}</p>
                                <p>Current Bid: <strong style={{ color: '#28A745', fontSize: '1.2em' }}>${item.currentPrice}</strong></p>
                            </div>
                            <Link to={`/auction/${item._id}`} className="btn btn-warning">
                                View / Bid Live
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}