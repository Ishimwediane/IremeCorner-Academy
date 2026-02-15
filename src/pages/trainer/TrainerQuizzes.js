import React, { useEffect, useMemo, useState } from 'react';
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
  TextField,
  MenuItem,
  IconButton,
  Tabs,
  Tab,
  Select,
  ButtonGroup,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { format, addDays, eachDayOfInterval, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import TrainerLayout from '../../components/TrainerLayout';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';


const PlannerHeader = ({ startDate, setStartDate, courseOptions, selectedCourse, setSelectedCourse, viewMode, setViewMode, days }) => (
  <Paper sx={{ p: 1.5, borderRadius: 0, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Quiz Planner</Typography>
    <Select size="small" value={selectedCourse} onChange={(e) => setSelectedCourse(e.target.value)} displayEmpty sx={{ ml: 1, minWidth: 200, fontSize: '0.8rem' }}>
      <MenuItem value="all">All Courses</MenuItem>
      {courseOptions.map((c) => (
        <MenuItem key={c._id} value={c._id}>{c.title}</MenuItem>
      ))}
    </Select>
    <Box sx={{ flex: 1 }} />
    <ButtonGroup size="small" sx={{ mr: 1, '& .MuiButton-root': { borderRadius: 0, py: 0.25, px: 1, fontSize: '0.75rem' } }}>
      <Button onClick={() => setStartDate(viewMode === 'month' ? subMonths(startDate, 1) : addDays(startDate, viewMode === 'week' ? -7 : -1))}>Prev</Button>
      <Button onClick={() => setStartDate(new Date())}>Today</Button>
      <Button onClick={() => setStartDate(viewMode === 'month' ? addMonths(startDate, 1) : addDays(startDate, viewMode === 'week' ? 7 : 1))}>Next</Button>
    </ButtonGroup>
    <Typography variant="body2" sx={{ color: '#202F32', fontWeight: 600, mr: 1 }}>
      {viewMode === 'month' ? format(startDate, 'MMMM yyyy') : `${format(days[0], 'MMM dd')} – ${format(days[days.length - 1], 'MMM dd')}`}
    </Typography>
    <ButtonGroup size="small" sx={{ '& .MuiButton-root': { borderRadius: 0, py: 0.25, px: 1, fontSize: '0.75rem' } }}>
      <Button variant={viewMode === 'day' ? 'contained' : 'outlined'} onClick={() => setViewMode('day')}>Day</Button>
      <Button variant={viewMode === 'week' ? 'contained' : 'outlined'} onClick={() => setViewMode('week')}>Week</Button>
      <Button variant={viewMode === 'month' ? 'contained' : 'outlined'} onClick={() => setViewMode('month')}>Month</Button>
    </ButtonGroup>
  </Paper>
);

const ScheduleGrid = ({ days, items, viewMode }) => {
  return (
    <Paper sx={{ p: 1.5, borderRadius: 0, overflowX: 'auto' }}>
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
          <>
            <Box key={`${row.id}-label`} sx={{ display: 'flex', alignItems: 'center', gap: 1, py: 1 }}>
              <Chip size="small" label={row.courseTag} sx={{ bgcolor: 'rgba(195,151,102,0.15)', color: '#C39766' }} />
              <Typography variant="body2" sx={{ color: '#202F32', fontWeight: 600 }}>{row.title}</Typography>
            </Box>
            {days.map((d, idx) => (
              <Box key={`${row.id}-${idx}`} sx={{ position: 'relative', minHeight: 56, bgcolor: idx % 2 === 0 ? 'rgba(0,0,0,0.02)' : 'transparent', borderRadius: 1 }}>
                {format(d, 'yyyy-MM-dd') === format(row.start, 'yyyy-MM-dd') && (
                  <Box sx={{ position: 'absolute', left: 4, right: `${(row.span - 1) * -100}%`, top: 8, height: 40, bgcolor: row.color, border: `2px solid ${row.border}`, borderRadius: 2, display: 'flex', alignItems: 'center', px: 1.5 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700 }}>{row.name}</Typography>
                    <Box sx={{ ml: 'auto', display: 'flex', gap: 0.5 }}>
                      <Chip label={`${row.questions} Qs`} size="small" sx={{ bgcolor: 'white' }} />
                    </Box>
                  </Box>
                )}
              </Box>
            ))}
          </>
        ))}
      </Box>
    </Paper>
  );
};

