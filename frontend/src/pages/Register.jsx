import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Send data to our Node backend
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registration successful! Please login.');
                navigate('/login'); // Redirect to login page
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch (err) {
            setError('Server error. Is the backend running?');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
            <h2>Create an Account</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input 
                    type="text" name="username" placeholder="Username" required
                    value={formData.username} onChange={handleChange}
                    style={{ padding: '10px' }}
                />
                <input 
                    type="email" name="email" placeholder="Email" required
                    value={formData.email} onChange={handleChange}
                    style={{ padding: '10px' }}
                />
                <input 
                    type="password" name="password" placeholder="Password" required
                    value={formData.password} onChange={handleChange}
                    style={{ padding: '10px' }}
                />
                <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Register
                </button>
            </form>
            <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
    );
}