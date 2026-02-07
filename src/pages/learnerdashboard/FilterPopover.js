import React, { useState } from 'react';
import {
    Button,
    Popover,
    Box,
    Typography,
    Badge,
} from '@mui/material';
import { KeyboardArrowDown, FilterList } from '@mui/icons-material';

const FilterPopover = ({ title, activeCount, children }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'filter-popover' : undefined;

    return (
        <>
            <Badge
                badgeContent={activeCount}
                invisible={activeCount === 0}
                sx={{
                    '& .MuiBadge-badge': {
                        bgcolor: '#202F32',
                        color: '#fff',
                        fontSize: '0.6rem',
                        height: '16px',
                        minWidth: '16px',
                        padding: '0 4px',
                    }
                }}
            >
                <Button
                    aria-describedby={id}
                    variant={open || activeCount > 0 ? "contained" : "outlined"}
                    size="small"
                    onClick={handleClick}
                    endIcon={<KeyboardArrowDown fontSize="small" />}
                    sx={{
                        borderRadius: '20px',
                        textTransform: 'none',
                        borderColor: activeCount > 0 ? 'transparent' : 'rgba(32,47,50,0.2)',
                        bgcolor: open || activeCount > 0 ? '#202F32' : 'transparent',
                        color: open || activeCount > 0 ? '#fff' : '#202F32',
                        fontSize: '0.8125rem', // Smaller font size
                        py: 0.5,
                        '&:hover': {
                            bgcolor: open || activeCount > 0 ? '#1a2628' : 'rgba(32,47,50,0.05)',
                            borderColor: activeCount > 0 ? 'transparent' : '#202F32',
                        },
                        minWidth: 'auto',
                        px: 1.5,
                    }}
                >
                    {title}
                </Button>
            </Badge>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                }}
                PaperProps={{
                    sx: {
                        mt: 1,
                        p: 2,
                        borderRadius: '12px',
                        boxShadow: '0px 4px 20px rgba(0,0,0,0.1)',
                        minWidth: '250px',
                        maxWidth: '300px',
                    }
                }}
            >
                {children}
            </Popover>
        </>
    );
};

export default FilterPopover;
