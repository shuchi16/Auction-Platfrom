import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateAuction() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        startingPrice: '',
        endTime: ''
    });
    const [image, setImage] = useState(null); 
    const [error, setError] = useState('');
    const navigate = useNavigate();

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

    const handleFileChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!image) {
            setError("Please select an image for your auction item.");
            return;
        }

        const token = localStorage.getItem('token');

        const submissionData = new FormData();
        submissionData.append('title', formData.title);
        submissionData.append('description', formData.description);
        submissionData.append('startingPrice', formData.startingPrice);
        submissionData.append('endTime', formData.endTime);
        
        submissionData.append('image', image); 

        try {
            const response = await fetch('https://auction-platfrom-ft07.onrender.com/api/auctions', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}` 
                },
                body: submissionData
            });

            const data = await response.json();

            if (response.ok) {
                alert('Auction item created successfully!');
                navigate('/');
            } else {
                setError(data.message || 'Failed to create auction');
            }
        } catch (err) {
            setError('Server error. Is the backend running?');
        }
    };

    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const minDateTime = now.toISOString().slice(0, 16);

    return (
        <div className="form-container">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ marginBottom: '0' }}>Create New Auction</h2>
                <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer', textDecoration: 'underline' }}>
                    Cancel
                </button>
            </div>
            
            {error && <p style={{ color: 'red', background: '#ffe6e6', padding: '10px', borderRadius: '4px', marginTop: '15px' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <div>
                    <label style={{ fontWeight: 'bold' }}>Item Title</label>
                    <input 
                        type="text" name="title" required
                        value={formData.title} onChange={handleChange}
                    />
                </div>

                <div>
                    <label style={{ fontWeight: 'bold' }}>Item Image</label>
                    <input 
                        type="file" name="image" required accept="image/*"
                        onChange={handleFileChange}
                        style={{ padding: '8px 0' }}
                    />
                </div>

                <div>
                    <label style={{ fontWeight: 'bold' }}>Description</label>
                    <textarea 
                        name="description" required rows="4"
                        value={formData.description} onChange={handleChange}
                    />
                </div>

                <div>
                    <label style={{ fontWeight: 'bold' }}>Starting Price ($)</label>
                    <input 
                        type="number" name="startingPrice" required min="1"
                        value={formData.startingPrice} onChange={handleChange}
                    />
                </div>

                <div>
                    <label style={{ fontWeight: 'bold' }}>Auction End Time</label>
                    <input 
                        type="datetime-local" name="endTime" required min={minDateTime}
                        value={formData.endTime} onChange={handleChange}
                    />
                </div>

                <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', padding: '12px', fontSize: '16px' }}>
                    Post Item for Auction
                </button>
            </form>
        </div>
    );
}