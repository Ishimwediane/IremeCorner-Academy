import React, { useState } from 'react';
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
import { Quiz } from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const MyQuizzes = ({ showHeader = true }) => {
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

    const quizzes = assessmentsData?.quizzes || [];

    // Filter logic assuming the API returns statuses or we derive them
    // For now, let's assume 'status' field or similar logic
    // Based on the 'upcomingTasks' logic in Dashboard.js, these seem to be incomplete/upcoming.
    // We might need to check if they are submitted to separate them.
    // For this implementation, I will list all and let status chips show state.



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
                        My Quizzes
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Track your quiz performance and upcoming tests.
                    </Typography>
                </Box>
            )}

            {/* 
      <Tabs 
        value={tabValue} 
        onChange={(e, val) => setTabValue(val)}
        sx={{ mb: 3, borderBottom: 1, borderColor: 'divider', '& .MuiTab-root': { textTransform: 'none' } }}
        TabIndicatorProps={{ style: { backgroundColor: '#C39766' } }}
      >
        <Tab label={`All (${quizzes.length})`} />
         Add more tabs if we can reliably filter
      </Tabs>
      */}

            {quizzes.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Quiz sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        No quizzes found.
                    </Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {quizzes.map((quiz) => (
                        <Grid item key={quiz._id || quiz.id} xs={12} md={6}>
                            <Card sx={{
                                borderRadius: '12px',
                                borderLeft: '5px solid',
                                borderColor: quiz.completed ? '#4caf50' : '#C39766'
                            }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            {quiz.course || 'Course Name'}
                                        </Typography>
                                        {quiz.dueDate && (
                                            <Chip
                                                label={`Due: ${new Date(quiz.dueDate).toLocaleDateString()}`}
                                                size="small"
                                                color={new Date(quiz.dueDate) < new Date() ? 'error' : 'default'}
                                                variant="outlined"
                                            />
                                        )}
                                    </Box>
                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                        {quiz.title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                                        <Typography variant="body2" color="text.secondary">
                                            {quiz.score !== undefined ? `Score: ${quiz.score}%` : 'Not taken yet'}
                                        </Typography>
                                        <Button
                                            variant="contained"
                                            size="small"
                                            onClick={() => navigate(`/learner/quiz/${quiz._id || quiz.id}`)}
                                            sx={{
                                                bgcolor: quiz.completed ? '#4caf50' : '#C39766',
                                                '&:hover': { bgcolor: quiz.completed ? '#43a047' : '#A67A52' }
                                            }}
                                        >
                                            {quiz.completed ? 'Review' : 'Start Quiz'}
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

export default MyQuizzes;
