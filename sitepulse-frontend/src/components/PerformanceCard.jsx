import React from 'react';

const PerformanceCard = ({ score }) => {
    // Determine color and status
    let color = 'var(--score-green)';
    let status = 'Excellent';
    let gradient = 'conic-gradient(var(--score-green) var(--fill), transparent 0)';

    if (score < 50) {
        color = 'var(--score-red)';
        status = 'Poor';
        gradient = 'conic-gradient(var(--score-red) var(--fill), transparent 0)';
    } else if (score < 90) {
        color = 'var(--score-orange)';
        status = 'Average';
        gradient = 'conic-gradient(var(--score-orange) var(--fill), transparent 0)';
    }

    // Calculate percentage fill for the circle (0-100) -> 0% to 100% css variable
    const fillPercentage = `${score}%`;

    return (
        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h3 style={{ margin: '0 0 1.5rem 0' }}>Performance Score</h3>

            <div
                className="score-circle"
                style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    '--fill': fillPercentage,
                    background: gradient,
                    marginBottom: '1rem'
                }}
            >
                <div style={{
                    position: 'absolute',
                    width: '100px',
                    height: '100px',
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: 700, color: color }}>
                        {score}
                    </span>
                </div>
            </div>

            <h4 style={{ margin: 0, color: color }}>{status}</h4>
        </div>
    );
};

export default PerformanceCard;
