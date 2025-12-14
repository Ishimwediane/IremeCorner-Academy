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
} from '@mui/material';
import api from '../../utils/api';

const AssignmentPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [submission, setSubmission] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Fetch the assignment data
  const { data: assignment, isLoading, isError } = useQuery(['assignment', assignmentId], async () => {
    const res = await api.get(`/assignments/${assignmentId}`);
    return res.data.data;
  });

  const {
    mutate: submitAssignment,
    isLoading: isSubmitting,
    isSuccess,
    isError: isSubmissionError,
    error: submissionError,
    data: submissionResult
  } = useMutation(
    (submissionData) => api.post(`/assignments/${assignmentId}/submit`, submissionData),
    {
      onSuccess: () => {
        setSubmitted(true);
        queryClient.invalidateQueries(['assignment', assignmentId]);
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    submitAssignment({ submission });
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Failed to load the assignment.</Alert>;
  }

  if (isSuccess) {
    return (
      <Container component={Paper} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>Assignment Submitted</Typography>
        <Alert severity="success">Your assignment has been submitted successfully.</Alert>
        <Box sx={{ mt: 3, p: 2, border: '1px solid #ccc', borderRadius: 1 }}>
            <Typography variant="h6">Your Submission:</Typography>
            <Typography>{submissionResult.data.data.submissions[submissionResult.data.data.submissions.length - 1].submission}</Typography>
        </Box>
        <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate(-1)}>
          Back to Lesson
        </Button>
      </Container>
    );
  }

  return (
    <Container component={Paper} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" gutterBottom>{assignment.title}</Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>{assignment.description}</Typography>
      
      {isSubmissionError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {submissionError.response?.data?.message || submissionError.message}
        </Alert>
      )}

      {assignment.questions && assignment.questions.length > 0 && (
        <Stack spacing={4}>
          {assignment.questions.map((q, index) => (
            <Box key={index}>
              <Typography fontWeight="bold">{index + 1}. {q.question}</Typography>
              {q.questionType === 'multiple-choice' && (
                <TextField
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                label="Your Answer"
                value={submission}
                onChange={(e) => setSubmission(e.target.value)}
                placeholder="Type your answer here..."
              />
              )}
            </Box>
          ))}
        </Stack>
      )}
      
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          multiline
          rows={8}
          variant="outlined"
          label="Your Submission"
          value={submission}
          onChange={(e) => setSubmission(e.target.value)}
          placeholder="Type your submission here..."
          sx={{ mt: 4 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={{ mt: 2 }}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'Submit Assignment'}
        </Button>
      </form>
    </Container>
  );
};

export default AssignmentPage;
