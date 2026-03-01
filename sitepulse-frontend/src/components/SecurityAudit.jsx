import React from 'react';
import { ShieldCheck, ShieldAlert, Lock, FileCode, CheckCircle2, XCircle } from 'lucide-react';

const SecurityItem = ({ title, passed, description }) => {
    const Icon = passed ? CheckCircle2 : XCircle;
    const color = passed ? 'var(--score-green)' : 'var(--score-orange)';
    const bg = passed ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)';

    return (
        <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            padding: '1rem',
            backgroundColor: bg,
            border: `1px solid ${color}`,
            borderRadius: '8px',
            transition: 'all 0.3s ease'
        }}>
            <Icon size={20} color={color} style={{ flexShrink: 0, marginTop: '2px' }} />
            <div>
                <h4 style={{ margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>{title}</h4>
                <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{description}</p>
            </div>
        </div>
    );
};

const SecurityAudit = ({ headers }) => {
    if (!headers) return null;

    const issuesCount = Object.values(headers).filter(val => !val).length;
    const isPerfect = issuesCount === 0;

    return (
        <div className="card" style={{ marginTop: '1.5rem' }}>
            <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {isPerfect ? <ShieldCheck color="var(--score-green)" size={20} /> : <ShieldAlert color="var(--score-orange)" size={20} />}
                Security Headers Audit
            </h3>

            <div className="grid-2">
                <SecurityItem
                    title="Strict-Transport-Security (HSTS)"
                    passed={headers.strict_transport_security}
                    description="Forces browsers to only connect via secure HTTPS connections."
                />
                <SecurityItem
                    title="Content-Security-Policy (CSP)"
                    passed={headers.content_security_policy}
                    description="Prevents Cross-Site Scripting (XSS) and data injection attacks."
                />
                <SecurityItem
                    title="X-Content-Type-Options"
                    passed={headers.x_content_type_options}
                    description="Stops browsers from MIME-sniffing the response away from the declared content-type."
                />
                <SecurityItem
                    title="X-Frame-Options"
                    passed={headers.x_frame_options}
                    description="Protects against Clickjacking by preventing the page from being embedded in an iframe."
                />
            </div>
        </div>
    );
};

export default SecurityAudit;
