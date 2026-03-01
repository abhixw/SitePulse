import React from 'react';
import { Database, Server, Component, BarChart3, Globe } from 'lucide-react';

const TechCategory = ({ title, items, icon: Icon, color }) => {
    if (!items || items.length === 0) return null;

    return (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h3 style={{
                margin: '0 0 1rem 0',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-primary)'
            }}>
                <Icon size={20} color={color} />
                {title}
            </h3>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {items.map((item, index) => (
                    <span key={index} style={{
                        padding: '0.5rem 1rem',
                        backgroundColor: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)',
                        borderRadius: '20px',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        color: 'var(--text-secondary)'
                    }}>
                        {item}
                    </span>
                ))}
            </div>
        </div>
    );
};

const TechStackTable = ({ techStack }) => {
    if (!techStack) return <p>No technology signatures detected.</p>;

    return (
        <div>
            <TechCategory
                title="Frontend Frameworks"
                items={techStack.frameworks}
                icon={Component}
                color="var(--accent-pink)"
            />
            <TechCategory
                title="Web Servers"
                items={techStack.servers}
                icon={Server}
                color="var(--score-green)"
            />
            <TechCategory
                title="Analytics & Tracking"
                items={techStack.analytics}
                icon={BarChart3}
                color="var(--score-orange)"
            />
            <TechCategory
                title="Content Management (CMS)"
                items={techStack.cms}
                icon={Database}
                color="var(--accent-blue)"
            />
            <TechCategory
                title="Content Delivery (CDN)"
                items={techStack.cdns}
                icon={Globe}
                color="var(--text-secondary)"
            />
        </div>
    );
};

export default TechStackTable;
