import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
    const [history, setHistory] = useState({ myActivity: [], currentlyWinning: [] });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchProfileData = async () => {
            const token = localStorage.getItem('token');
            
            // Kick them out if they aren't logged in
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/users/profile', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                const data = await response.json();
                
                if (response.ok) {
                    setHistory(data);
                }
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch profile", error);
                setLoading(false);
            }
        };

        fetchProfileData();
    }, [navigate]);

    if (loading) return <h2 style={{ textAlign: 'center', marginTop: '50px' }}>Loading Profile...</h2>;

    return (
        <div style={{ maxWidth: '900px', margin: '40px auto', fontFamily: 'sans-serif', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #eee', paddingBottom: '20px' }}>
                <h1>👤 {username}'s Profile</h1>
                <Link to="/" style={{ padding: '8px 15px', background: '#6c757d', color: 'white', textDecoration: 'none', borderRadius: '4px' }}>Back to Dashboard</Link>
            </div>

            <div style={{ marginTop: '30px' }}>
                <h2 style={{ color: '#28A745' }}>🏆 Auctions You Are Winning</h2>
                {history.currentlyWinning.length === 0 ? (
                    <p style={{ color: '#777' }}>You aren't the highest bidder on any active auctions right now.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {history.currentlyWinning.map(item => (
                            <div key={item._id} style={{ border: '1px solid #28A745', padding: '15px', borderRadius: '8px', backgroundColor: '#f8fff9' }}>
                                <h3 style={{ margin: '0 0 10px 0' }}>{item.title}</h3>
                                <p style={{ margin: '0 0 10px 0' }}>Your Winning Bid: <strong>${item.currentPrice}</strong></p>
                                <Link to={`/auction/${item._id}`} style={{ color: '#007BFF' }}>Go to Auction Room →</Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div style={{ marginTop: '40px' }}>
                <h2 style={{ color: '#007BFF' }}>📜 Your Bidding History</h2>
                {history.myActivity.length === 0 ? (
                    <p style={{ color: '#777' }}>You haven't bid on any items yet.</p>
                ) : (
                    <div style={{ display: 'grid', gap: '15px' }}>
                        {history.myActivity.map(item => (
                            <div key={item._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px' }}>
                                <h3 style={{ margin: '0 0 10px 0' }}>{item.title}</h3>
                                <p style={{ margin: '0 0 10px 0', color: '#555' }}>Current Auction Price: ${item.currentPrice}</p>
                                <Link to={`/auction/${item._id}`} style={{ color: '#007BFF' }}>View Item →</Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}