import React from 'react';
import { Box, Paper } from '@mui/material';
import UserTable from './UserTable';

const AllUsers = () => {
  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        {/* No roleFilter prop means it will fetch all users */}
        <UserTable title="User" />
      </Paper>
    </Box>
  );
};

export default AllUsers;