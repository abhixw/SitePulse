import React, { useState } from 'react';
import { Activity } from 'lucide-react';

const URLForm = ({ onSubmit, isLoading }) => {
    const [url, setUrl] = useState('');
    const [strategy, setStrategy] = useState('both');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        if (!url) {
            setError('Please enter a valid URL.');
            return;
        }

        try {
            new URL(url);
        } catch (_) {
            setError('Invalid URL format. Include http:// or https://');
            return;
        }

        onSubmit({ url, strategy });
    };

    return (
        <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.5rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
                    <Activity color="var(--accent-blue)" size={24} />
                </div>
                <h2 style={{ margin: 0 }}>Start Performance Audit</h2>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="input-group">
                    <label className="input-label" htmlFor="url">Target URL</label>
                    <input
                        id="url"
                        type="url"
                        className="input-field"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={isLoading}
                        required
                    />
                    {error && <p style={{ color: 'var(--score-red)', margin: 0, fontSize: '0.875rem' }}>{error}</p>}
                </div>

                <div className="input-group">
                    <label className="input-label" htmlFor="strategy">Analysis Strategy</label>
                    <select
                        id="strategy"
                        className="input-field"
                        value={strategy}
                        onChange={(e) => setStrategy(e.target.value)}
                        disabled={isLoading}
                    >
                        <option value="both">Both (Mobile & Desktop)</option>
                        <option value="mobile">Mobile Only</option>
                        <option value="desktop">Desktop Only</option>
                    </select>
                </div>

                <button type="submit" className="btn-primary mt-4" disabled={isLoading} style={{ width: '100%' }}>
                    {isLoading ? 'Analyzing...' : 'Run Audit'}
                </button>
            </form>
        </div>
    );
};

export default URLForm;
