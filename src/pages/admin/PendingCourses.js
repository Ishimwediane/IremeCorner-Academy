import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Box,
  TextField,
  CircularProgress,
  Alert,
  Chip,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
  Paper,
  Button,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Visibility, CheckCircle, Cancel } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const PendingCourses = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  // Fetch only pending courses
  const { data: coursesData, isLoading, error } = useQuery(
    ['admin-pending-courses', { search }],
    async () => {
      const params = { search, status: 'pending' }; // Hardcode status filter
      const response = await api.get('/courses', { params });
      return response.data.data;
    },
    {
      keepPreviousData: true,
    }
  );

  const updateStatusMutation = useMutation(
    ({ id, status }) => api.put(`/courses/${id}/approve`, { status }),
    {
      onSuccess: (data, variables) => {
        toast.success(`Course has been ${variables.status}.`);
        queryClient.invalidateQueries('admin-pending-courses');
        queryClient.invalidateQueries('admin-courses'); // also invalidate all courses list
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update course status.');
      },
    }
  );

  const handleApprove = (id) => {
    if (window.confirm('Are you sure you want to approve this course?')) {
      updateStatusMutation.mutate({ id, status: 'approved' });
    }
  };

  const handleReject = (id) => {
    if (window.confirm('Are you sure you want to reject this course? This action cannot be undone.')) {
      updateStatusMutation.mutate({ id, status: 'rejected' });
    }
  };

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
          <Chip label={params.value} size="small" color="warning" />
        ),
      },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 180,
        sortable: false,
        renderCell: (params) => (
          <Box>
            <Tooltip title="View Course">
              <IconButton onClick={() => navigate(`/admin/courses/${params.id}`)} sx={{ color: '#FD7E14' }}>
                <Visibility />
              </IconButton>
            </Tooltip>
            <Tooltip title="Approve Course">
              <IconButton color="success" onClick={() => handleApprove(params.id)}>
                <CheckCircle />
              </IconButton>
            </Tooltip>
            <Tooltip title="Reject Course">
              <IconButton color="error" onClick={() => handleReject(params.id)}>
                <Cancel />
              </IconButton>
            </Tooltip>
          </Box>
        ),
      },
    ],
    [navigate]
  );

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', borderRadius: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
          <TextField
            label="Search Pending Courses"
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ minWidth: '300px' }}
          />
        </Box>
        <Box sx={{ height: 650, width: '100%' }}>
          {isLoading ? <CircularProgress /> : error ? <Alert severity="error">Failed to load courses.</Alert> :
            <DataGrid
              rows={coursesData || []}
              columns={columns}
              getRowId={(row) => row._id}
              loading={isLoading}
              rowHeight={70}
            />
          }
        </Box>
      </Paper>
    </Box>
  );
};

export default PendingCourses;