import React from 'react';
import { Box, Paper } from '@mui/material';
import UserTable from './UserTable';

const AllTrainers = () => {
  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        {/* Filter by role 'trainer' */}
        <UserTable roleFilter="trainer" title="Trainer" />
      </Paper>
    </Box>
  );
};

export default AllTrainers;