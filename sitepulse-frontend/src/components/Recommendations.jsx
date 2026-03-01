import React from 'react';
import { AlertOctagon, AlertTriangle, Info, CheckCircle, ShieldAlert } from 'lucide-react';

const RecommendationItem = ({ text, type }) => {
    let Icon = Info;
    let color = 'var(--text-secondary)';
    let bg = 'var(--bg-primary)';

    if (type === 'critical') {
        Icon = AlertOctagon;
        color = 'var(--score-orange)';
        bg = 'rgba(245, 158, 11, 0.1)';
    } else if (type === 'high') {
        Icon = AlertTriangle;
        color = 'var(--score-orange)';
        bg = 'rgba(245, 158, 11, 0.1)';
    } else if (type === 'medium') {
        Icon = Info;
        color = 'var(--accent-blue)';
        bg = 'rgba(59, 130, 246, 0.1)';
    } else if (type === 'low') {
        Icon = CheckCircle;
        color = 'var(--score-green)';
        bg = 'rgba(34, 197, 94, 0.1)';
    }

    return (
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', padding: '1rem', backgroundColor: bg, border: `1px solid ${color}`, borderRadius: '8px', marginBottom: '0.75rem' }}>
            <Icon size={20} color={color} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ flex: 1 }}>
                <p style={{ margin: 0, color: 'var(--text-primary)', lineHeight: 1.5 }}>{text}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {type} Priority
                    </span>
                </div>
            </div>
        </div>
    );
};

const Recommendations = ({ recommendations }) => {
    const { critical, high, medium, low } = recommendations;
    const total = critical.length + high.length + medium.length + low.length;

    if (total === 0) {
        return (
            <div className="card">
                <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldAlert color="var(--accent-blue)" size={20} />
                    Action Plan
                </h3>
                <p style={{ color: 'var(--text-secondary)', margin: 0 }}>No recommendations found. The page is perfectly optimized according to our ruleset.</p>
            </div>
        );
    }

    return (
        <div className="card">
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert color="var(--accent-blue)" size={20} />
                Action Plan ({total} Recommendations)
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
                {critical.map((text, i) => <RecommendationItem key={`crit-${i}`} text={text} type="critical" />)}
                {high.map((text, i) => <RecommendationItem key={`high-${i}`} text={text} type="high" />)}
                {medium.map((text, i) => <RecommendationItem key={`med-${i}`} text={text} type="medium" />)}
                {low.map((text, i) => <RecommendationItem key={`low-${i}`} text={text} type="low" />)}
            </div>
        </div>
    );
};

export default Recommendations;
