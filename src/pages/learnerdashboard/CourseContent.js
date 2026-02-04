import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  CircularProgress,
  Button,
  Stack,
  Chip,
  Divider,
  Card,
  CardContent,
  IconButton,
  Drawer,
} from '@mui/material';
import {
  PlayCircleOutline,
  DescriptionOutlined,
  CheckCircle,
  ArrowBack,
  Download,
  Assignment,
  Quiz,
  Event,
  Menu as MenuIcon,
  Close,
  RadioButtonUnchecked,
} from '@mui/icons-material';
import ReactPlayer from 'react-player';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../utils/api';
import MarkdownRenderer from '../../components/MarkdownRenderer';

const CourseContent = () => {
  const { courseId, lessonId } = useParams();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Brand colors
  const colors = {
    chocolate: '#C39766',
    black: '#1a1a1a',
    cream: '#f5f1ed',
    lightCream: '#faf8f5',
  };

  // Fetch course data
  const { data: courseData, isLoading: isCourseLoading } = useQuery(
    ['course', courseId],
    async () => {
      const response = await api.get(`/courses/${courseId}`);
      return response.data.data;
    }
  );

  // Fetch assignments for the lesson
  const { data: assignments, isLoading: assignmentsLoading } = useQuery(
    ['assignments', lessonId],
    async () => {
      const response = await api.get(`/assignments/lesson/${lessonId}`);
      return response.data.data;
    },
    { enabled: !!lessonId }
  );

  // Fetch all quizzes for the course (to show counts in sidebar)
  const { data: allQuizzes } = useQuery(
    ['allQuizzes', courseId],
    async () => {
      const response = await api.get(`/quizzes/course/${courseId}`);
      return response.data.data;
    },
    { enabled: !!courseId }
  );

  // Fetch all assignments for the course (to show counts in sidebar)
  const { data: allAssignments } = useQuery(
    ['allAssignments', courseId],
    async () => {
      const response = await api.get(`/assignments/course/${courseId}`);
      return response.data.data;
    },
    { enabled: !!courseId }
  );

  // Fetch quizzes for the selected lesson
  const { data: quizzes, isLoading: quizzesLoading } = useQuery(
    ['quizzes', lessonId],
    async () => {
      const response = await api.get(`/quizzes/lesson/${lessonId}`);
      return response.data.data;
    },
    { enabled: !!lessonId }
  );

  // Fetch live sessions for the course
  const { data: liveSessions, isLoading: liveSessionsLoading } = useQuery(
    ['liveSessions', courseId],
    async () => {
      const response = await api.get(`/live-sessions/course/${courseId}`);
      return response.data.data;
    },
    { enabled: !!courseId }
  );

  // Fetch progress data
  const { data: progressData, isLoading: isProgressLoading } = useQuery(
    ['progress', courseId],
    async () => {
      const response = await api.get(`/progress/courses/${courseId}`);
      return response.data.data;
    },
    { enabled: !!courseId }
  );

  // Mutation to update lesson progress
  const updateProgressMutation = useMutation(
    ({ lessonId, isCompleted }) => api.post('/progress/lessons', { courseId, lessonId, isCompleted }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['progress', courseId]);
      },
    }
  );

  // Fetch user certificates
  const { data: certificates } = useQuery(
    ['my-certificates'],
    async () => {
      const response = await api.get('/certificates');
      return response.data;
    }
  );

  const courseCertificate = certificates?.data?.find(c =>
    (c.course._id || c.course) === courseId
  );

  useEffect(() => {
    if (lessonId && courseData) {
      const lesson = courseData.lessons?.find(l => l._id === lessonId);
      if (lesson) {
        setSelectedLesson(lesson);
      }
    } else if (courseData?.lessons?.length > 0 && !lessonId) {
      const firstIncompleteLesson = courseData.lessons.find(
        lesson => !completedLessonIds.has(lesson._id)
      ) || courseData.lessons[0];
      setSelectedLesson(firstIncompleteLesson);
      navigate(`/learner/course/${courseId}/lessons/${firstIncompleteLesson._id}`, { replace: true });
    }
  }, [lessonId, courseData, courseId, navigate]);

  const lessons = courseData?.lessons || [];
  const completedLessonIds = new Set(progressData?.filter(p => p.isCompleted).map(p => p.lesson) || []);

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    navigate(`/learner/course/${courseId}/lessons/${lesson._id}`, { replace: true });
    setSidebarOpen(false);
  };

  if (isCourseLoading || isProgressLoading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress sx={{ color: colors.chocolate }} />
        <Typography>Loading course content...</Typography>
      </Container>
    );
  }

  if (!courseData) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5">Course not found</Typography>
        <Button component={Link} to="/learner/courses" startIcon={<ArrowBack />} sx={{ mt: 2, color: colors.chocolate }}>
          Back to Courses
        </Button>
      </Container>
    );
  }

  const isSelectedLessonCompleted = selectedLesson && completedLessonIds.has(selectedLesson._id);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

  // Helper function to get quiz count for a lesson
  const getQuizCountForLesson = (lessonId) => {
    if (!allQuizzes) return 0;
    return allQuizzes.filter(quiz => quiz.lesson === lessonId || quiz.lesson?._id === lessonId).length;
  };

  // Helper function to get assignment count for a lesson
  const getAssignmentCountForLesson = (lessonId) => {
    if (!allAssignments) return 0;
    return allAssignments.filter(assignment => assignment.lesson === lessonId || assignment.lesson?._id === lessonId).length;
  };

  const sidebarContent = (
    <Box sx={{ width: { xs: 280, md: 320 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Course Header */}
      <Box sx={{ p: 3, bgcolor: colors.black, color: 'white' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>
            {courseData.title}
          </Typography>
          <IconButton
            onClick={() => setSidebarOpen(false)}
            sx={{ color: 'white', display: { md: 'none' } }}
          >
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
          {lessons.length} Lessons • {completedLessonIds.size}/{lessons.length} Completed
        </Typography>
        {/* Message Trainer Button */}
        {courseData.trainer && (
          <Button
            fullWidth
            variant="outlined"
            size="small"
            onClick={() => navigate(`/learner/messages?trainer=${courseData.trainer._id || courseData.trainer}`)}
            sx={{
              color: 'white',
              borderColor: colors.chocolate,
              '&:hover': {
                borderColor: 'white',
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            💬 Message Trainer
          </Button>
        )}
      </Box>

      {/* Lessons List */}
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: colors.lightCream }}>
        <List sx={{ p: 0 }}>
          {lessons.map((lesson, index) => {
            const isCompleted = completedLessonIds.has(lesson._id);
            const isActive = selectedLesson?._id === lesson._id;
            const quizCount = getQuizCountForLesson(lesson._id);
            const assignmentCount = getAssignmentCountForLesson(lesson._id);

            return (
              <ListItem key={lesson._id} disablePadding>
                <ListItemButton
                  onClick={() => handleLessonClick(lesson)}
                  sx={{
                    py: 2,
                    px: 3,
                    bgcolor: isActive ? colors.cream : 'transparent',
                    borderLeft: isActive ? '4px solid' : '4px solid transparent',
                    borderColor: colors.chocolate,
                    '&:hover': {
                      bgcolor: colors.cream,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {isCompleted ? (
                      <CheckCircle sx={{ color: colors.chocolate }} />
                    ) : (
                      <RadioButtonUnchecked sx={{ color: 'text.secondary' }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box>
                        <Typography
                          variant="body2"
                          sx={{
                            fontWeight: isActive ? 'bold' : 'medium',
                            color: isActive ? colors.black : 'text.primary',
                          }}
                        >
                          {index + 1}. {lesson.title}
                        </Typography>
                        {/* Quiz and Assignment Indicators */}
                        {(quizCount > 0 || assignmentCount > 0) && (
                          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                            {quizCount > 0 && (
                              <Chip
                                icon={<Quiz sx={{ fontSize: 14 }} />}
                                label={quizCount}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.7rem',
                                  bgcolor: colors.black,
                                  color: 'white',
                                  '& .MuiChip-icon': { color: 'white', marginLeft: '4px' }
                                }}
                              />
                            )}
                            {assignmentCount > 0 && (
                              <Chip
                                icon={<Assignment sx={{ fontSize: 14 }} />}
                                label={assignmentCount}
                                size="small"
                                sx={{
                                  height: 20,
                                  fontSize: '0.7rem',
                                  bgcolor: colors.chocolate,
                                  color: 'white',
                                  '& .MuiChip-icon': { color: 'white', marginLeft: '4px' }
                                }}
                              />
                            )}
                          </Box>
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {lesson.duration || '10'} min
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: colors.lightCream }}>
      {/* Desktop Sidebar */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          width: 320,
          borderRight: 1,
          borderColor: 'divider',
          bgcolor: 'white',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {sidebarContent}
      </Box>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' } }}
      >
        {sidebarContent}
      </Drawer>

      {/* Main Content */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Container maxWidth="lg" sx={{ py: 3 }}>
          {/* Top Bar */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton
                onClick={() => setSidebarOpen(true)}
                sx={{ display: { xs: 'flex', md: 'none' }, color: colors.black }}
              >
                <MenuIcon />
              </IconButton>
              <Button
                component={Link}
                to="/learner/my-learning"
                startIcon={<ArrowBack />}
                size="small"
                sx={{ color: colors.black }}
              >
                Back
              </Button>
            </Box>

            {courseCertificate && (
              <Button
                variant="outlined"
                startIcon={<Download />}
                color="success"
                onClick={() => {
                  // Logic to download or view certificate
                  // Usually open PDF or view page. 
                  // For now, let's assume we navigate to a certificate view or proper download link if pdfUrl exists
                  if (courseCertificate.pdfUrl) {
                    window.open(courseCertificate.pdfUrl, '_blank');
                  } else {
                    // Fallback: View certificate details page (we might need to create this page)
                    // Or just show a toast "Certificate is being generated"
                    // Since we are creating it, let's navigate to a verify/view page if possible
                    // The backend returns a certificate object.
                    // Let's assume we can print it from TrainerCertifications VIEW logic, but that is for trainer.
                    // Learner needs a view. 
                    navigate(`/learner/certificates/${courseCertificate._id}`);
                  }
                }}
                sx={{
                  borderColor: '#2e7d32',
                  color: '#2e7d32',
                  '&:hover': {
                    bgcolor: 'rgba(46,125,50,0.05)',
                    borderColor: '#1b5e20'
                  }
                }}
              >
                Certificate
              </Button>
            )}
          </Box>

          {selectedLesson ? (
            <Box>
              {/* Video Player */}
              {(selectedLesson.videoUrl || selectedLesson.videoFile) && (
                <Paper sx={{ mb: 3, borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}>
                  <Box sx={{ position: 'relative', paddingTop: '56.25%', bgcolor: 'black' }}>
                    <ReactPlayer
                      url={selectedLesson.videoUrl || `${backendUrl}${selectedLesson.videoFile}`}
                      controls
                      width="100%"
                      height="100%"
                      style={{ position: 'absolute', top: 0, left: 0 }}
                    />
                  </Box>
                </Paper>
              )}

              {/* Lesson Info */}
              <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: colors.black }}>
                      {selectedLesson.title}
                    </Typography>
                    {selectedLesson.description ? (
                      <MarkdownRenderer content={selectedLesson.description} />
                    ) : selectedLesson.content ? (
                      <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                        {selectedLesson.content}
                      </Typography>
                    ) : (
                      <Typography variant="body1" color="text.secondary">
                        No description for this lesson.
                      </Typography>
                    )}
                  </Box>
                  <Button
                    variant={isSelectedLessonCompleted ? "outlined" : "contained"}
                    onClick={() => updateProgressMutation.mutate({ lessonId: selectedLesson._id, isCompleted: !isSelectedLessonCompleted })}
                    disabled={updateProgressMutation.isLoading}
                    startIcon={<CheckCircle />}
                    sx={{
                      ml: 2,
                      minWidth: 180,
                      bgcolor: isSelectedLessonCompleted ? 'transparent' : colors.chocolate,
                      borderColor: colors.chocolate,
                      color: isSelectedLessonCompleted ? colors.chocolate : 'white',
                      '&:hover': {
                        bgcolor: isSelectedLessonCompleted ? colors.cream : '#A67A52',
                        borderColor: colors.chocolate,
                      }
                    }}
                  >
                    {updateProgressMutation.isLoading ? 'Updating...' : (isSelectedLessonCompleted ? 'Completed ✓' : 'Mark Complete')}
                  </Button>
                </Box>

                {/* Downloadable Materials */}
                {selectedLesson.materials && selectedLesson.materials.length > 0 && (
                  <Box sx={{ mt: 3, pt: 3, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: colors.black }}>
                      📎 Downloadable Materials
                    </Typography>
                    <Stack spacing={1}>
                      {selectedLesson.materials.map((material, index) => (
                        <Button
                          key={index}
                          variant="outlined"
                          startIcon={<Download />}
                          href={`${backendUrl}${material.filePath}`}
                          target="_blank"
                          sx={{
                            justifyContent: 'flex-start',
                            textAlign: 'left',
                            borderColor: colors.chocolate,
                            color: colors.black,
                            '&:hover': {
                              borderColor: colors.chocolate,
                              bgcolor: colors.cream,
                            }
                          }}
                        >
                          {material.originalName || `Material ${index + 1}`}
                        </Button>
                      ))}
                    </Stack>
                  </Box>
                )}
              </Paper>

              {/* Assignments Section */}
              {assignments && assignments.length > 0 && (
                <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'white' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <Assignment sx={{ color: colors.chocolate, fontSize: 28 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.black }}>
                      Assignments
                    </Typography>
                    <Chip
                      label={assignments.length}
                      sx={{ bgcolor: colors.chocolate, color: 'white' }}
                      size="small"
                    />
                  </Box>
                  <Stack spacing={2}>
                    {assignments.map((assignment) => (
                      <Card key={assignment._id} variant="outlined" sx={{ borderColor: colors.cream, '&:hover': { boxShadow: 2, borderColor: colors.chocolate } }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: colors.black }}>
                                {assignment.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {assignment.description}
                              </Typography>
                              {assignment.dueDate && (
                                <Typography variant="caption" color="text.secondary">
                                  Due: {new Date(assignment.dueDate).toLocaleDateString()}
                                </Typography>
                              )}
                            </Box>
                            <Button
                              variant="contained"
                              onClick={() => navigate(`/learner/assignment/${assignment._id}`)}
                              sx={{
                                ml: 2,
                                bgcolor: colors.chocolate,
                                '&:hover': { bgcolor: '#A67A52' }
                              }}
                            >
                              View Assignment
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Paper>
              )}

              {/* Quizzes Section */}
              {quizzes && quizzes.length > 0 && (
                <Paper sx={{ p: 3, mb: 3, borderRadius: 2, bgcolor: 'white' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <Quiz sx={{ color: colors.black, fontSize: 28 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.black }}>
                      Quizzes
                    </Typography>
                    <Chip
                      label={quizzes.length}
                      sx={{ bgcolor: colors.black, color: 'white' }}
                      size="small"
                    />
                  </Box>
                  <Stack spacing={2}>
                    {quizzes.map((quiz) => (
                      <Card key={quiz._id} variant="outlined" sx={{ borderColor: colors.cream, '&:hover': { boxShadow: 2, borderColor: colors.black } }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: colors.black }}>
                                {quiz.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {quiz.description || 'Test your knowledge'}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                <Chip label={`${quiz.questions?.length || 0} Questions`} size="small" sx={{ bgcolor: colors.cream }} />
                                <Chip label={`${quiz.passingPercent || 70}% to pass`} size="small" sx={{ bgcolor: colors.cream }} />
                              </Box>
                            </Box>
                            <Button
                              variant="contained"
                              onClick={() => navigate(`/learner/quiz/${quiz._id}`)}
                              sx={{
                                ml: 2,
                                bgcolor: colors.black,
                                '&:hover': { bgcolor: '#333' }
                              }}
                            >
                              Take Quiz
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Paper>
              )}

              {/* Live Sessions Section */}
              {liveSessions && liveSessions.length > 0 && (
                <Paper sx={{ p: 3, borderRadius: 2, bgcolor: 'white' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <Event sx={{ color: colors.chocolate, fontSize: 28 }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: colors.black }}>
                      Live Sessions
                    </Typography>
                    <Chip
                      label={liveSessions.length}
                      sx={{ bgcolor: colors.chocolate, color: 'white' }}
                      size="small"
                    />
                  </Box>
                  <Stack spacing={2}>
                    {liveSessions.map((session) => (
                      <Card key={session._id} variant="outlined" sx={{ borderColor: colors.cream, '&:hover': { boxShadow: 2, borderColor: colors.chocolate } }}>
                        <CardContent>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: colors.black }}>
                            {session.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            {session.description}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                            <Chip
                              label={new Date(session.scheduledAt).toLocaleString()}
                              size="small"
                              icon={<Event />}
                              sx={{ bgcolor: colors.cream }}
                            />
                            {session.meetingLink && (
                              <Button
                                variant="outlined"
                                size="small"
                                href={session.meetingLink}
                                target="_blank"
                                sx={{
                                  borderColor: colors.chocolate,
                                  color: colors.chocolate,
                                  '&:hover': {
                                    borderColor: colors.chocolate,
                                    bgcolor: colors.cream,
                                  }
                                }}
                              >
                                Join Session
                              </Button>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                </Paper>
              )}
            </Box>
          ) : (
            <Paper sx={{ p: 8, textAlign: 'center', bgcolor: 'white' }}>
              <Typography variant="h5" color="text.secondary">
                Select a lesson to start learning
              </Typography>
            </Paper>
          )}
        </Container>
      </Box>
    </Box>
  );
};

export default CourseContent;
