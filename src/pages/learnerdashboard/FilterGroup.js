import React, { useState } from 'react';
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Link as MuiLink,
} from '@mui/material';
import { Info } from '@mui/icons-material';

const FilterGroup = ({ title, items, selectedItems, counts, onFilterChange, showInfoIcon, initialVisible = 4 }) => {
  const [showMore, setShowMore] = useState(false);
  const visibleItems = showMore ? items : items.slice(0, initialVisible);

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 2 }}>
        <Typography sx={{ color: '#202F32', fontWeight: 700, fontSize: '0.9rem' }}>
          {title}
        </Typography>
        {showInfoIcon && <Info sx={{ fontSize: 16, color: 'rgba(32,47,50,0.5)' }} />}
      </Box>
      <FormGroup>
        {visibleItems.map((item) => (
          <FormControlLabel
            key={item}
            control={
              <Checkbox
                checked={selectedItems.includes(item)}
                onChange={() => onFilterChange(item)}
                size="small"
                sx={{
                  color: 'rgba(32,47,50,0.6)',
                  p: 0.5,
                  '&.Mui-checked': { color: '#202F32' }
                }}
              />
            }
            label={
              <Typography sx={{ color: '#202F32', fontSize: '0.85rem' }}>
                {item} <Box component="span" sx={{ color: 'rgba(32,47,50,0.6)', ml: 0.5 }}>({counts[item] || 0})</Box>
              </Typography>
            }
            sx={{ mb: 0.5, ml: 0 }}
          />
        ))}
      </FormGroup>
      {items.length > initialVisible && (
        <MuiLink
          component="button"
          onClick={() => setShowMore(!showMore)}
          sx={{
            color: 'rgba(32,47,50,0.7)',
            textDecoration: 'none',
            fontSize: '0.8rem',
            mt: 1,
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            fontWeight: 500,
            '&:hover': { color: '#202F32', textDecoration: 'underline' },
          }}
        >
          {showMore ? 'Show less' : 'Show more'}
        </MuiLink>
      )}
    </Box>
  );
};

export default FilterGroup;