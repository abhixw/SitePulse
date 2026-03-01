import React from 'react';
import { Activity, Layout, MousePointerClick, Zap } from 'lucide-react';

const VitalMetric = ({ label, value, icon: Icon, thresholds, unit = "" }) => {
    // Simple logic to color-code based on string values
    const numericString = value.replace(/[^0-9.]/g, '');
    const numValue = parseFloat(numericString);

    let colorClass = 'text-green';
    let status = 'Good';

    if (!isNaN(numValue)) {
        if (numValue > thresholds.poor) {
            colorClass = 'text-red';
            status = 'Poor';
        } else if (numValue > thresholds.needsImprovement) {
            colorClass = 'text-orange';
            status = 'Needs Improvement';
        }
    }

    return (
        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            <div className="flex-between mb-2">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <Icon size={16} />
                    <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{label}</span>
                </div>
                <span className={colorClass} style={{ fontSize: '0.75rem', fontWeight: 600, padding: '2px 8px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    {status}
                </span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>
                {value === "N/A" ? "N/A" : `${numericString}${unit}`}
            </div>
        </div>
    );
};

const CoreVitals = ({ vitals, ttfb }) => {
    return (
        <div className="card">
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap color="var(--accent-blue)" size={20} />
                Core Web Vitals
            </h3>

            <div className="grid-2">
                <VitalMetric
                    label="Largest Contentful Paint (LCP)"
                    value={vitals.lcp}
                    icon={Layout}
                    thresholds={{ needsImprovement: 2.5, poor: 4.0 }}
                    unit="s"
                />
                <VitalMetric
                    label="Cumulative Layout Shift (CLS)"
                    value={vitals.cls}
                    icon={Activity}
                    thresholds={{ needsImprovement: 0.1, poor: 0.25 }}
                />
                <VitalMetric
                    label="Interaction to Next Paint (INP)"
                    value={vitals.inp}
                    icon={MousePointerClick}
                    thresholds={{ needsImprovement: 200, poor: 500 }}
                    unit="ms"
                />
                <VitalMetric
                    label="Initial Server Response (TTFB)"
                    value={`${ttfb} ms`}
                    icon={Zap}
                    thresholds={{ needsImprovement: 600, poor: 1000 }}
                    unit=" ms"
                />
            </div>
        </div>
    );
};

export default CoreVitals;
