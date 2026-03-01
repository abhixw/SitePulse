import React, { useState } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

import CategoryScores from '../components/CategoryScores';
import SecurityAudit from '../components/SecurityAudit';
import CoreVitals from '../components/CoreVitals';
import ResourceSummary from '../components/ResourceSummary';
import TechnicalAudit from '../components/TechnicalAudit';
import Recommendations from '../components/Recommendations';
import NetworkProfile from '../components/NetworkProfile';
import SeoSocialCards from '../components/SeoSocialCards';

const OverviewTab = ({ data }) => {
    const { summary, metrics } = data;
    const performanceScore = metrics.category_scores?.performance || 0;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>Executive Summary</h3>
                <p style={{
                    fontSize: '1.25rem', lineHeight: '1.6', margin: 0,
                    color: performanceScore >= 90 ? 'var(--score-green)' :
                        performanceScore >= 50 ? 'var(--score-orange)' : 'var(--score-red)'
                }}>
                    {summary}
                </p>
            </div>
            <CategoryScores scores={metrics.category_scores} />
            <CoreVitals vitals={metrics.core_web_vitals} ttfb={metrics.ttfb_ms} />
        </div>
    );
};

const PerformanceTab = ({ data }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <ResourceSummary metrics={data.metrics} />
            <Recommendations recommendations={data.recommendations} />
            <TechnicalAudit technical_findings={data.technical_findings} image_analysis={data.image_analysis} />
        </div>
    );
};

const NetworkTab = ({ data }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>Security & Network Infrastructure</h2>
            <NetworkProfile networkData={data.network_profile} />
            <SecurityAudit headers={data.technical_findings?.security_headers} />
        </div>
    );
};

const SeoTab = ({ data }) => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>SEO & Social Graph Analysis</h2>
            <SeoSocialCards seoData={data.seo_analysis} />
        </div>
    );
};

const Report = () => {
    const location = useLocation();
    const [activeSection, setActiveSection] = useState('overview');

    if (!location.state || !location.state.auditData) {
        return <Navigate to="/" replace />;
    }

    const { auditData } = location.state;
    const targetUrl = auditData.url;

    const reportData = auditData.desktop || auditData.mobile;

    const renderContent = () => {
        if (!reportData) return <p>No audit data found.</p>;

        switch (activeSection) {
            case 'overview': return <OverviewTab data={reportData} />;
            case 'performance': return <PerformanceTab data={reportData} />;
            case 'network': return <NetworkTab data={reportData} />;
            case 'seo': return <SeoTab data={reportData} />;
            default: return <OverviewTab data={reportData} />;
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
            <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} url={targetUrl} />

            <div style={{
                flex: 1,
                marginLeft: '280px',
                padding: '3rem',
                maxWidth: 'calc(100vw - 280px)'
            }}>
                {renderContent()}
            </div>
        </div>
    );
};

export default Report;