const QuizDialog = ({ open, onClose, onSaved, courses = [], defaultCourseId, editMode = false, initialData = null }) => {
  const [form, setForm] = useState({
    title: '',
    course: defaultCourseId || '',
    availableOn: '',
    questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0, points: 10 }],
  });

  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (editMode && initialData) {
      setForm({
        title: initialData.title || '',
        course: initialData.course?._id || initialData.course || defaultCourseId || '',
        availableOn: initialData.availableOn ? format(new Date(initialData.availableOn), 'yyyy-MM-dd') : '',
        questions: initialData.questions?.length > 0
          ? initialData.questions.map(q => ({
            question: q.question || '',
            options: q.options?.length === 4 ? q.options : ['', '', '', ''],
            correctAnswer: q.correctAnswer ?? 0,
            points: q.points || 10,
          }))
          : [{ question: '', options: ['', '', '', ''], correctAnswer: 0, points: 10 }],
      });
    } else {
      setForm({
        title: '',
        course: defaultCourseId || '',
        availableOn: '',
        questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0, points: 10 }],
      });
    }
  }, [editMode, initialData, defaultCourseId, open]);

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
      questions: [...form.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0, points: 10 }],
    });
  };

  const removeQuestion = (qIndex) => {
    if (form.questions.length <= 1) return; // Must have at least one question
    const newQuestions = form.questions.filter((_, index) => index !== qIndex);
    setForm({ ...form, questions: newQuestions });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{editMode ? 'Edit Quiz' : 'Create Quiz'}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField fullWidth label="Quiz Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Course" select value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })}>
              {courses.map((c) => <MenuItem key={c._id || c} value={c._id || c}>{c.title || c}</MenuItem>)}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField fullWidth type="date" label="Available On" InputLabelProps={{ shrink: true }} value={form.availableOn} onChange={(e) => setForm({ ...form, availableOn: e.target.value })} />
          </Grid>

          {form.questions.map((q, qIndex) => (
            <Grid item xs={12} key={qIndex} component={Paper} variant="outlined" sx={{ p: 2, mt: 2, position: 'relative' }}>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: '#202F32' }}>Question {qIndex + 1}</Typography>
              {form.questions.length > 1 && (
                <IconButton onClick={() => removeQuestion(qIndex)} size="small" sx={{ position: 'absolute', top: 8, right: 8, color: 'error.main' }}>
                  <DeleteIcon />
                </IconButton>
              )}
              <TextField
                fullWidth
                label="Question Text"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                sx={{ mb: 2 }}
                multiline
                rows={2}
              />
              <Grid container spacing={1}>
                {q.options.map((opt, oIndex) => (
                  <Grid item xs={12} sm={6} key={oIndex}>
                    <TextField
                      fullWidth
                      label={`Option ${oIndex + 1}`}
                      value={opt}
                      onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                      size="small"
                    />
                  </Grid>
                ))}
              </Grid>
              <TextField
                fullWidth
                select
                label="Correct Answer"
                value={q.correctAnswer}
                onChange={(e) => handleQuestionChange(qIndex, 'correctAnswer', Number(e.target.value))}
                sx={{ mt: 2 }}
                size="small"
              >
                {q.options.map((opt, oIndex) => (
                  <MenuItem key={oIndex} value={oIndex}>
                    Option {oIndex + 1} {opt ? `- ${opt.substring(0, 30)}${opt.length > 30 ? '...' : ''}` : ''}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          ))}

          <Grid item xs={12}>
            <Button onClick={addQuestion} size="small" startIcon={<AddIcon />} sx={{ color: '#FD7E14' }}>
              Add Another Question
            </Button>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} size="small">Cancel</Button>
        <Button onClick={() => onSaved(form)} variant="contained" size="small" sx={{ bgcolor: '#FD7E14', borderRadius: 0, py: 0.5, px: 1.5, fontSize: '0.8rem', '&:hover': { bgcolor: '#E56D0F' } }}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

