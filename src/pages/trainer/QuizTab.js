import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField, // Keep TextField for form inputs
  IconButton,
  MenuItem, // Import MenuItem
  Tabs,
  Tab,
  ButtonGroup, // Added for PlannerHeader
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { format, addDays, eachDayOfInterval, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import { useEffect } from 'react'; // Import useEffect
import api from '../../utils/api';

const CreateQuizDialog = ({ open, onClose, onSaved, courseId, course }) => {
  const [form, setForm] = useState({
    title: '',
    lesson: '',
    availableOn: '',
    questions: [{ question: '', options: ['', ''], correctAnswer: 0, points: 10 }],
  });

  useEffect(() => {
    if (open) {
      setForm({
        title: '',
        lesson: '',
        availableOn: '',
        questions: [{ question: '', options: ['', ''], correctAnswer: 0, points: 10 }],
      });
    }
  }, [open, courseId]);

  const handleQuestionChange = (qIndex, field, value) => {
    const newQuestions = [...form.questions];
    newQuestions[qIndex][field] = value;
    setForm({ ...form, questions: newQuestions });
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...form.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setForm({ ...form, questions: newQuestions });
  };

  const addQuestion = () => {
    setForm({
      ...form,
      questions: [...form.questions, { question: '', options: ['', ''], correctAnswer: 0, points: 10 }],
    });
  };

  const removeQuestion = (qIndex) => {
    if (form.questions.length <= 1) return; // Must have at least one question
    const newQuestions = form.questions.filter((_, index) => index !== qIndex);
    setForm({ ...form, questions: newQuestions });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Quiz</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField fullWidth label="Quiz Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth select label="Link to Lesson (Optional)" value={form.lesson} onChange={(e) => setForm({ ...form, lesson: e.target.value })}>
              <MenuItem value=""><em>None</em></MenuItem>
              {course?.lessons?.map(lesson => (
                <MenuItem key={lesson._id} value={lesson._id}>{lesson.title}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="date" label="Available On" InputLabelProps={{ shrink: true }} value={form.availableOn} onChange={(e) => setForm({ ...form, availableOn: e.target.value })} />
          </Grid>

          {form.questions.map((q, qIndex) => (
            <Grid item xs={12} key={qIndex} component={Paper} variant="outlined" sx={{ p: 2, mt: 2, position: 'relative' }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>Question {qIndex + 1}</Typography>
              {form.questions.length > 1 && (
                <IconButton onClick={() => removeQuestion(qIndex)} size="small" sx={{ position: 'absolute', top: 8, right: 8 }}><DeleteIcon color="error" /></IconButton>
              )}
              <TextField fullWidth label="Question Text" value={q.question} onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)} sx={{ mb: 1 }} />
              {q.options.map((opt, oIndex) => (
                <TextField key={oIndex} fullWidth label={`Option ${oIndex + 1}`} value={opt} onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} sx={{ mb: 1 }} />
              ))}
              <TextField
                fullWidth
                select
                label="Correct Answer"
                value={q.correctAnswer}
                onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', Number(e.target.value))}
              >
                {q.options.map((opt, oIndex) => (
                  <MenuItem key={oIndex} value={oIndex}>Option {oIndex + 1}</MenuItem>
                ))}
              </TextField>
            </Grid>
          ))}

          <Grid item xs={12}><Button onClick={addQuestion} startIcon={<AddIcon />}>Add Another Question</Button></Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => onSaved(form)} variant="contained" sx={{ bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' } }}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

const PlannerHeader = ({ startDate, setStartDate, viewMode, setViewMode, days }) => (
  <Paper sx={{ p: 2, borderRadius: '16px', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Quiz Planner</Typography>
    <Box sx={{ flex: 1 }} />
    <ButtonGroup size="small" sx={{ mr: 1 }}>
      <Button onClick={() => setStartDate(viewMode === 'month' ? subMonths(startDate, 1) : addDays(startDate, viewMode === 'week' ? -7 : -1))}>Prev</Button>
      <Button onClick={() => setStartDate(new Date())}>Today</Button>
      <Button onClick={() => setStartDate(viewMode === 'month' ? addMonths(startDate, 1) : addDays(startDate, viewMode === 'week' ? 7 : 1))}>Next</Button>
    </ButtonGroup>
    <Typography variant="body2" sx={{ color: '#202F32', fontWeight: 600, mr: 1 }}>
      {viewMode === 'month' ? format(startDate, 'MMMM yyyy') : `${format(days[0], 'MMM dd')} – ${format(days[days.length - 1], 'MMM dd')}`}
    </Typography>
    <ButtonGroup size="small">
      <Button variant={viewMode === 'day' ? 'contained' : 'outlined'} onClick={() => setViewMode('day')}>Day</Button>
      <Button variant={viewMode === 'week' ? 'contained' : 'outlined'} onClick={() => setViewMode('week')}>Week</Button>
      <Button variant={viewMode === 'month' ? 'contained' : 'outlined'} onClick={() => setViewMode('month')}>Month</Button>
    </ButtonGroup>
  </Paper>
);

const ScheduleGrid = ({ days, items, viewMode }) => (
  <Paper sx={{ p: 2, borderRadius: '16px', overflowX: 'auto' }}>
    <Box sx={{ display: 'grid', gridTemplateColumns: `200px repeat(${days.length}, 1fr)`, gap: 0.5, minWidth: '800px' }}>
      <Box />
      {days.map((d) => (
        <Box key={d.toISOString()} sx={{ textAlign: 'center', py: 1 }}>
          <Typography variant="caption" sx={{ fontWeight: 600 }}>
            {viewMode === 'month' ? format(d, 'dd') : format(d, 'dd EEE')}
          </Typography>
        </Box>
      ))}
      {items.map((row) => (
        <React.Fragment key={row.id}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
            <Chip size="small" label={row.courseTag} sx={{ bgcolor: 'rgba(195,151,102,0.15)', color: '#C39766' }} />
            <Typography variant="body2" sx={{ color: '#202F32', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{row.title}</Typography>
          </Box>
          {days.map((d, idx) => (
            <Box key={`${row.id}-${idx}`} sx={{ position: 'relative', minHeight: 56, bgcolor: idx % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent', borderRadius: 1 }}>
              {format(d, 'yyyy-MM-dd') === format(row.start, 'yyyy-MM-dd') && (
                <Box sx={{ position: 'absolute', left: 4, right: `${(row.span - 1) * -100}%`, top: 8, height: 40, bgcolor: row.color, border: `2px solid ${row.border}`, borderRadius: 2, display: 'flex', alignItems: 'center', px: 1.5, zIndex: 1 }}>
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>{row.name}</Typography>
                  <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                    <Chip label={`${row.questions} Qs`} size="small" sx={{ bgcolor: 'white' }} />
                  </Box>
                </Box>
              )}
            </Box>
          ))}
        </React.Fragment>
      ))}
    </Box>
  </Paper>
);

const QuizTab = ({ courseId, quizzes, course, fetchData }) => {
  const [tab, setTab] = useState(0);
  const [openCreateQuiz, setOpenCreateQuiz] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('week');

  const handleSaveQuiz = async (form) => {
    try {
      const payload = {
        title: form.title,
        course: courseId, // Use courseId from props
        lesson: form.lesson || undefined,
        availableOn: form.availableOn || undefined,
        questions: form.questions,
      };
      await api.post('/quizzes', payload);
      setOpenCreateQuiz(false);
      fetchData(); // Use the parent's fetch function
    } catch (e) {
      console.error("Failed to save quiz", e);
      alert("Failed to save quiz");
      setOpenCreateQuiz(false);
    }
  };

  const quizPlannerItems = useMemo(() => quizzes.map((q, idx) => ({
    id: q._id || `q-${idx}`,
    title: course?.title || 'Course',
    courseTag: course?.level?.substring(0, 2).toUpperCase() || 'EN',
    name: q.title || 'Quiz',
    questions: q.questions?.length || 0,
    start: q.availableOn ? new Date(q.availableOn) : addDays(startDate, (idx % 5) + 1),
    span: 1,
    color: 'rgba(33,150,243,0.08)',
    border: '#2196f3',
  })), [quizzes, startDate, course]);

  const plannerDays = useMemo(() => {
    if (viewMode === 'day') return [startDate];
    if (viewMode === 'month') return eachDayOfInterval({ start: startOfMonth(startDate), end: endOfMonth(startDate) });
    return eachDayOfInterval({ start: startDate, end: addDays(startDate, 6) });
  }, [startDate, viewMode]);

  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="All Quizzes" />
        <Tab label="Attempts" />
      </Tabs>

      {tab === 0 && ( // Planner view
        <PlannerHeader days={plannerDays} startDate={startDate} setStartDate={setStartDate} viewMode={viewMode} setViewMode={setViewMode} />
      )}
      {tab === 0 && <ScheduleGrid days={plannerDays} items={quizPlannerItems} viewMode={viewMode} />}

      {tab === 0 && (
        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32' }}>All Quizzes</Typography>
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreateQuiz(true)} sx={{ bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' } }}>Create Quiz</Button>
          </Box>
          {quizzes.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#666' }}>No quizzes found for this course.</Typography>
          ) : (
            <Grid container spacing={2}>
              {quizzes.map((q) => (
                <Grid key={q._id} item xs={12} md={6} lg={4}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#202F32' }}>{q.title}</Typography>
                      <Box>
                        <Chip size="small" label={`${q.questions?.length || 0} Questions`} sx={{ bgcolor: 'rgba(195,151,102,0.15)', color: '#C39766', mr: 1 }} />
                        {q.lesson && <Chip size="small" label={`Lesson: ${q.lesson.title}`} variant="outlined" />}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      )}

      {tab === 1 && (
        <Paper sx={{ p: 3, borderRadius: '16px' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32', mb: 1 }}>Attempts</Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>Attempts view coming soon. We will list attempts by student with score, time, and status.</Typography>
        </Paper>
      )}

      <CreateQuizDialog
        open={openCreateQuiz}
        onClose={() => setOpenCreateQuiz(false)}
        courseId={courseId}
        course={course}
        onSaved={handleSaveQuiz}
      />
    </Box>
  );
};

export default QuizTab;
