import React from 'react';
import { Link } from 'react-router-dom';

const Paginate = ({ pages, page, keyword = '' }) => {
    return pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem', flexWrap: 'wrap' }}>
            {[...Array(pages).keys()].map(x => (
                <Link
                    key={x + 1}
                    to={keyword ? `/search/${keyword}/page/${x + 1}` : `/page/${x + 1}`}
                    style={{
                        padding: '0.5rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        background: x + 1 === page ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                        color: x + 1 === page ? 'white' : 'var(--text-main)',
                        fontWeight: x + 1 === page ? 'bold' : 'normal',
                        border: '1px solid',
                        borderColor: x + 1 === page ? 'var(--primary-color)' : 'var(--border-color)',
                        transition: 'all 0.2s ease'
                    }}
                >
                    {x + 1}
                </Link>
            ))}
        </div>
    );
};

export default Paginate;
