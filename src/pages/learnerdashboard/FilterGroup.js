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
        <Typography sx={{ color: '#202F32', fontWeight: 700, fontSize: '1rem' }}>
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
                sx={{ color: '#202F32', '&.Mui-checked': { color: '#C39766' } }}
              />
            }
            label={
              <Typography sx={{ color: '#202F32', fontSize: '0.95rem' }}>
                {item} <Box component="span" sx={{ color: 'rgba(32,47,50,0.6)', ml: 0.5 }}>({counts[item] || 0})</Box>
              </Typography>
            }
            sx={{ mb: 1 }}
          />
        ))}
      </FormGroup>
      {items.length > initialVisible && (
        <MuiLink
          component="button"
          onClick={() => setShowMore(!showMore)}
          sx={{
            color: '#C39766',
            textDecoration: 'underline',
            fontSize: '0.9rem',
            mt: 1,
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            '&:hover': { color: '#A67A52' },
          }}
        >
          {showMore ? 'Show less' : 'Show more'}
        </MuiLink>
      )}
    </Box>
  );
};

export default FilterGroup;