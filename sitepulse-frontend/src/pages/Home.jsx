import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import URLForm from '../components/URLForm';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorAlert from '../components/ErrorAlert';
import { analyzeWebsite } from '../api/api';

const Home = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleAuditRequest = async (data) => {
        setIsLoading(true);
        setError('');

        try {
            const result = await analyzeWebsite(data);
            // Pass the complex AuditReport state securely to the report dashboard
            navigate('/report', { state: { auditData: result, strategy: data.strategy } });
        } catch (err) {
            if (err.response) {
                if (err.response.status === 429) {
                    setError('Too many requests. Please slow down and try again later.');
                } else if (err.response.status === 400) {
                    setError(err.response.data.detail || 'Validation error. Check your URL.');
                } else {
                    setError(err.response.data.detail || 'Server encountered an error while auditing.');
                }
            } else {
                setError('Network error. Ensure the backend is running.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <h1 className="animate-pulse-text" style={{ fontSize: '3rem', margin: '0 0 1rem 0', color: 'var(--score-orange)' }}>
                    <span style={{ color: 'brown' }}>SitePulse</span> - A Web Performance Audit Engine
                </h1>
            </div>

            <div style={{ width: '100%', maxWidth: '500px' }}>
                <ErrorAlert message={error} />
                {isLoading ? (
                    <div className="card">
                        <LoadingSpinner />
                        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '1rem' }}>
                            Deep PageSpeed diagnostics take 15-45 seconds...
                        </p>
                    </div>
                ) : (
                    <URLForm onSubmit={handleAuditRequest} isLoading={isLoading} />
                )}
            </div>
        </div>
    );
};

export default Home;
