import React from 'react';
import { Box, Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import FilterGroup from './FilterGroup';
import {
    CATEGORIES,
    LEVELS,
    LANGUAGES,
    PRICES,
    DURATIONS,
    RATINGS,
    FORMATS,
    CERTIFICATIONS,
} from './constants';
import { useTranslation } from 'react-i18next';

const FilterPanel = ({ filters, counts, handleFilterChange }) => {
    const { t } = useTranslation();

    const filterSections = [
        { title: t('courses.filters.subject'), items: CATEGORIES, key: 'categories' },
        { title: t('courses.filters.level'), items: LEVELS, key: 'levels', showInfoIcon: true },
        { title: t('courses.filters.language'), items: LANGUAGES, key: 'languages', showInfoIcon: true },
        { title: t('courses.filters.price'), items: PRICES, key: 'prices' },
        { title: t('courses.filters.duration'), items: DURATIONS, key: 'durations' },
        { title: t('courses.filters.rating'), items: RATINGS, key: 'ratings' },
        { title: t('courses.filters.format'), items: FORMATS, key: 'formats' },
        { title: t('courses.filters.certification'), items: CERTIFICATIONS, key: 'certifications' },
    ];

    return (
        <Box sx={{ width: 320, maxHeight: '70vh', overflowY: 'auto' }}>
            {filterSections.map((section, index) => (
                <Accordion
                    key={section.key}
                    defaultExpanded={index === 0}
                    disableGutters
                    elevation={0}
                    sx={{
                        '&:before': { display: 'none' },
                        bgcolor: 'transparent',
                    }}
                >
                    <AccordionSummary
                        expandIcon={<ExpandMore />}
                        sx={{
                            minHeight: 40,
                            '&.Mui-expanded': { minHeight: 40 },
                            '& .MuiAccordionSummary-content': {
                                margin: '8px 0',
                                '&.Mui-expanded': { margin: '8px 0' },
                            },
                        }}
                    >
                        <Typography sx={{ fontSize: '0.9rem', fontWeight: 600, color: '#202F32' }}>
                            {section.title}
                            {filters[section.key]?.length > 0 && (
                                <Box
                                    component="span"
                                    sx={{
                                        ml: 1,
                                        px: 0.75,
                                        py: 0.25,
                                        bgcolor: '#202F32',
                                        color: '#fff',
                                        borderRadius: '10px',
                                        fontSize: '0.7rem',
                                        fontWeight: 600,
                                    }}
                                >
                                    {filters[section.key].length}
                                </Box>
                            )}
                        </Typography>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0, pb: 2 }}>
                        <FilterGroup
                            title=""
                            items={section.items}
                            selectedItems={filters[section.key]}
                            counts={counts[section.key]}
                            onFilterChange={(item) => handleFilterChange(section.key, item)}
                            showInfoIcon={section.showInfoIcon}
                        />
                    </AccordionDetails>
                </Accordion>
            ))}
        </Box>
    );
};

export default FilterPanel;