const TrainerQuizzes = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [openCreate, setOpenCreate] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [tab, setTab] = useState(0);
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [quizzes, setQuizzes] = useState([]);
  const [viewMode, setViewMode] = useState('week');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const userId = user?._id || user?.id;
    if (!userId) return;
    api.get(`/courses?trainer=${userId}`).then((res) => setCourses(res.data?.data || [])).catch(() => { });
  }, [user]);

  useEffect(() => {
    const load = async () => {
      try {
        if (selectedCourse === 'all') {
          const lists = await Promise.all(
            courses.map((c) => api.get(`/assessments/course/${c._id}`).then((r) => ({ course: c, items: r.data?.data?.quizzes || [] })).catch(() => ({ course: c, items: [] })))
          );
          const merged = lists.flatMap(({ course, items }) => items.map((q) => ({ ...q, _course: course })));
          setQuizzes(merged);
        } else {
          const r = await api.get(`/assessments/course/${selectedCourse}`);
          const course = courses.find((c) => c._id === selectedCourse);
          setQuizzes((r.data?.data?.quizzes || []).map((q) => ({ ...q, _course: course })));
        }
      } catch (e) {
        setQuizzes([]);
      }
    };
    load();
  }, [selectedCourse, courses, refreshKey]);

  const items = useMemo(() => quizzes.map((q, idx) => ({
    id: q._id || `q-${idx}`,
    title: q._course?.title || 'Course',
    courseTag: q._course?.level || 'EN',
    name: q.title || 'Quiz',
    questions: q.questions?.length || 0,
    start: q.availableOn ? new Date(q.availableOn) : addDays(new Date(), (idx % 5) + 1),
    span: 1,
    color: 'rgba(33,150,243,0.08)',
    border: '#2196f3',
  })), [quizzes]);

  const days = useMemo(() => {
    if (viewMode === 'day') return [startDate];
    if (viewMode === 'month') {
      const s = startOfMonth(startDate);
      const e = endOfMonth(startDate);
      return eachDayOfInterval({ start: s, end: e });
    }
    return eachDayOfInterval({ start: startDate, end: addDays(startDate, 6) });
  }, [startDate, viewMode]);

  return (
    <TrainerLayout title="Quiz Management">
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="Planner (Schedule)" />
        <Tab label="Attempts" />
        <Tab label="All Quizzes" />
      </Tabs>

      {tab === 0 && (
        <>
          <PlannerHeader startDate={startDate} setStartDate={setStartDate} courseOptions={courses} selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} viewMode={viewMode} setViewMode={setViewMode} days={days} />
          <ScheduleGrid days={days} items={items} viewMode={viewMode} />
        </>
      )}

      {tab === 1 && (
        <Paper sx={{ p: 3, borderRadius: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32', mb: 1 }}>Attempts</Typography>
          <Typography variant="body2" sx={{ color: '#666' }}>Attempts view coming soon. We will list attempts by student with score, time, and status.</Typography>
        </Paper>
      )}

      {tab === 2 && (
        <Paper sx={{ p: 3, borderRadius: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32' }}>All Quizzes</Typography>
            <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)} sx={{ bgcolor: '#FD7E14', borderRadius: 0, py: 0.5, px: 1.5, fontSize: '0.8rem', '&:hover': { bgcolor: '#E56D0F' } }}>Create Quiz</Button>
          </Box>
          {quizzes.length === 0 ? (
            <Typography variant="body2" sx={{ color: '#666' }}>No quizzes found.</Typography>
          ) : (
            <Grid container spacing={2}>
              {quizzes.map((q) => (
                <Grid key={q._id} item xs={12} md={6} lg={4}>
                  <Card sx={{ borderRadius: 0 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#202F32' }}>{q.title}</Typography>
                        <IconButton
                          size="small"
                          onClick={() => setEditingQuiz(q)}
                          sx={{ color: '#FD7E14', '&:hover': { bgcolor: 'rgba(253, 126, 20, 0.1)' } }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      <Typography variant="body2" sx={{ color: '#666', mb: 0.5 }}>{q._course?.title}</Typography>
                      <Chip size="small" label={`${q.questions?.length || 0} Questions`} sx={{ bgcolor: 'rgba(195,151,102,0.15)', color: '#C39766' }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>
      )}

      {/* Create Quiz Dialog */}
      <QuizDialog
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        defaultCourseId={selectedCourse !== 'all' ? selectedCourse : ''}
        courses={courses}
        editMode={false}
        onSaved={async (form) => {
          try {
            const payload = {
              title: form.title,
              course: form.course,
              availableOn: form.availableOn || undefined,
              questions: form.questions,
            };
            await api.post('/quizzes', payload);
            setOpenCreate(false);
            setRefreshKey((k) => k + 1);
          } catch (e) {
            console.error('Failed to create quiz:', e);
            setOpenCreate(false);
          }
        }}
      />

      {/* Edit Quiz Dialog */}
      <QuizDialog
        open={!!editingQuiz}
        onClose={() => setEditingQuiz(null)}
        defaultCourseId={selectedCourse !== 'all' ? selectedCourse : ''}
        courses={courses}
        editMode={true}
        initialData={editingQuiz}
        onSaved={async (form) => {
          try {
            const payload = {
              title: form.title,
              course: form.course,
              availableOn: form.availableOn || undefined,
              questions: form.questions,
            };
            await api.put(`/quizzes/${editingQuiz._id}`, payload);
            setEditingQuiz(null);
            setRefreshKey((k) => k + 1);
          } catch (e) {
            console.error('Failed to update quiz:', e);
            setEditingQuiz(null);
          }
        }}
      />
    </TrainerLayout>
  );
};

export default TrainerQuizzes;


