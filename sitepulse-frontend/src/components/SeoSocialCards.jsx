import React from 'react';
import { Search, Hash, Share2, LayoutTemplate } from 'lucide-react';

const SeoSocialCards = ({ seoData }) => {
    if (!seoData) return <p>SEO Analysis unavailable.</p>;

    const { title, description, robots, canonical, open_graph, twitter_card, headings, has_schema_markup } = seoData;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Core HTML SEO */}
            <div className="card">
                <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Search size={20} color="var(--score-green)" />
                    Core HTML SEO Profile
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <strong style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Page Title ({title?.length || 0} chars)</strong>
                        <p style={{ margin: 0, fontSize: '1.25rem', color: 'var(--text-primary)' }}>{title || 'Missing'}</p>
                    </div>

                    <div>
                        <strong style={{ display: 'block', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Meta Description ({description?.length || 0} chars)</strong>
                        <p style={{ margin: 0, color: 'var(--text-primary)' }}>{description || 'Missing meta description'}</p>
                    </div>

                    <div className="grid-3" style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                        <div>
                            <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Robots Rules</strong>
                            <span>{robots || 'Index, Follow (Default)'}</span>
                        </div>
                        <div>
                            <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Canonical Link</strong>
                            <span style={{ wordBreak: 'break-all' }}>{canonical || 'None specified'}</span>
                        </div>
                        <div>
                            <strong style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Schema Markup</strong>
                            <span style={{ color: has_schema_markup ? 'var(--score-green)' : 'var(--score-orange)' }}>
                                {has_schema_markup ? 'Detected (JSON-LD)' : 'Missing'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid-2" style={{ alignItems: 'start' }}>
                {/* Heading Geography */}
                <div className="card">
                    <h3 style={{ margin: '0 0 1.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <LayoutTemplate size={20} color="var(--accent-blue)" />
                        Heading Geography
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', padding: '1rem 0' }}>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '3rem', fontWeight: 700, color: headings.h1_count === 1 ? 'var(--score-green)' : 'var(--score-orange)' }}>
                                {headings.h1_count}
                            </span>
                            <span style={{ display: 'block', color: 'var(--text-secondary)' }}>H1 Tags</span>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <span style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                                {headings.h2_count}
                            </span>
                            <span style={{ display: 'block', color: 'var(--text-secondary)' }}>H2 Tags</span>
                        </div>
                    </div>
                </div>

                {/* OpenGraph Live Preview Block */}
                <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)' }}>
                        <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Share2 size={20} color="var(--accent-pink)" />
                            OpenGraph Social Card Preview
                        </h3>
                    </div>

                    {/* Simulated Twitter/Facebook Card render */}
                    <div style={{ backgroundColor: '#f3f4f6', padding: '2rem', display: 'flex', justifyContent: 'center' }}>
                        <div style={{
                            width: '100%', maxWidth: '400px', backgroundColor: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                        }}>
                            {open_graph.image ? (
                                <div style={{ width: '100%', height: '200px', backgroundImage: `url(${open_graph.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                            ) : (
                                <div style={{ width: '100%', height: '150px', backgroundColor: '#e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>No Image Provided</div>
                            )}
                            <div style={{ padding: '1rem' }}>
                                <p style={{ fontSize: '0.75rem', color: '#6b7280', margin: '0 0 0.5rem 0', textTransform: 'uppercase' }}>{open_graph.url ? new URL(open_graph.url).hostname : 'WEBSITE.COM'}</p>
                                <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#111827', lineHeight: 1.2 }}>{open_graph.title || title || 'Missing Title'}</h4>
                                <p style={{ margin: 0, fontSize: '0.875rem', color: '#4b5563', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                    {open_graph.description || description || 'Missing description metadata.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default SeoSocialCards;
