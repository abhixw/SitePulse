import React from 'react';
import { Database, Download, FileText, Image as ImageIcon, Code, Type } from 'lucide-react';

const StatCard = ({ label, value, icon: Icon, color }) => (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Icon size={16} color={color} />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{label}</span>
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{value}</span>
    </div>
);

const ResourceSummary = ({ metrics }) => {
    return (
        <div className="card">
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Database color="var(--accent-blue)" size={20} />
                Resource Summary
            </h3>

            <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
                <StatCard label="Total Page Size" value={metrics.total_page_size} icon={Download} color="var(--accent-blue)" />
                <StatCard label="Total Requests" value={metrics.number_of_requests} icon={FileText} color="var(--score-orange)" />
                <StatCard label="DOM Nodes" value={metrics.dom_size || `${metrics.dom_nodes_count} elements`} icon={Code} color="var(--score-green)" />
            </div>

            <div style={{ padding: '1rem', backgroundColor: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <div className="flex-between">
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Main Thread Work</span>
                    <span style={{ fontWeight: 600 }}>{metrics.main_thread_work}</span>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--bg-secondary)', borderRadius: '3px', marginTop: '0.5rem', overflow: 'hidden' }}>
                    <div style={{
                        width: `${Math.min(100, (parseFloat(metrics.main_thread_work) / 4) * 100)}%`,
                        height: '100%',
                        backgroundColor: parseFloat(metrics.main_thread_work) > 4 ? 'var(--score-red)' : 'var(--score-orange)'
                    }} />
                </div>
            </div>
        </div>
    );
};

export default ResourceSummary;
