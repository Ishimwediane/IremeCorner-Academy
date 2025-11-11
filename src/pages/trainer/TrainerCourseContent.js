
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Tabs,
  Tab,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Stack,
  Checkbox,
  FormControlLabel,
  InputAdornment,
  ButtonGroup,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Save as SaveIcon,
  Add as AddIcon,
  Videocam as VideoIcon,
  Description as FileTextIcon,
  AccessTime as ClockIcon,
  DragIndicator as GripVerticalIcon,
  Delete as TrashIcon,
  Edit as EditIcon,
  CloudUpload as UploadCloudIcon,
  Close as XIcon,
  InsertDriveFile as FileIcon,
  ViewList as LayoutIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import AssignmentTab from './AssignmentTab';
import { format, addDays, eachDayOfInterval, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizTab from './QuizTab';
import LiveSessionTab from './LiveSessionTab';
import QuizIcon from '@mui/icons-material/Quiz';
import DuoIcon from '@mui/icons-material/Duo';
import TrainerLayout from '../../components/TrainerLayout';

const TrainerCourseContent = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Lesson Modal State
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState(null);
  
  // Form States
  const [lessonForm, setLessonForm] = useState({
    videoType: 'url',
    duration: 0,
    isPublished: true,
    materials: [],
    existingMaterials: []
  });
  
  const [courseForm, setCourseForm] = useState({});

  const fetchData = async () => {
    if (!courseId) return;
    try {
      // Fetch course first
      const courseRes = await api.get(`/courses/${courseId}`);
      const courseData = courseRes.data?.data;

      if (courseData) {
        setCourse(courseData);
        setCourseForm(courseData);
        // Then fetch lessons
        const [lessonsRes, assignmentsRes, quizzesRes] = await Promise.all([
          api.get(`/lessons/course/${courseId}`),
          api.get(`/assignments/course/${courseId}`),
          api.get(`/quizzes/course/${courseId}`),
        ]);

        setLessons(lessonsRes.data?.data || []);
        setAssignments(assignmentsRes.data?.data || []);
        setQuizzes(quizzesRes.data?.data || []);
        // setLiveSessions(liveSessionsRes.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch course content:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [courseId]);

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    if (!course) return;
    setSaving(true);
    try {
      const { data } = await api.put(`/courses/${course._id}`, courseForm);
      setCourse(data.data);
      alert('Course details updated successfully!');
    } catch (e) {
      console.error(e);
      alert('Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  const openLessonModal = (lesson) => {
    if (lesson) {
      setEditingLessonId(lesson._id);
      setLessonForm({
        title: lesson.title,
        description: lesson.description,
        content: lesson.content,
        videoType: lesson.videoUrl ? 'url' : 'file',
        videoUrl: lesson.videoUrl || '',
        duration: lesson.duration,
        isPublished: lesson.isPublished,
        existingMaterials: lesson.materials || [],
        materials: []
      });
    } else {
      setEditingLessonId(null);
      setLessonForm({
        title: '',
        description: '',
        content: '',
        videoType: 'url',
        videoUrl: '',
        duration: 0,
        isPublished: true,
        materials: [],
        existingMaterials: []
      });
    }
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = async () => {
    if (!courseId || !lessonForm.title) {
      alert("Title is required");
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('course', courseId);
      formData.append('title', lessonForm.title);
      formData.append('description', lessonForm.description || '');
      formData.append('content', lessonForm.content || '');
      formData.append('duration', Number(lessonForm.duration) || 0);
      formData.append('isPublished', lessonForm.isPublished);

      // Handle video
      if (lessonForm.videoType === 'url') {
        formData.append('videoUrl', lessonForm.videoUrl);
      } else if (lessonForm.videoFile) {
        formData.append('videoFile', lessonForm.videoFile);
      }

      // Handle materials
      if (lessonForm.materials.length > 0) {
        lessonForm.materials.forEach(file => {
          formData.append('materials', file);
        });
      }
      
      // When updating, we need to send existing materials to keep them
      if (editingLessonId && lessonForm.existingMaterials) {
        formData.append('existingMaterials', JSON.stringify(lessonForm.existingMaterials));
      }

      if (editingLessonId) {
        await api.put(`/lessons/${editingLessonId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/lessons', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }
      
      setIsLessonModalOpen(false);
      fetchData(); 
    } catch (error) {
      console.error(error);
      alert("Failed to save lesson");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLesson = async (id) => {
    if(!window.confirm("Are you sure you want to delete this lesson? This cannot be undone.")) return;
    try {
      await api.delete(`/lessons/${id}`);
      setLessons(lessons.filter(l => l._id !== id));
    } catch (e) {
      console.error(e);
    }
  }

  if (loading) {
    return (
      <TrainerLayout title="Loading...">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}><CircularProgress /></Box>
      </TrainerLayout>
    );
  }

  if (!course) {
    return (
      <TrainerLayout title="Error">
        <Typography sx={{ textAlign: 'center', mt: 4 }}>Course not found</Typography>
      </TrainerLayout>
    );
  }

  return (
    <TrainerLayout title={`Edit Course: ${course.title}`}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/trainer/courses')} sx={{ bgcolor: 'white', border: '1px solid #e0e0e0' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>{course.title}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, color: 'text.secondary' }}>
              <Chip
                label={course.status}
                size="small"
                color={course.status === 'approved' ? 'success' : 'warning'}
              />
              <Typography variant="body2">•</Typography>
              <Typography variant="body2">{lessons.length} Lessons</Typography>
              <Typography variant="body2">•</Typography>
              <Typography variant="body2">{course.duration} Hours Total</Typography>
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined">
            Preview Course
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ borderBottom: 1, borderColor: 'divider', borderRadius: '12px 12px 0 0' }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ '& .MuiTab-root': { textTransform: 'none' } }}>
          <Tab icon={<LayoutIcon />} iconPosition="start" label="Curriculum" />
          <Tab icon={<SettingsIcon />} iconPosition="start" label="Course Info & Settings" />
          <Tab icon={<AssignmentIcon />} iconPosition="start" label="Assignments" />
          <Tab icon={<QuizIcon />} iconPosition="start" label="Quizzes" />
          <Tab icon={<DuoIcon />} iconPosition="start" label="Live Sessions" />
        </Tabs>
      </Paper>

      {/* Content Area */}
      <Paper sx={{ minHeight: '600px', p: 3, borderRadius: '0 0 12px 12px' }}>
        
        {/* CURRICULUM TAB */}
        {activeTab === 0 && (
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Course Content</Typography>
                <Typography variant="body2" color="text.secondary">Organize and manage your lessons.</Typography>
              </Box>
              <Button 
                onClick={() => openLessonModal()}
                variant="contained"
                startIcon={<AddIcon />}
                sx={{ bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' }, textTransform: 'none' }}
              >
                Add Lesson
              </Button>
            </Box>

            {lessons.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8, border: '2px dashed #e0e0e0', borderRadius: 2, bgcolor: '#fafafa' }}>
                <Box sx={{ width: 64, height: 64, bgcolor: '#eeeeee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
                  <FileTextIcon sx={{ fontSize: 32, color: 'text.secondary' }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 1 }}>No lessons yet</Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>Start building your curriculum by adding a lesson.</Typography>
                <Button onClick={() => openLessonModal()} sx={{ color: '#C39766', fontWeight: 'medium' }}>
                  Create your first lesson
                </Button>
              </Box>
            ) : (
              <Stack spacing={2}>
                {lessons.map((lesson) => (
                  <Paper key={lesson._id} variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, '&:hover .actions': { opacity: 1 } }}>
                    <GripVerticalIcon sx={{ color: 'text.disabled', cursor: 'grab' }} />
                    
                    <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: 'primary.lightest', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {lesson.videoUrl || lesson.videoFile ? <VideoIcon color="primary" /> : <FileTextIcon color="primary" />}
                    </Box>

                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography sx={{ fontWeight: 'medium', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lesson.title}</Typography>
                        {!lesson.isPublished && (
                          <Chip label="Draft" size="small" />
                        )}
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><ClockIcon sx={{ fontSize: 16 }} /> <Typography variant="body2">{lesson.duration} min</Typography></Box>
                        {lesson.materials && lesson.materials.length > 0 && (
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><FileIcon sx={{ fontSize: 16 }} /> <Typography variant="body2">{lesson.materials.length} files</Typography></Box>
                        )}
                      </Box>
                    </Box>

                    <Box className="actions" sx={{ display: 'flex', gap: 1, opacity: { xs: 1, md: 0 }, transition: 'opacity 0.2s' }}>
                      <IconButton 
                        onClick={() => openLessonModal(lesson)}
                        title="Edit Lesson"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        onClick={() => handleDeleteLesson(lesson._id)}
                        title="Delete Lesson"
                        color="error"
                      >
                        <TrashIcon />
                      </IconButton>
                    </Box>
                  </Paper>
                ))}
              </Stack>
            )}
          </Box>
        )}

        {/* SETTINGS TAB */}
        {activeTab === 1 && (
          <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Course Settings</Typography>
            <Box component="form" onSubmit={handleUpdateCourse}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField fullWidth label="Course Title" value={courseForm.title || ''} onChange={e => setCourseForm({...courseForm, title: e.target.value})} />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth select label="Category" value={courseForm.category || ''} onChange={e => setCourseForm({...courseForm, category: e.target.value})}>
                    <MenuItem value="Digital Tools">Digital Tools</MenuItem>
                    <MenuItem value="Marketing">Marketing</MenuItem>
                    <MenuItem value="Financial Literacy">Financial Literacy</MenuItem>
                    <MenuItem value="Business Management">Business Management</MenuItem>
                    <MenuItem value="Technical Skills">Technical Skills</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField fullWidth select label="Level" value={courseForm.level || ''} onChange={e => setCourseForm({...courseForm, level: e.target.value})}>
                    <MenuItem value="Beginner">Beginner</MenuItem>
                    <MenuItem value="Intermediate">Intermediate</MenuItem>
                    <MenuItem value="Advanced">Advanced</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Price (USD)"
                    type="number"
                    value={courseForm.price || 0}
                    onChange={e => setCourseForm({...courseForm, price: parseFloat(e.target.value), isFree: parseFloat(e.target.value) === 0})}
                    InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Duration (Hours)"
                    type="number"
                    value={courseForm.duration || 0}
                    onChange={e => setCourseForm({...courseForm, duration: parseFloat(e.target.value)})}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Description"
                    multiline
                    rows={4}
                    value={courseForm.description || ''}
                    onChange={e => setCourseForm({...courseForm, description: e.target.value})}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 3, mt: 3, borderTop: 1, borderColor: 'divider' }}>
                <Button onClick={() => fetchData()}>Reset</Button>
                <Button 
                  type="submit" 
                  disabled={saving}
                  variant="contained"
                  startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                  sx={{ bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' } }}
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </Box>
            </Box>
          </Box>
        )}

        {/* ASSIGNMENTS TAB */}
        {activeTab === 2 && (
          <AssignmentTab courseId={courseId} assignments={assignments} setAssignments={setAssignments} course={course} /> 
        )}

        {/* QUIZZES TAB */}
        {activeTab === 3 && (
          <QuizTab courseId={courseId} quizzes={quizzes} setQuizzes={setQuizzes} course={course} />
        )}

        {/* LIVE SESSIONS TAB */}
        {activeTab === 4 && (
          <LiveSessionTab courseId={courseId} liveSessions={liveSessions} setLiveSessions={setLiveSessions} />
        )}
      </Paper>

      {/* LESSON MODAL */}
      <Dialog open={isLessonModalOpen} onClose={() => setIsLessonModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingLessonId ? 'Edit Lesson' : 'Create New Lesson'}
          <IconButton onClick={() => setIsLessonModalOpen(false)}>
            <XIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ py: 2 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Lesson Title"
                placeholder="e.g., Introduction to the Course"
                value={lessonForm.title}
                onChange={e => setLessonForm({...lessonForm, title: e.target.value})}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>Video Source</Typography>
              <Paper variant="outlined" sx={{ display: 'flex', p: 0.5 }}>
                <Button
                  fullWidth
                  variant={lessonForm.videoType === 'url' ? 'contained' : 'text'}
                  onClick={() => setLessonForm({...lessonForm, videoType: 'url'})}
                >
                  URL
                </Button>
                <Button
                  fullWidth
                  variant={lessonForm.videoType === 'file' ? 'contained' : 'text'}
                  onClick={() => setLessonForm({...lessonForm, videoType: 'file'})}
                >
                  Upload
                </Button>
              </Paper>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (minutes)"
                type="number"
                value={lessonForm.duration}
                onChange={e => setLessonForm({...lessonForm, duration: parseInt(e.target.value) || 0})}
              />
            </Grid>

            <Grid item xs={12}>
              {lessonForm.videoType === 'url' ? (
                <TextField
                  fullWidth
                  label="Video URL"
                  placeholder="https://youtube.com/..."
                  value={lessonForm.videoUrl}
                  onChange={e => setLessonForm({...lessonForm, videoUrl: e.target.value})}
                  InputProps={{ startAdornment: <InputAdornment position="start"><VideoIcon /></InputAdornment> }}
                />
              ) : (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>Upload Video File</Typography>
                  <Button
                    component="label"
                    fullWidth
                    variant="outlined"
                    startIcon={<UploadCloudIcon />}
                    sx={{ p: 3, borderStyle: 'dashed', textTransform: 'none' }}
                  >
                    {lessonForm.videoFile ? lessonForm.videoFile.name : 'Click to upload or drag and drop'}
                    <input
                      type="file"
                      hidden
                      accept="video/*"
                      onChange={e => {
                        if (e.target.files && e.target.files[0]) {
                          setLessonForm({...lessonForm, videoFile: e.target.files[0]});
                        }
                      }}
                    />
                  </Button>
                </Box>
              )}
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description & Content"
                multiline
                rows={4}
                placeholder="What will students learn in this lesson?"
                value={lessonForm.description || ''}
                onChange={e => setLessonForm({...lessonForm, description: e.target.value})}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>Downloadable Materials</Typography>
              <Stack spacing={1}>
                {lessonForm.existingMaterials.map((mat, idx) => (
                  <Chip
                    key={idx}
                    icon={<FileIcon />}
                    label={`${mat.originalName} (${(mat.fileSize / 1024).toFixed(0)} KB)`}
                    onDelete={() => {
                      setLessonForm({
                        ...lessonForm,
                        existingMaterials: lessonForm.existingMaterials.filter((_, i) => i !== idx)
                      });
                    }}
                  />
                ))}
                {lessonForm.materials.map((file, idx) => (
                  <Chip
                    key={`new-${idx}`}
                    icon={<UploadCloudIcon />}
                    label={`${file.name} (New)`}
                    color="primary"
                    onDelete={() => {
                      const newMats = [...lessonForm.materials];
                      newMats.splice(idx, 1);
                      setLessonForm({...lessonForm, materials: newMats});
                    }}
                  />
                ))}
                <Button
                  component="label"
                  startIcon={<AddIcon />}
                  size="small"
                  sx={{ alignSelf: 'flex-start' }}
                >
                  Add Material
                  <input
                    type="file"
                    hidden
                    multiple
                    onChange={e => {
                      if (e.target.files && e.target.files.length > 0) {
                        const newFiles = Array.from(e.target.files);
                        setLessonForm({
                          ...lessonForm,
                          materials: [...lessonForm.materials, ...newFiles]
                        });
                      }
                    }}
                  />
                </Button>
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={lessonForm.isPublished}
                    onChange={e => setLessonForm({...lessonForm, isPublished: e.target.checked})}
                  />
                }
                label="Publish this lesson immediately"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsLessonModalOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSaveLesson}
            disabled={saving}
            variant="contained"
            sx={{ bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' } }}
          >
            {saving ? 'Saving...' : (editingLessonId ? 'Update Lesson' : 'Create Lesson')}
          </Button>
        </DialogActions>
      </Dialog>
    </TrainerLayout>
  );
};

export default TrainerCourseContent;
