import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Avatar,
    Chip,
    LinearProgress,
    CircularProgress,
    TextField,
    InputAdornment,
} from '@mui/material';
import { Search, Person } from '@mui/icons-material';
import api from '../../utils/api';
import { format } from 'date-fns';

const StudentsTab = ({ courseId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const { data: enrollmentsData, isLoading } = useQuery(
        ['course-students', courseId],
        async () => {
            const res = await api.get(`/enrollments/course/${courseId}/students`);
            return res.data.data;
        }
    );

    const enrollments = enrollmentsData || [];

    // Filter students based on search term
    const filteredEnrollments = enrollments.filter(enrollment =>
        enrollment.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enrollment.student?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed':
                return 'success';
            case 'in-progress':
                return 'primary';
            case 'enrolled':
                return 'default';
            case 'dropped':
                return 'error';
            default:
                return 'default';
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Enrolled Students ({enrollments.length})
                </Typography>
                <TextField
                    size="small"
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: 300 }}
                />
            </Box>

            {filteredEnrollments.length === 0 ? (
                <Paper sx={{ p: 8, textAlign: 'center' }}>
                    <Person sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        {searchTerm ? 'No students found' : 'No students enrolled yet'}
                    </Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'grey.100' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Student</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Progress</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Enrolled Date</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Completed Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredEnrollments.map((enrollment) => (
                                <TableRow
                                    key={enrollment._id}
                                    hover
                                    sx={{ '&:hover': { bgcolor: 'action.hover', cursor: 'pointer' } }}
                                    onClick={() => navigate(`/trainer/course-content/${courseId}/student/${enrollment.student._id}`)}
                                >
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                {enrollment.student?.name?.charAt(0).toUpperCase() || 'S'}
                                            </Avatar>
                                            <Typography fontWeight="medium">
                                                {enrollment.student?.name || 'Unknown Student'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{enrollment.student?.email || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 150 }}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={enrollment.progress || 0}
                                                sx={{ flex: 1, height: 8, borderRadius: 1 }}
                                            />
                                            <Typography variant="body2" fontWeight="medium">
                                                {enrollment.progress || 0}%
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={enrollment.status}
                                            color={getStatusColor(enrollment.status)}
                                            size="small"
                                            sx={{ textTransform: 'capitalize' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {enrollment.enrolledAt
                                            ? format(new Date(enrollment.enrolledAt), 'PPP')
                                            : 'N/A'}
                                    </TableCell>
                                    <TableCell>
                                        {enrollment.completedAt
                                            ? format(new Date(enrollment.completedAt), 'PPP')
                                            : '-'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default StudentsTab;
