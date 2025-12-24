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
    TextField,
    Stack,
    Alert,
} from '@mui/material';
import { Close, Edit, CheckCircle, Schedule } from '@mui/icons-material';
import { useMutation, useQueryClient } from 'react-query';
import api from '../../utils/api';
import { format } from 'date-fns';

const AssignmentGradingModal = ({ open, onClose, assignment }) => {
    const queryClient = useQueryClient();
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [score, setScore] = useState('');
    const [feedback, setFeedback] = useState('');

    const gradeMutation = useMutation(
        ({ assignmentId, submissionId, score, feedback }) =>
            api.put(`/assignments/${assignmentId}/grade`, {
                submissionId,
                score: parseFloat(score),
                feedback,
            }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries(['assignment', assignment._id]);
                queryClient.invalidateQueries(['assignments']);
                setSelectedSubmission(null);
                setScore('');
                setFeedback('');
            },
        }
    );

    const handleGradeClick = (submission) => {
        setSelectedSubmission(submission);
        setScore(submission.score?.toString() || '');
        setFeedback(submission.feedback || '');
    };

    const handleSubmitGrade = () => {
        if (!score || parseFloat(score) < 0 || parseFloat(score) > assignment.maxScore) {
            alert(`Score must be between 0 and ${assignment.maxScore}`);
            return;
        }

        gradeMutation.mutate({
            assignmentId: assignment._id,
            submissionId: selectedSubmission._id,
            score,
            feedback,
        });
    };

    const handleCancelGrading = () => {
        setSelectedSubmission(null);
        setScore('');
        setFeedback('');
    };

    if (!assignment) return null;

    const submissions = assignment.submissions || [];
    const gradedCount = submissions.filter(s => s.score !== undefined && s.score !== null).length;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
            <DialogTitle>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h6">Assignment Submissions: {assignment.title}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {gradedCount}/{submissions.length} Graded | Max Score: {assignment.maxScore}
                        </Typography>
                    </Box>
                    <IconButton onClick={onClose}>
                        <Close />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent dividers>
                {submissions.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary">
                            No submissions yet
                        </Typography>
                    </Box>
                ) : selectedSubmission ? (
                    // Grading View
                    <Box>
                        <Button
                            variant="outlined"
                            size="small"
                            onClick={handleCancelGrading}
                            sx={{ mb: 3 }}
                        >
                            ← Back to Submissions
                        </Button>

                        <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    {selectedSubmission.student?.name?.charAt(0).toUpperCase() || 'S'}
                                </Avatar>
                                <Box>
                                    <Typography variant="h6">{selectedSubmission.student?.name || 'Unknown'}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Submitted: {format(new Date(selectedSubmission.submittedAt), 'PPpp')}
                                    </Typography>
                                </Box>
                            </Box>

                            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                                Student's Submission:
                            </Typography>
                            <Paper sx={{ p: 2, bgcolor: 'white', border: '1px solid', borderColor: 'divider' }}>
                                <Typography sx={{ whiteSpace: 'pre-wrap' }}>
                                    {selectedSubmission.submission}
                                </Typography>
                            </Paper>
                        </Paper>

                        <Stack spacing={3}>
                            <TextField
                                label="Score"
                                type="number"
                                value={score}
                                onChange={(e) => setScore(e.target.value)}
                                inputProps={{ min: 0, max: assignment.maxScore, step: 0.5 }}
                                helperText={`Enter a score between 0 and ${assignment.maxScore}`}
                                fullWidth
                                required
                            />

                            <TextField
                                label="Feedback"
                                multiline
                                rows={6}
                                value={feedback}
                                onChange={(e) => setFeedback(e.target.value)}
                                placeholder="Provide feedback to the student..."
                                fullWidth
                            />

                            {gradeMutation.isError && (
                                <Alert severity="error">
                                    {gradeMutation.error?.response?.data?.message || 'Failed to submit grade'}
                                </Alert>
                            )}

                            {gradeMutation.isSuccess && (
                                <Alert severity="success">Grade submitted successfully!</Alert>
                            )}

                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button variant="outlined" onClick={handleCancelGrading}>
                                    Cancel
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={handleSubmitGrade}
                                    disabled={gradeMutation.isLoading || !score}
                                >
                                    {gradeMutation.isLoading ? 'Submitting...' : 'Submit Grade'}
                                </Button>
                            </Box>
                        </Stack>
                    </Box>
                ) : (
                    // Submissions List View
                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'grey.100' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Student</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Submitted At</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Score</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {submissions.map((submission) => {
                                    const isGraded = submission.score !== undefined && submission.score !== null;

                                    return (
                                        <TableRow key={submission._id} hover>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                    <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                                                        {submission.student?.name?.charAt(0).toUpperCase() || 'S'}
                                                    </Avatar>
                                                    <Typography>{submission.student?.name || 'Unknown'}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {format(new Date(submission.submittedAt), 'PPp')}
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
                                                    icon={isGraded ? <CheckCircle /> : <Schedule />}
                                                    label={isGraded ? 'Graded' : 'Pending'}
                                                    color={isGraded ? 'success' : 'warning'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outlined"
                                                    size="small"
                                                    startIcon={<Edit />}
                                                    onClick={() => handleGradeClick(submission)}
                                                >
                                                    {isGraded ? 'Edit Grade' : 'Grade'}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
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

export default AssignmentGradingModal;
