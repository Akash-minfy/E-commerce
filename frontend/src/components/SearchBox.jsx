import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const SearchBox = () => {
    const [keyword, setKeyword] = useState('');
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            navigate(`/search/${keyword}`);
        } else {
            navigate('/');
        }
    };

    return (
        <form onSubmit={submitHandler} style={{ display: 'flex', alignItems: 'center' }}>
            <input
                type="text"
                name="q"
                onChange={(e) => setKeyword(e.target.value)}
                placeholder="Search Products..."
                className="form-control"
                style={{ width: '250px', borderRadius: '12px 0 0 12px', borderRight: 'none', padding: '0.5rem 1rem' }}
            />
            <button 
                type="submit" 
                className="btn btn-secondary" 
                style={{ borderRadius: '0 12px 12px 0', padding: '0.5rem 1rem', display: 'flex', borderLeft: 'none' }}
            >
                <Search size={18} style={{ color: 'var(--primary-color)' }} />
            </button>
        </form>
    );
};

export default SearchBox;
