import React from 'react';
import { Activity, Zap, Shield, Search, Code, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const navItems = [
    { id: 'overview', label: 'Overview Dashboard', icon: Activity },
    { id: 'performance', label: 'Performance Engine', icon: Zap },
    { id: 'network', label: 'Security & Network', icon: Shield },
    { id: 'seo', label: 'Deep SEO & Social', icon: Search },
];

const Sidebar = ({ activeSection, setActiveSection, url }) => {
    const navigate = useNavigate();

    return (
        <div style={{
            width: '280px',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            backgroundColor: 'var(--bg-secondary)',
            borderRight: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem 1rem'
        }}>
            <button
                onClick={() => navigate('/')}
                style={{
                    background: 'none', border: 'none', color: 'var(--text-secondary)',
                    display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer',
                    padding: 0, marginBottom: '2rem', marginLeft: '0.5rem'
                }}
            >
                <ArrowLeft size={16} /> Back to Search
            </button>

            <div style={{ marginBottom: '2rem', padding: '0 0.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0', color: 'var(--text-primary)' }}>SitePulse</h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', wordBreak: 'break-all', margin: 0 }}>{url}</p>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeSection === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => setActiveSection(item.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 1rem',
                                border: 'none',
                                borderRadius: '8px',
                                backgroundColor: isActive ? 'var(--accent-blue)' : 'transparent',
                                color: isActive ? 'var(--bg-primary)' : 'var(--text-primary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                textAlign: 'left',
                                fontWeight: isActive ? 600 : 400
                            }}
                        >
                            <Icon size={18} color={isActive ? 'var(--bg-primary)' : 'var(--accent-blue)'} />
                            {item.label}
                        </button>
                    );
                })}
            </nav>
        </div>
    );
};

export default Sidebar;
