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
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Stack,
  Alert,
  Divider,
  Chip,
} from '@mui/material';
import { CheckCircle, Cancel, Refresh, Timer, EmojiEvents } from '@mui/icons-material';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [isRetaking, setIsRetaking] = useState(false);

  // Fetch the quiz data
  const { data: quiz, isLoading, isError } = useQuery(['quiz', quizId], async () => {
    const res = await api.get(`/quizzes/${quizId}`);
    return res.data.data;
  });

  // Find user's previous attempts
  const myAttempts = quiz?.attempts?.filter(a => a.student.toString() === user._id.toString()) || [];
  const lastAttempt = myAttempts.length > 0 ? myAttempts[myAttempts.length - 1] : null;
  const hasAttempted = myAttempts.length > 0 && !isRetaking;

  // Mutation for submitting the quiz
  const { mutate: submitQuiz, isLoading: isSubmitting, data: result } = useMutation(
    (studentAnswers) => api.post(`/quizzes/${quizId}/submit`, { answers: studentAnswers }),
    {
      onSuccess: () => {
        setShowResult(true);
        setIsRetaking(false);
        queryClient.invalidateQueries(['quiz', quizId]);
      },
    }
  );

  const handleAnswerChange = (questionIndex, selectedOption) => {
    setAnswers({
      ...answers,
      [questionIndex]: selectedOption,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formattedAnswers = Object.entries(answers).map(([questionIndex, selectedAnswer]) => ({
      questionIndex: parseInt(questionIndex, 10),
      selectedAnswer: parseInt(selectedAnswer, 10),
    }));
    submitQuiz(formattedAnswers);
  };

  const handleRetake = () => {
    setIsRetaking(true);
    setAnswers({});
    setShowResult(false);
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
        <Alert severity="error">Failed to load the quiz.</Alert>
      </Container>
    );
  }

  // Show result after submission
  if (showResult && result) {
    const { score, maxScore, percentage, answers: gradedAnswers } = result.data.data;
    const passed = percentage >= (quiz.passingPercent || 70);

    return (
      <Container component={Paper} sx={{ p: 4, mt: 4, maxWidth: 900 }}>
        <Typography variant="h4" gutterBottom>Quiz Result</Typography>
        <Box sx={{ mb: 3, p: 3, bgcolor: passed ? 'success.light' : 'error.light', borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: passed ? 'success.dark' : 'error.dark' }}>
            {passed ? '🎉 Passed!' : '❌ Not Passed'}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Your Score: {score}/{maxScore} ({percentage}%)
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Passing Score: {quiz.passingPercent || 70}%
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Review Your Answers:</Typography>
        <Stack spacing={2} mt={2}>
          {quiz.questions.map((q, index) => {
            const graded = gradedAnswers.find(a => a.questionIndex === index);
            const isCorrect = graded?.isCorrect;
            return (
              <Paper key={index} sx={{ p: 2, border: `2px solid ${isCorrect ? '#4caf50' : '#f44336'}` }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                  {isCorrect ? (
                    <CheckCircle sx={{ color: 'success.main', mt: 0.5 }} />
                  ) : (
                    <Cancel sx={{ color: 'error.main', mt: 0.5 }} />
                  )}
                  <Typography fontWeight="bold">{index + 1}. {q.question} ({q.points || 1} points)</Typography>
                </Box>
                <Typography sx={{ ml: 4, color: isCorrect ? 'success.dark' : 'error.dark' }}>
                  Your answer: {q.options[graded?.selectedAnswer]}
                </Typography>
                {!isCorrect && (
                  <Typography sx={{ ml: 4, color: 'success.dark', fontWeight: 'bold' }}>
                    Correct answer: {q.options[q.correctAnswer]}
                  </Typography>
                )}
              </Paper>
            );
          })}
        </Stack>
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back to Lesson
          </Button>
          <Button variant="contained" startIcon={<Refresh />} onClick={handleRetake}>
            Retake Quiz
          </Button>
        </Box>
      </Container>
    );
  }

  // Show previous attempt review if user has already taken the quiz
  if (hasAttempted && lastAttempt) {
    const passed = lastAttempt.percentage >= (quiz.passingPercent || 70);

    return (
      <Container component={Paper} sx={{ p: 4, mt: 4, maxWidth: 900 }}>
        <Typography variant="h4" gutterBottom>{quiz.title}</Typography>
        <Alert severity="info" sx={{ mb: 3 }}>
          You have already completed this quiz on {format(new Date(lastAttempt.completedAt), 'PPpp')}
        </Alert>

        <Box sx={{ mb: 3, p: 3, bgcolor: passed ? 'success.light' : 'error.light', borderRadius: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: passed ? 'success.dark' : 'error.dark' }}>
            {passed ? '🎉 Passed!' : '❌ Not Passed'}
          </Typography>
          <Typography variant="h6" sx={{ mt: 1 }}>
            Your Score: {lastAttempt.score}/{quiz.maxScore} ({lastAttempt.percentage}%)
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            Passing Score: {quiz.passingPercent || 70}%
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>Review Your Answers:</Typography>
        <Stack spacing={2} mt={2}>
          {quiz.questions.map((q, index) => {
            const answer = lastAttempt.answers.find(a => a.questionIndex === index);
            const isCorrect = answer?.isCorrect;
            return (
              <Paper key={index} sx={{ p: 2, border: `2px solid ${isCorrect ? '#4caf50' : '#f44336'}` }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1 }}>
                  {isCorrect ? (
                    <CheckCircle sx={{ color: 'success.main', mt: 0.5 }} />
                  ) : (
                    <Cancel sx={{ color: 'error.main', mt: 0.5 }} />
                  )}
                  <Typography fontWeight="bold">{index + 1}. {q.question} ({q.points || 1} points)</Typography>
                </Box>
                <Typography sx={{ ml: 4, color: isCorrect ? 'success.dark' : 'error.dark' }}>
                  Your answer: {q.options[answer?.selectedAnswer]}
                </Typography>
                {!isCorrect && (
                  <Typography sx={{ ml: 4, color: 'success.dark', fontWeight: 'bold' }}>
                    Correct answer: {q.options[q.correctAnswer]}
                  </Typography>
                )}
              </Paper>
            );
          })}
        </Stack>
        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => navigate(-1)}>
            Back to Lesson
          </Button>
          <Button variant="contained" startIcon={<Refresh />} onClick={handleRetake}>
            Retake Quiz
          </Button>
        </Box>
      </Container>
    );
  }

  // Show quiz taking form with beautiful header
  return (
    <Container sx={{ py: 4, maxWidth: 900 }}>
      <Paper sx={{ p: 4 }}>
        {/* Quiz Header */}
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#202F32' }}>
          {quiz.title}
        </Typography>

        {quiz.description && (
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {quiz.description}
          </Typography>
        )}

        {/* Info Chips */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 4, flexWrap: 'wrap' }}>
          <Chip
            label={`${quiz.questions.length} Questions`}
            sx={{ bgcolor: '#f5f5f5', fontWeight: 500 }}
          />
          <Chip
            label={`Max Score: ${quiz.maxScore}`}
            sx={{ bgcolor: '#f5f5f5', fontWeight: 500 }}
          />
          <Chip
            label={`Passing: ${quiz.passingPercent || 70}%`}
            icon={<EmojiEvents />}
            sx={{ bgcolor: '#1a1a1a', color: 'white', fontWeight: 500 }}
          />
          {quiz.timeLimit && (
            <Chip
              label={`Time: ${quiz.timeLimit} min`}
              icon={<Timer />}
              sx={{ bgcolor: '#d4a574', color: 'white', fontWeight: 500 }}
            />
          )}
        </Box>

        <Divider sx={{ mb: 4 }} />

        {/* Questions */}
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            {quiz.questions.map((q, index) => (
              <Box key={index}>
                <FormControl component="fieldset" fullWidth>
                  <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 2, color: '#202F32', fontSize: '1rem' }}>
                    {index + 1}. {q.question} {q.points > 1 && `(${q.points} points)`}
                  </FormLabel>
                  <RadioGroup
                    aria-label={`question-${index}`}
                    name={`question-${index}`}
                    value={answers[index] || ''}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                  >
                    {q.options.map((option, i) => (
                      <FormControlLabel
                        key={i}
                        value={i.toString()}
                        control={<Radio />}
                        label={option}
                        sx={{
                          mb: 0.5,
                          '& .MuiFormControlLabel-label': {
                            fontSize: '0.95rem'
                          }
                        }}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </Box>
            ))}
          </Stack>

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting || Object.keys(answers).length < quiz.questions.length}
              sx={{ minWidth: 150 }}
            >
              {isSubmitting ? <CircularProgress size={24} /> : 'Submit Quiz'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default QuizPage;
