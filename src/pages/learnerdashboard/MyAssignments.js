import React from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    Button,
    Box,
    CircularProgress,
    Chip,
} from '@mui/material';
import { Assignment, AccessTime, CheckCircle } from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const MyAssignments = ({ showHeader = true }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const { data: assessmentsData, isLoading } = useQuery(
        ['my-assessments', user?._id],
        async () => {
            const response = await api.get(`/assessments/student/${user._id}`);
            return response.data.data;
        },
        { enabled: !!user?._id }
    );

    const assignments = assessmentsData?.assignments || [];

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress sx={{ color: '#C39766' }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 2 }}>
            {showHeader && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: '#202F32' }}>
                        My Assignments
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your homework and project submissions.
                    </Typography>
                </Box>
            )}

            {assignments.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Assignment sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        No assignments found.
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {assignments.map((assignment) => (
                        <Grid item key={assignment._id || assignment.id} xs={12} md={6}>
                            <Card sx={{
                                borderRadius: '12px',
                                borderLeft: '5px solid',
                                borderColor: assignment.submitted ? '#4caf50' : '#4A90E2'
                            }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            {assignment.course || 'Course Name'}
                                        </Typography>
                                        {assignment.dueDate && (
                                            <Chip
                                                label={`Due: ${new Date(assignment.dueDate).toLocaleDateString()}`}
                                                size="small"
                                                color={!assignment.submitted && new Date(assignment.dueDate) < new Date() ? 'error' : 'default'}
                                                variant="outlined"
                                            />
                                        )}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                        {assignment.title}
                                    </Typography>

                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            {assignment.submitted ? (
                                                <Chip label="Submitted" color="success" size="small" icon={<CheckCircle />} />
                                            ) : (
                                                <Chip label="Pending" color="warning" size="small" icon={<AccessTime />} />
                                            )}
                                        </Box>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => navigate(`/learner/assignment/${assignment._id || assignment.id}`)}
                                            sx={{
                                                color: assignment.submitted ? '#4caf50' : '#4A90E2',
                                                borderColor: assignment.submitted ? '#4caf50' : '#4A90E2'
                                            }}
                                        >
                                            {assignment.submitted ? 'View Submission' : 'View Details'}
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default MyAssignments;
