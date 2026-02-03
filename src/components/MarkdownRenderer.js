import React from 'react';
import { Box, Typography } from '@mui/material';

const MarkdownRenderer = ({ content }) => {
    console.log('🎨 MarkdownRenderer called with content length:', content?.length);

    if (!content) {
        console.log('⚠️ No content provided to MarkdownRenderer');
        return null;
    }

    const lines = content.split('\n');
    console.log('📝 Number of lines to render:', lines.length);

    return (
        <Box>
            {lines.map((line, index) => {
                // Match markdown image: ![alt](url)
                const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
                if (imageMatch) {
                    const [, alt, src] = imageMatch;
                    console.log(`🖼️ Image found at line ${index}:`, alt, '→', src.trim());
                    return (
                        <Box key={index} sx={{ my: 3, textAlign: 'center' }}>
                            <img
                                src={src.trim()}
                                alt={alt || 'Screenshot'}
                                style={{
                                    maxWidth: '100%',
                                    height: 'auto',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                }}
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                }}
                            />
                            {alt && (
                                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'text.secondary' }}>
                                    {alt}
                                </Typography>
                            )}
                        </Box>
                    );
                }

                // Match bold text: **text**
                if (line.match(/^\*\*(.+)\*\*$/)) {
                    const text = line.replace(/^\*\*(.+)\*\*$/, '$1');
                    return (
                        <Typography key={index} variant="h6" sx={{ mt: 3, mb: 1.5, fontWeight: 600, color: '#202F32' }}>
                            {text}
                        </Typography>
                    );
                }

                // Match bullet points: - text
                if (line.trim().match(/^-\s+(.+)$/)) {
                    const text = line.trim().replace(/^-\s+(.+)$/, '$1');
                    return (
                        <Typography key={index} variant="body1" sx={{ ml: 3, mb: 0.5, display: 'flex', alignItems: 'start' }}>
                            <span style={{ marginRight: '8px' }}>•</span>
                            <span>{text}</span>
                        </Typography>
                    );
                }

                // Match numbered lists: 1. text
                if (line.trim().match(/^\d+\.\s+(.+)$/)) {
                    return (
                        <Typography key={index} variant="body1" sx={{ ml: 2, mb: 1 }}>
                            {line.trim()}
                        </Typography>
                    );
                }

                // Empty line
                if (line.trim() === '') {
                    return <Box key={index} sx={{ height: 12 }} />;
                }

                // Regular text
                return (
                    <Typography key={index} variant="body1" sx={{ mb: 1, lineHeight: 1.7 }}>
                        {line}
                    </Typography>
                );
            })}
        </Box>
    );
};

export default MarkdownRenderer;
