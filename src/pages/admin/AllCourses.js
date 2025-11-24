import React, { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Chip,
  Avatar,
  Typography,
  Paper,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const AllCourses = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const { data: coursesData, isLoading, error } = useQuery(
    ['admin-courses', { search }],
    async () => {
      const params = { search };
      const response = await api.get('/courses', { params });
      return response.data.data;
    },
    {
      keepPreviousData: true,
    }
  );

  const columns = useMemo(
    () => [
      {
        field: 'title',
        headerName: 'Course Title',
        flex: 1,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar src={params.row.thumbnail} variant="rounded">
              {params.row.title?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="body2" fontWeight="600">
                {params.row.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {params.row.category}
              </Typography>
            </Box>
          </Box>
        ),
      },
      {
        field: 'trainer',
        headerName: 'Trainer',
        width: 200,
        valueGetter: (params) => params.row?.trainer?.name || 'N/A',
      },
      {
        field: 'status',
        headerName: 'Status',
        width: 120,
        renderCell: (params) => (
          <Chip
            label={params.value}
            size="small"
            color={params.value === 'approved' ? 'success' : params.value === 'pending' ? 'warning' : 'default'}
          />
        ),
      },
      {
        field: 'enrolledStudents',
        headerName: 'Enrollments',
        width: 120,
        type: 'number',
        valueGetter: (params) => params.row?.enrolledStudents?.length || 0,
      },
    ],
    []
  );

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            label="Search Courses"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: '300px' }}
          />
          <Button variant="contained" startIcon={<Add />} onClick={() => navigate('/create-course')}>
            Create Course
          </Button>
        </Box>
        <Box sx={{ height: 650, width: '100%' }}>
          <DataGrid
            rows={coursesData || []}
            columns={columns}
            getRowId={(row) => row._id}
            onRowClick={(params) => navigate(`/admin/courses/${params.id}`)}
            loading={isLoading}
            rowHeight={70}
            sx={{
              '& .MuiDataGrid-cell': {
                borderBottom: '1px solid #e0e0e0',
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: '#f5f5f5',
                borderBottom: '2px solid #e0e0e0',
              },
              '& .MuiDataGrid-row': {
                cursor: 'pointer',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)'
                }
              },
            }}
          />
        </Box>
      </Paper>
    </Box>
  );
};

export default AllCourses;