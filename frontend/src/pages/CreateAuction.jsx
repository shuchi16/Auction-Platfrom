import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateAuction() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startingPrice: '',
        endTime: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 1. Check authentication BEFORE rendering the form
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to create an auction.');
            navigate('/login');
        }
    }, [navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Grab the token from local storage
        const token = localStorage.getItem('token');

        try {
            const response = await fetch('http://localhost:5000/api/auctions', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // IMPORTANT: This proves who we are!
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Auction item created successfully!');
                navigate('/'); // Go back to the dashboard to see it
            } else {
                setError(data.message || 'Failed to create auction');
            }
        } catch (err) {
            setError('Server error. Is the backend running?');
        }
    };

    // Calculate minimum datetime for the input (can't set an auction to end in the past)
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const minDateTime = now.toISOString().slice(0, 16);

    return (
        <div className="form-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Create New Auction</h2>
                <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer', textDecoration: 'underline' }}>
                    Cancel & Go Back
                </button>
            </div>
            
            {error && <p style={{ color: 'red', background: '#ffe6e6', padding: '10px', borderRadius: '4px' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <div>
                    <label>Item Title</label>
                    <input 
                        type="text" name="title" required
                        value={formData.title} onChange={handleChange}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }}
                    />
                </div>

                <div>
                    <label>Description</label>
                    <textarea 
                        name="description" required rows="4"
                        value={formData.description} onChange={handleChange}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }}
                    />
                </div>

                <div>
                    <label>Starting Price ($)</label>
                    <input 
                        type="number" name="startingPrice" required min="1"
                        value={formData.startingPrice} onChange={handleChange}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }}
                    />
                </div>

                <div>
                    <label>Auction End Time</label>
                    <input 
                        type="datetime-local" name="endTime" required min={minDateTime}
                        value={formData.endTime} onChange={handleChange}
                        style={{ width: '100%', padding: '10px', marginTop: '5px', boxSizing: 'border-box' }}
                    />
                </div>

                <button type="submit" style={{ padding: '12px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer', fontSize: '16px', borderRadius: '4px', marginTop: '10px' }}>
                    Post Item for Auction
                </button>
            </form>
        </div>
    );
}