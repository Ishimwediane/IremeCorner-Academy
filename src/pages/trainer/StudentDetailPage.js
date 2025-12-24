import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
    Box,
    Typography,
    Paper,
    Avatar,
    Chip,
    LinearProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    CircularProgress,
    IconButton,
    Button,
} from '@mui/material';
import { ArrowBack, CheckCircle, Cancel, Assignment as AssignmentIcon, Quiz as QuizIcon } from '@mui/icons-material';
import api from '../../utils/api';
import TrainerLayout from '../../components/TrainerLayout';
import { format } from 'date-fns';

const StudentDetailPage = () => {
    const { courseId, studentId } = useParams();
    const navigate = useNavigate();
    const [tab, setTab] = useState(0);

    // Fetch student enrollment data
    const { data: enrollmentData, isLoading: enrollmentLoading } = useQuery(
        ['student-enrollment', courseId, studentId],
        async () => {
            const res = await api.get(`/enrollments/course/${courseId}/students`);
            const enrollments = res.data.data;
            return enrollments.find(e => e.student._id === studentId);
        }
    );

    // Fetch course data with assignments and quizzes
    const { data: courseData, isLoading: courseLoading } = useQuery(
        ['course-detail', courseId],
        async () => {
            const [courseRes, assignmentsRes, quizzesRes] = await Promise.all([
                api.get(`/courses/${courseId}`),
                api.get(`/assignments/course/${courseId}`),
                api.get(`/quizzes/course/${courseId}`),
            ]);
            return {
                course: courseRes.data.data,
                assignments: assignmentsRes.data.data,
                quizzes: quizzesRes.data.data,
            };
        }
    );

    if (enrollmentLoading || courseLoading) {
        return (
            <TrainerLayout title="Loading...">
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                    <CircularProgress />
                </Box>
            </TrainerLayout>
        );
    }

    if (!enrollmentData || !courseData) {
        return (
            <TrainerLayout title="Error">
                <Typography>Student or course not found</Typography>
            </TrainerLayout>
        );
    }

    const student = enrollmentData.student;
    const { course, assignments, quizzes } = courseData;

    // Filter student's submissions and attempts
    const studentAssignments = assignments.map(assignment => ({
        ...assignment,
        submission: assignment.submissions?.find(s => s.student._id === studentId || s.student === studentId),
    }));

    const studentQuizzes = quizzes.map(quiz => ({
        ...quiz,
        attempts: quiz.attempts?.filter(a => a.student._id === studentId || a.student === studentId) || [],
    }));

    return (
        <TrainerLayout title={`Student Details: ${student.name}`}>
            {/* Header */}
            <Box sx={{ mb: 3 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate(`/trainer/course-content/${courseId}`)}
                    sx={{ mb: 2 }}
                >
                    Back to Course
                </Button>

                <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                        <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', fontSize: '2rem' }}>
                            {student.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                                {student.name}
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                                {student.email}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Chip
                                    label={enrollmentData.status}
                                    color={enrollmentData.status === 'completed' ? 'success' : 'primary'}
                                    sx={{ textTransform: 'capitalize' }}
                                />
                                <Typography variant="body2" color="text.secondary">
                                    Enrolled: {format(new Date(enrollmentData.enrolledAt), 'PPP')}
                                </Typography>
                            </Box>
                        </Box>
                        <Box sx={{ minWidth: 200 }}>
                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                Course Progress
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <LinearProgress
                                    variant="determinate"
                                    value={enrollmentData.progress || 0}
                                    sx={{ flex: 1, height: 10, borderRadius: 1 }}
                                />
                                <Typography variant="h6" fontWeight="bold">
                                    {enrollmentData.progress || 0}%
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Box>

            {/* Tabs */}
            <Paper sx={{ mb: 2 }}>
                <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
                    <Tab label="Overview" />
                    <Tab label={`Assignments (${studentAssignments.filter(a => a.submission).length})`} />
                    <Tab label={`Quizzes (${studentQuizzes.filter(q => q.attempts.length > 0).length})`} />
                </Tabs>
            </Paper>

            {/* Overview Tab */}
            {tab === 0 && (
                <Box>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                            Course: {course.title}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 4, mt: 2 }}>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Completed Lessons</Typography>
                                <Typography variant="h4">{enrollmentData.completedLessons?.length || 0}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Assignments Submitted</Typography>
                                <Typography variant="h4">{studentAssignments.filter(a => a.submission).length}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Quizzes Taken</Typography>
                                <Typography variant="h4">{studentQuizzes.filter(q => q.attempts.length > 0).length}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2" color="text.secondary">Average Quiz Score</Typography>
                                <Typography variant="h4">
                                    {studentQuizzes.filter(q => q.attempts.length > 0).length > 0
                                        ? Math.round(
                                            studentQuizzes
                                                .flatMap(q => q.attempts)
                                                .reduce((sum, a) => sum + a.percentage, 0) /
                                            studentQuizzes.flatMap(q => q.attempts).length
                                        )
                                        : 0}%
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>
                </Box>
            )}

            {/* Assignments Tab */}
            {tab === 1 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Assignment Submissions
                    </Typography>
                    {studentAssignments.filter(a => a.submission).length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <AssignmentIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No submissions yet
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Assignment</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Submitted</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Score</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Feedback</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {studentAssignments.filter(a => a.submission).map((assignment) => {
                                        const submission = assignment.submission;
                                        const isGraded = submission.score !== undefined && submission.score !== null;
                                        return (
                                            <TableRow key={assignment._id} hover>
                                                <TableCell>{assignment.title}</TableCell>
                                                <TableCell>
                                                    {format(new Date(submission.submittedAt), 'MMM dd, yyyy')}
                                                </TableCell>
                                                <TableCell>
                                                    {isGraded ? (
                                                        <Typography fontWeight="bold">
                                                            {submission.score}/{assignment.maxScore}
                                                        </Typography>
                                                    ) : (
                                                        '-'
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip
                                                        label={isGraded ? 'Graded' : 'Pending'}
                                                        color={isGraded ? 'success' : 'warning'}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    {submission.feedback || '-'}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            )}

            {/* Quizzes Tab */}
            {tab === 2 && (
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                        Quiz Attempts
                    </Typography>
                    {studentQuizzes.filter(q => q.attempts.length > 0).length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8 }}>
                            <QuizIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                                No quiz attempts yet
                            </Typography>
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Quiz</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Completed</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Score</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Percentage</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {studentQuizzes.filter(q => q.attempts.length > 0).map((quiz) =>
                                        quiz.attempts.map((attempt, index) => {
                                            const passed = attempt.percentage >= (quiz.passingPercent || 70);
                                            return (
                                                <TableRow key={`${quiz._id}-${index}`} hover>
                                                    <TableCell>{quiz.title}</TableCell>
                                                    <TableCell>
                                                        {format(new Date(attempt.completedAt), 'MMM dd, yyyy HH:mm')}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography fontWeight="bold">
                                                            {attempt.score}/{quiz.maxScore}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography fontWeight="bold" color={passed ? 'success.main' : 'error.main'}>
                                                            {attempt.percentage}%
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={passed ? 'Passed' : 'Failed'}
                                                            color={passed ? 'success' : 'error'}
                                                            size="small"
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            )}
        </TrainerLayout>
    );
};

export default StudentDetailPage;
