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
} from '@mui/material';
import api from '../../utils/api';

const QuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);

  // Fetch the quiz data
  const { data: quiz, isLoading, isError } = useQuery(['quiz', quizId], async () => {
    const res = await api.get(`/quizzes/${quizId}`);
    return res.data.data;
  });

  // Mutation for submitting the quiz
  const { mutate: submitQuiz, isLoading: isSubmitting, data: result } = useMutation(
    (studentAnswers) => api.post(`/quizzes/${quizId}/submit`, { answers: studentAnswers }),
    {
      onSuccess: () => {
        setShowResult(true);
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

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Failed to load the quiz.</Alert>;
  }

  if (showResult && result) {
    const { score, maxScore, percentage, answers: gradedAnswers } = result.data.data;
    return (
      <Container component={Paper} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>Quiz Result</Typography>
        <Typography variant="h6">Your Score: {score}/{maxScore} ({percentage}%)</Typography>
        <Stack spacing={2} mt={3}>
          {quiz.questions.map((q, index) => {
            const graded = gradedAnswers.find(a => a.questionIndex === index);
            const isCorrect = graded?.isCorrect;
            return (
              <Paper key={index} sx={{ p: 2, border: isCorrect ? '2px solid green' : '2px solid red' }}>
                <Typography fontWeight="bold">{q.question}</Typography>
                <Typography>Your answer: {q.options[graded?.selectedAnswer]}</Typography>
                {!isCorrect && <Typography>Correct answer: {q.options[q.correctAnswer]}</Typography>}
              </Paper>
            );
          })}
        </Stack>
        <Button variant="contained" sx={{ mt: 3 }} onClick={() => navigate(-1)}>
          Back to Lesson
        </Button>
      </Container>
    );
  }

  return (
    <Container component={Paper} sx={{ p: 4, mt: 4 }}>
      <Typography variant="h4" gutterBottom>{quiz.title}</Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>{quiz.description}</Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {quiz.questions.map((q, index) => (
            <FormControl component="fieldset" key={index}>
              <FormLabel component="legend" sx={{ fontWeight: 'bold', mb: 1 }}>{index + 1}. {q.question}</FormLabel>
              <RadioGroup
                aria-label={`question-${index}`}
                name={`question-${index}`}
                value={answers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
              >
                {q.options.map((option, i) => (
                  <FormControlLabel key={i} value={i.toString()} control={<Radio />} label={option} />
                ))}
              </RadioGroup>
            </FormControl>
          ))}
        </Stack>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={isSubmitting}
          sx={{ mt: 4 }}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'Submit Quiz'}
        </Button>
      </form>
    </Container>
  );
};

export default QuizPage;
