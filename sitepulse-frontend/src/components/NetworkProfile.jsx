import React from 'react';
import { Lock, Globe, Server, AlertCircle } from 'lucide-react';

const NetworkProfile = ({ networkData }) => {
    if (!networkData) return <p>Network profile data unavailable.</p>;

    const { ssl, dns, whois } = networkData;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div className="grid-2">
                {/* SSL Certificate Card */}
                <div className="card">
                    <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Lock size={20} color={ssl.valid ? 'var(--score-green)' : 'var(--score-red)'} />
                        SSL Certificate Binding
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <p style={{ margin: 0 }}><strong>Status:</strong> <span style={{ color: ssl.valid ? 'var(--score-green)' : 'var(--score-red)' }}>{ssl.valid ? 'Valid & Secure' : 'Invalid / Missing'}</span></p>
                        <p style={{ margin: 0 }}><strong>Issuer Authority:</strong> {ssl.issuer}</p>
                        <p style={{ margin: 0 }}><strong>Protocol Version:</strong> {ssl.protocol}</p>
                        <p style={{ margin: 0 }}><strong>Days until Expiry:</strong> <span style={{ color: ssl.days_until_expiry < 30 ? 'var(--score-orange)' : 'var(--text-primary)' }}>{ssl.days_until_expiry} days</span></p>
                    </div>
                </div>

                {/* Domain WHOIS Card */}
                <div className="card">
                    <h3 style={{ margin: '0 0 1rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Globe size={20} color="var(--accent-blue)" />
                        Domain Registry
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <p style={{ margin: 0 }}><strong>Registrar:</strong> {whois.registrar}</p>
                        <p style={{ margin: 0 }}><strong>Creation Date:</strong> {whois.creation_date || 'Unknown'}</p>
                    </div>
                </div>
            </div>

            {/* DNS Routing Card */}
            <div className="card">
                <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Server size={20} color="var(--text-secondary)" />
                    Deep DNS Routing Records
                </h3>

                <div className="grid-3" style={{ alignItems: 'start' }}>
                    <div>
                        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>A Records (IPv4)</h4>
                        {dns.a_records.length > 0 ? dns.a_records.map((r, i) => <p key={i} style={{ margin: '0 0 0.25rem 0', fontFamily: 'monospace' }}>{r}</p>) : <p style={{ color: '#888' }}>None detected</p>}
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>MX Records (Mail)</h4>
                        {dns.mx_records.length > 0 ? dns.mx_records.map((r, i) => <p key={i} style={{ margin: '0 0 0.25rem 0', fontFamily: 'monospace' }}>{r}</p>) : <p style={{ color: '#888' }}>None detected</p>}
                    </div>
                    <div>
                        <h4 style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>TXT Records (SPF)</h4>
                        {dns.txt_records.length > 0 ? dns.txt_records.map((r, i) => <p key={i} style={{ margin: '0 0 0.5rem 0', fontSize: '0.75rem', wordBreak: 'break-all', fontFamily: 'monospace' }}>{r}</p>) : <p style={{ color: '#888' }}>None detected</p>}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default NetworkProfile;
