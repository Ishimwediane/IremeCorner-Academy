import React from 'react';
import { Box, Paper } from '@mui/material';
import UserTable from './UserTable';

const AllStudents = () => {
  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        {/* Filter by role 'student' */}
        <UserTable roleFilter="student" title="Student" />
      </Paper>
    </Box>
  );
};

export default AllStudents;