import React from 'react';
import { AlertCircle } from 'lucide-react';

const ErrorAlert = ({ message }) => {
    if (!message) return null;

    return (
        <div style={{
            backgroundColor: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.2)',
            borderRadius: '8px',
            padding: '1rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.75rem',
            marginBottom: '1.5rem'
        }}>
            <AlertCircle color="var(--score-orange)" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
                <h4 style={{ color: 'var(--score-orange)', margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>Error Processing Audit</h4>
                <p style={{ color: 'var(--text-secondary)', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>{message}</p>
            </div>
        </div>
    );
};

export default ErrorAlert;
