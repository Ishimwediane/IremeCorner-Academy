import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  Container,
  Typography,
  Button,
  CircularProgress,
  Paper,
  Box,
  TextField,
  Stack,
  Alert,
  Chip,
  Divider,
} from '@mui/material';
import { CheckCircle, Schedule, Assignment as AssignmentIcon } from '@mui/icons-material';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const AssignmentPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [submission, setSubmission] = useState('');

  // Fetch the assignment data
  const { data: assignmentData, isLoading, isError } = useQuery(
    ['assignment', assignmentId],
    async () => {
      const res = await api.get(`/assignments/${assignmentId}`);
      const assignment = res.data.data;
      // Find user's submission
      const mySubmission = assignment.submissions?.find(
        s => s.student._id?.toString() === user._id.toString() || s.student.toString() === user._id.toString()
      );
      return { ...assignment, mySubmission };
    }
  );

  const assignment = assignmentData;

  const {
    mutate: submitAssignment,
    isLoading: isSubmitting,
    isSuccess,
    isError: isSubmissionError,
    error: submissionError,
  } = useMutation(
    (submissionData) => api.post(`/assignments/${assignmentId}/submit`, submissionData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['assignment', assignmentId]);
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    submitAssignment({ submission });
  };

  if (isLoading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (isError) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Failed to load the assignment.</Alert>
      </Container>
    );
  }

  // Show submission status if already submitted
  if (assignment.mySubmission) {
    const isGraded = assignment.mySubmission.score !== undefined && assignment.mySubmission.score !== null;
    const submittedDate = format(new Date(assignment.mySubmission.submittedAt), 'PPpp');

    return (
      <Container component={Paper} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h4">{assignment.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              Submitted on {submittedDate}
            </Typography>
          </Box>
        </Box>

        <Alert severity="success" sx={{ mb: 3 }}>
          <Typography variant="body1" fontWeight="bold">
            ✅ Assignment Submitted Successfully
          </Typography>
        </Alert>

        {/* Grading Status */}
        <Paper sx={{ p: 3, mb: 3, bgcolor: isGraded ? 'success.light' : 'warning.light' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            {isGraded ? (
              <CheckCircle sx={{ color: 'success.dark', fontSize: 32 }} />
            ) : (
              <Schedule sx={{ color: 'warning.dark', fontSize: 32 }} />
            )}
            <Typography variant="h6" sx={{ color: isGraded ? 'success.dark' : 'warning.dark' }}>
              {isGraded ? 'Graded' : 'Pending Review'}
            </Typography>
          </Box>

          {isGraded ? (
            <Box>
              <Typography variant="h4" sx={{ color: 'success.dark', fontWeight: 'bold', mb: 1 }}>
                {assignment.mySubmission.score}/{assignment.maxScore}
              </Typography>
              <Typography variant="body2" sx={{ color: 'success.dark' }}>
                Graded on {format(new Date(assignment.mySubmission.gradedAt), 'PPpp')}
              </Typography>
            </Box>
          ) : (
            <Typography variant="body2" sx={{ color: 'warning.dark' }}>
              Your assignment is waiting to be reviewed by the trainer.
            </Typography>
          )}
        </Paper>

        {/* Feedback Section */}
        {isGraded && assignment.mySubmission.feedback && (
          <Paper sx={{ p: 3, mb: 3, border: '2px solid', borderColor: 'primary.main' }}>
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Trainer Feedback
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
              {assignment.mySubmission.feedback}
            </Typography>
          </Paper>
        )}

        {/* Your Submission */}
        <Paper sx={{ p: 3, bgcolor: 'grey.50' }}>
          <Typography variant="h6" gutterBottom>
            Your Submission
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
            {assignment.mySubmission.submission}
          </Typography>
        </Paper>

        <Button variant="outlined" sx={{ mt: 3 }} onClick={() => navigate(-1)}>
          Back to Lesson
        </Button>
      </Container>
    );
  }

  // Show assignment details and submission form
  const isOverdue = assignment.dueDate && new Date(assignment.dueDate) < new Date();

  return (
    <Container component={Paper} sx={{ p: 4, mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <AssignmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="h4">{assignment.title}</Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
            <Chip label={`Max Score: ${assignment.maxScore}`} color="primary" size="small" />
            {assignment.dueDate && (
              <Chip
                label={`Due: ${format(new Date(assignment.dueDate), 'PPP')}`}
                color={isOverdue ? 'error' : 'default'}
                size="small"
              />
            )}
          </Box>
        </Box>
      </Box>

      {isOverdue && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          This assignment is overdue. Late submissions may receive reduced credit.
        </Alert>
      )}

      <Typography variant="body1" color="text.secondary" mb={3} sx={{ whiteSpace: 'pre-wrap' }}>
        {assignment.description}
      </Typography>

      <Divider sx={{ my: 3 }} />

      {isSubmissionError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submissionError.response?.data?.message || submissionError.message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          Your Submission
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={10}
          variant="outlined"
          label="Type your answer here"
          value={submission}
          onChange={(e) => setSubmission(e.target.value)}
          placeholder="Write your submission here..."
          required
          sx={{ mt: 2 }}
        />
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting || !submission.trim()}
            sx={{ minWidth: 150 }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : 'Submit Assignment'}
          </Button>
        </Box>
      </form>
    </Container>
  );
};

export default AssignmentPage;
