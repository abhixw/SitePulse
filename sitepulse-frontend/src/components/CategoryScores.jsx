import React from 'react';
import { Activity } from 'lucide-react';

const Dial = ({ title, score }) => {
    let colorClass, colorHex;
    if (score >= 90) {
        colorClass = 'text-green';
        colorHex = 'var(--score-green)';
    } else if (score >= 50) {
        colorClass = 'text-orange';
        colorHex = 'var(--score-orange)';
    } else {
        colorClass = 'text-red';
        colorHex = 'var(--score-red)';
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                background: `conic-gradient(${colorHex} ${score * 3.6}deg, var(--border-color) 0deg)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
                transition: 'all 1s ease-out'
            }}>
                <div style={{
                    width: '100px',
                    height: '100px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'monospace',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }} className={colorClass}>
                    {score}
                </div>
            </div>
            <h4 style={{ margin: 0, fontWeight: 600, color: 'var(--text-primary)' }}>{title}</h4>
        </div>
    );
};

const CategoryScores = ({ scores }) => {
    if (!scores) return null;

    return (
        <div className="card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                <Activity color="var(--accent-pink)" size={24} />
                <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>Audit Scores</h2>
            </div>

            <div className="grid-4" style={{ justifyItems: 'center' }}>
                <Dial title="Performance" score={scores.performance || 0} />
                <Dial title="Accessibility" score={scores.accessibility || 0} />
                <Dial title="Best Practices" score={scores.pwa || 0} />
                <Dial title="SEO Health" score={scores.seo || 0} />
            </div>
        </div>
    );
};

export default CategoryScores;
