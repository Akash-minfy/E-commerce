import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useStore from '../store/useStore';
import axios from 'axios';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const login = useStore(state => state.login);
    const userInfo = useStore(state => state.userInfo);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    // If already logged in, redirect immediately
    useEffect(() => {
        if (userInfo) {
            navigate(redirect);
        }
    }, [userInfo, navigate, redirect]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            const config = { headers: { 'Content-Type': 'application/json' } };
            const { data } = await axios.post('/api/users/login', { email, password }, config);
            login(data);
            navigate(redirect);
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto' }} className="card">
            <div style={{ padding: '2rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', textAlign: 'center' }}>Sign In</h2>
                {error && <div style={{ background: '#ef4444', color: 'white', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
                <form onSubmit={submitHandler}>
                    <div className="form-group">
                        <label>Email Address</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="form-control" />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                        {loading ? 'Signing In...' : 'Login'}
                    </button>
                    <div style={{ marginTop: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        New customer? <Link to={`/register?redirect=${encodeURIComponent(redirect)}`} style={{ color: 'var(--primary-color)' }}>Register here</Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
