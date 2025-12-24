import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    Avatar,
    Chip,
    IconButton,
    Collapse,
    Stack,
} from '@mui/material';
import { Close, ExpandMore, ExpandLess, CheckCircle, Cancel } from '@mui/icons-material';
import { format } from 'date-fns';

const QuizResultsModal = ({ open, onClose, quiz }) => {
    const [expandedAttempt, setExpandedAttempt] = useState(null);

    if (!quiz) return null;

    const attempts = quiz.attempts || [];

    // Group attempts by student
    const attemptsByStudent = attempts.reduce((acc, attempt) => {
        const studentId = attempt.student._id || attempt.student;
        if (!acc[studentId]) {
            acc[studentId] = [];
        }
        acc[studentId].push(attempt);
        return acc;
    }, {});

    const handleExpandClick = (attemptId) => {
        setExpandedAttempt(expandedAttempt === attemptId ? null : attemptId);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Quiz Results: {quiz.title}</Typography>
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                <Box sx={{ mb: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                        Total Attempts: {attempts.length} | Max Score: {quiz.maxScore} | Passing: {quiz.passingPercent || 70}%
                    </Typography>
                </Box>

                {attempts.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary">
                            No attempts yet
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'grey.100' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Student</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Score</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Percentage</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Completed At</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Details</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {attempts.map((attempt, index) => {
                                    const passed = attempt.percentage >= (quiz.passingPercent || 70);
                                    const isExpanded = expandedAttempt === attempt._id;

                                    return (
                                        <React.Fragment key={attempt._id || index}>
                                            <TableRow hover>
                                                <TableCell>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                                                            {attempt.student?.name?.charAt(0).toUpperCase() || 'S'}
                                                        </Avatar>
                                                        <Typography>{attempt.student?.name || 'Unknown'}</Typography>
                                                    </Box>
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
                                                <TableCell>
                                                    {format(new Date(attempt.completedAt), 'PPp')}
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => handleExpandClick(attempt._id)}
                                                    >
                                                        {isExpanded ? <ExpandLess /> : <ExpandMore />}
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell colSpan={6} sx={{ p: 0 }}>
                                                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                                        <Box sx={{ p: 3, bgcolor: 'grey.50' }}>
                                                            <Typography variant="h6" gutterBottom>
                                                                Answer Details
                                                            </Typography>
                                                            <Stack spacing={2}>
                                                                {quiz.questions.map((question, qIndex) => {
                                                                    const answer = attempt.answers.find(a => a.questionIndex === qIndex);
                                                                    const isCorrect = answer?.isCorrect;
                                                                    return (
                                                                        <Paper key={qIndex} sx={{ p: 2, border: `2px solid ${isCorrect ? '#4caf50' : '#f44336'}` }}>
                                                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                                                                                {isCorrect ? (
                                                                                    <CheckCircle sx={{ color: 'success.main', mt: 0.5 }} />
                                                                                ) : (
                                                                                    <Cancel sx={{ color: 'error.main', mt: 0.5 }} />
                                                                                )}
                                                                                <Box sx={{ flex: 1 }}>
                                                                                    <Typography fontWeight="bold" gutterBottom>
                                                                                        {qIndex + 1}. {question.question}
                                                                                    </Typography>
                                                                                    <Typography color={isCorrect ? 'success.dark' : 'error.dark'}>
                                                                                        Student's answer: {question.options[answer?.selectedAnswer]}
                                                                                    </Typography>
                                                                                    {!isCorrect && (
                                                                                        <Typography color="success.dark" fontWeight="bold">
                                                                                            Correct answer: {question.options[question.correctAnswer]}
                                                                                        </Typography>
                                                                                    )}
                                                                                </Box>
                                                                            </Box>
                                                                        </Paper>
                                                                    );
                                                                })}
                                                            </Stack>
                                                        </Box>
                                                    </Collapse>
                                                </TableCell>
                                            </TableRow>
                                        </React.Fragment>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default QuizResultsModal;
