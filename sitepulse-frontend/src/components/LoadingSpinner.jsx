import React from 'react';

const LoadingSpinner = ({ message = "Analyzing website performance..." }) => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '3rem',
            gap: '1rem'
        }}>
            <div className="spinner" style={{
                width: '40px',
                height: '40px',
                border: '3px solid var(--border-color)',
                borderTop: '3px solid var(--accent-blue)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
            }}></div>
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
            <p style={{ color: 'var(--text-secondary)' }}>{message}</p>
        </div>
    );
};

export default LoadingSpinner;
