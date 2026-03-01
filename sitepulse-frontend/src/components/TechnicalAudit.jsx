import React, { useState } from 'react';
import { ChevronDown, ChevronUp, AlertCircle, FileWarning, Globe, Clock, Target } from 'lucide-react';

const AccordionItem = ({ title, count, icon: Icon, children, color }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (count === 0) return null;

    return (
        <div style={{ border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '0.75rem', overflow: 'hidden' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-primary)', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Icon size={18} color={color} />
                    <span style={{ fontWeight: 600 }}>{title}</span>
                    <span style={{ padding: '2px 8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '0.75rem' }}>
                        {count} issues
                    </span>
                </div>
                {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>

            {isOpen && (
                <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                    {children}
                </div>
            )}
        </div>
    );
};

const formatBytes = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const TechnicalAudit = ({ technical_findings, image_analysis }) => {
    const totalIssues =
        technical_findings.image_issues.length +
        technical_findings.render_blocking.length +
        technical_findings.unused_assets.length +
        technical_findings.third_party.length +
        technical_findings.heavy_resources.length;

    if (totalIssues === 0) {
        return (
            <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem' }}>
                <Target color="var(--score-green)" size={48} style={{ marginBottom: '1rem' }} />
                <h3 style={{ margin: 0 }}>Perfect Technical Health</h3>
                <p style={{ color: 'var(--text-secondary)' }}>No performance-blocking resources found.</p>
            </div>
        );
    }

    return (
        <div className="card">
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileWarning color="var(--accent-blue)" size={20} />
                Deep Technical Findings
            </h3>

            <AccordionItem title="Render-Blocking Resources" count={technical_findings.render_blocking.length} icon={Clock} color="var(--score-red)">
                <ul style={{ listStylePosition: 'inside', color: 'var(--text-secondary)' }}>
                    {technical_findings.render_blocking.map((item, i) => (
                        <li key={i} style={{ marginBottom: '0.5rem', wordBreak: 'break-all' }}>
                            <span style={{ color: 'var(--text-primary)' }}>{item.url}</span> — <span className="text-red">{item.wasted_ms}ms delayed</span>
                        </li>
                    ))}
                </ul>
            </AccordionItem>

            <AccordionItem title="Unused CSS/JS Assets" count={technical_findings.unused_assets.length} icon={FileWarning} color="var(--score-orange)">
                <ul style={{ listStylePosition: 'inside', color: 'var(--text-secondary)' }}>
                    {technical_findings.unused_assets.map((item, i) => (
                        <li key={i} style={{ marginBottom: '0.5rem', wordBreak: 'break-all' }}>
                            <span style={{ color: 'var(--text-primary)' }}>{item.url}</span> — <span className="text-orange">{formatBytes(item.wasted_bytes)} wasted</span>
                        </li>
                    ))}
                </ul>
            </AccordionItem>

            <AccordionItem title="Third-Party Scripts" count={technical_findings.third_party.length} icon={Globe} color="var(--score-orange)">
                <ul style={{ listStylePosition: 'inside', color: 'var(--text-secondary)' }}>
                    {technical_findings.third_party.map((item, i) => (
                        <li key={i} style={{ marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--text-primary)' }}>{item.entity}</span> — Blocked: {item.blocking_time}ms | Download: {formatBytes(item.transfer_size)}
                        </li>
                    ))}
                </ul>
            </AccordionItem>

            <AccordionItem title="Image/Media Issues" count={technical_findings.image_issues.length} icon={AlertCircle} color="var(--score-orange)">
                <ul style={{ listStylePosition: 'inside', color: 'var(--text-secondary)' }}>
                    {technical_findings.image_issues.map((item, i) => (
                        <li key={i} style={{ marginBottom: '0.5rem' }}>
                            <span style={{ color: 'var(--text-primary)' }}>{item.title}</span> — Type: {item.type} | Savings: {formatBytes(item.wasted_bytes)}
                        </li>
                    ))}
                </ul>
            </AccordionItem>

            <AccordionItem title="Massive Payloads (>500KB)" count={technical_findings.heavy_resources.length} icon={Target} color="var(--score-red)">
                <ul style={{ listStylePosition: 'inside', color: 'var(--text-secondary)' }}>
                    {technical_findings.heavy_resources.map((item, i) => (
                        <li key={i} style={{ marginBottom: '0.5rem', wordBreak: 'break-all' }}>
                            <span style={{ color: 'var(--text-primary)' }}>{item.url}</span> — <span className="text-red">{formatBytes(item.transfer_size)}</span>
                        </li>
                    ))}
                </ul>
            </AccordionItem>
        </div>
    );
};

export default TechnicalAudit;
