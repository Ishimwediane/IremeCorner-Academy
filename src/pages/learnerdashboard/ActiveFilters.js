import React from 'react';
import { Box, Chip, Stack } from '@mui/material';

const ActiveFilters = ({ filters, onRemoveFilter, onClearAll }) => {
    const getActiveFilters = () => {
        const active = [];

        // Helper to add filters with category label
        const addFilters = (category, items, label) => {
            items.forEach(item => {
                active.push({ category, value: item, label: `${label}: ${item}` });
            });
        };

        addFilters('categories', filters.categories, 'Subject');
        addFilters('levels', filters.levels, 'Level');
        addFilters('languages', filters.languages, 'Language');
        addFilters('prices', filters.prices, 'Price');
        addFilters('durations', filters.durations, 'Duration');
        addFilters('ratings', filters.ratings, 'Rating');
        addFilters('formats', filters.formats, 'Format');
        addFilters('certifications', filters.certifications, 'Certification');

        return active;
    };

    const activeFilters = getActiveFilters();

    if (activeFilters.length === 0) {
        return null;
    }

    return (
        <Box sx={{ mb: 3 }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {activeFilters.map((filter, index) => (
                    <Chip
                        key={`${filter.category}-${filter.value}-${index}`}
                        label={filter.label}
                        onDelete={() => onRemoveFilter(filter.category, filter.value)}
                        size="small"
                        sx={{
                            bgcolor: 'rgba(32,47,50,0.08)',
                            color: '#202F32',
                            fontSize: '0.8125rem',
                            '& .MuiChip-deleteIcon': {
                                color: 'rgba(32,47,50,0.6)',
                                fontSize: '16px',
                                '&:hover': {
                                    color: '#202F32',
                                },
                            },
                        }}
                    />
                ))}
                {activeFilters.length > 0 && (
                    <Chip
                        label="Clear all"
                        onClick={onClearAll}
                        size="small"
                        variant="outlined"
                        sx={{
                            borderColor: 'rgba(32,47,50,0.3)',
                            color: 'rgba(32,47,50,0.7)',
                            fontSize: '0.8125rem',
                            '&:hover': {
                                borderColor: '#202F32',
                                bgcolor: 'rgba(32,47,50,0.05)',
                            },
                        }}
                    />
                )}
            </Stack>
        </Box>
    );
};

export default ActiveFilters;
