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
  Tabs,
  Tab,
  Stack,
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
} from '@mui/icons-material';
import ReactPlayer from 'react-player';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../utils/api';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CourseContent = () => {
  const { courseId, lessonId } = useParams();
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentTab, setCurrentTab] = useState(0);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch course data (lessons, title, etc.)
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

  // Fetch quizzes for the lesson
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


  // Fetch user's progress for this course
  const { data: progressData, isLoading: isProgressLoading } = useQuery(
    ['progress', courseId],
    async () => {
      const response = await api.get(`/progress/courses/${courseId}`);
      return response.data.data || [];
    },
    {
      enabled: !!courseId,
    }
  );

  useEffect(() => {
    if (courseData?.lessons && progressData) {
      const lessons = courseData.lessons;
      // If a lesson ID is in the URL, try to select that lesson
      if (lessonId) {
        const lessonFromUrl = lessons.find(l => l._id === lessonId);
        if (lessonFromUrl) {
          setSelectedLesson(lessonFromUrl);
          return;
        }
      }
      
      // Otherwise, determine the first uncompleted lesson
      const completedLessonIds = new Set(progressData.filter(p => p.isCompleted).map(p => p.lesson));
      const firstUncompleted = lessons.find(lesson => !completedLessonIds.has(lesson._id));
      
      // Select the first uncompleted lesson, or the very first lesson if all are complete or none started
      const lessonToSelect = firstUncompleted || lessons[0];

      if (lessonToSelect && lessonToSelect._id !== lessonId) {
        setSelectedLesson(lessonToSelect);
        navigate(`/learner/course/${courseId}/lessons/${lessonToSelect._id}`, { replace: true });
      } else if (lessonToSelect) {
        setSelectedLesson(lessonToSelect);
      }
    }
  }, [courseData, progressData, courseId, lessonId, navigate]);

  const updateProgressMutation = useMutation(
    ({ lessonId, isCompleted }) => api.post('/progress/lessons', { courseId, lessonId, isCompleted }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['progress', courseId]);
      },
    }
  );

  const lessons = courseData?.lessons || [];
  const completedLessonIds = new Set(progressData?.filter(p => p.isCompleted).map(p => p.lesson) || []);

  const handleLessonClick = (lesson) => {
    setSelectedLesson(lesson);
    navigate(`/learner/course/${courseId}/lessons/${lesson._id}`, { replace: true });
  };
  
  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };
  
  if (isCourseLoading || isProgressLoading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Loading course content...</Typography>
      </Container>
    );
  }

  if (!courseData) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5">Course not found</Typography>
        <Button component={Link} to="/learner/courses" startIcon={<ArrowBack />} sx={{ mt: 2 }}>
          Back to Courses
        </Button>
      </Container>
    );
  }

  const isSelectedLessonCompleted = selectedLesson && completedLessonIds.has(selectedLesson._id);
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';


  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button component={Link} to="/learner/courses" startIcon={<ArrowBack />} sx={{ mb: 2 }}>
          Back to All Courses
        </Button>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{courseData.title}</Typography>
        <Typography variant="body1" color="text.secondary">{courseData.description}</Typography>
      </Box>

      <Grid container spacing={4}>
        {/* Main Content Area (Left) */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: '16px', minHeight: '60vh' }}>
            {selectedLesson ? (
              <Box>
                {/* Video Player */}
                {(selectedLesson.videoUrl || selectedLesson.videoFile) && (
                  <Box sx={{ position: 'relative', paddingTop: '56.25%', mb: 3, bgcolor: 'black', borderRadius: '12px', overflow: 'hidden' }}>
                    <ReactPlayer
                      url={selectedLesson.videoUrl || `${backendUrl}${selectedLesson.videoFile}`}
                      controls
                      width="100%"
                      height="100%"
                      style={{ position: 'absolute', top: 0, left: 0 }}
                    />
                  </Box>
                )}

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={currentTab} onChange={handleTabChange} aria-label="lesson content tabs">
                    <Tab label="Description" icon={<DescriptionOutlined />} iconPosition="start" />
                    <Tab label="Assignments" icon={<Assignment />} iconPosition="start" />
                    <Tab label="Quizzes" icon={<Quiz />} iconPosition="start" />
                    <Tab label="Live Sessions" icon={<Event />} iconPosition="start" />
                  </Tabs>
                </Box>
                
                <TabPanel value={currentTab} index={0}>
                  {/* Lesson Title & Description */}
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>{selectedLesson.title}</Typography>
                  <Typography variant="body1" sx={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
                    {selectedLesson.description || selectedLesson.content || 'No description for this lesson.'}
                  </Typography>

                  {/* Mark as Complete/Incomplete Button */}
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant={isSelectedLessonCompleted ? "outlined" : "contained"}
                      color="primary"
                      onClick={() => updateProgressMutation.mutate({ lessonId: selectedLesson._id, isCompleted: !isSelectedLessonCompleted })}
                      disabled={updateProgressMutation.isLoading}
                      startIcon={<CheckCircle />}
                    >
                      {updateProgressMutation.isLoading ? 'Updating...' : (isSelectedLessonCompleted ? 'Mark as Incomplete' : 'Mark as Complete')}
                    </Button>
                  </Box>

                  {/* Downloadable Materials */}
                  {selectedLesson.materials && selectedLesson.materials.length > 0 && (
                    <Box sx={{ mt: 4, pt: 3, borderTop: 1, borderColor: 'divider' }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Downloadable Materials</Typography>
                      <Stack spacing={1}>
                        {selectedLesson.materials.map((material, index) => (
                          <Button
                            key={index}
                            component="a"
                            href={`${backendUrl}${material.filePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            startIcon={<Download />}
                            variant="outlined"
                            sx={{ justifyContent: 'flex-start' }}
                          >
                            {material.originalName} ({(material.fileSize / 1024).toFixed(1)} KB)
                          </Button>
                        ))}
                      </Stack>
                    </Box>
                  )}
                </TabPanel>

                <TabPanel value={currentTab} index={1}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Assignments</Typography>
                  <Typography>Lesson ID: {lessonId}</Typography>
                  {assignmentsLoading ? <CircularProgress /> : (
                    <Stack spacing={2}>
                      {assignments?.length > 0 ? assignments.map(assignment => (
                        <Paper key={assignment._id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography>{assignment.title}</Typography>
                          <Button variant="contained" onClick={() => navigate(`/learner/assignment/${assignment._id}`)}>View Assignment</Button>
                        </Paper>
                      )) : <Typography>No assignments for this lesson.</Typography>}
                    </Stack>
                  )}
                </TabPanel>

                <TabPanel value={currentTab} index={2}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Quizzes</Typography>
                  <Typography>Lesson ID: {lessonId}</Typography>
                  {quizzesLoading ? <CircularProgress /> : (
                    <Stack spacing={2}>
                      {quizzes?.length > 0 ? quizzes.map(quiz => (
                        <Paper key={quiz._id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography>{quiz.title}</Typography>
                          <Button variant="contained" onClick={() => navigate(`/learner/quiz/${quiz._id}`)}>Start Quiz</Button>
                        </Paper>
                      )) : <Typography>No quizzes for this lesson.</Typography>}
                    </Stack>
                  )}
                </TabPanel>
                
                <TabPanel value={currentTab} index={3}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Live Sessions</Typography>
                  {liveSessionsLoading ? <CircularProgress /> : (
                    <Stack spacing={2}>
                      {liveSessions?.map(session => (
                        <Paper key={session._id} sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Box>
                            <Typography>{session.title}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(session.scheduledAt).toLocaleString()}
                            </Typography>
                          </Box>
                          <Button variant="contained" component="a" href={session.meetingUrl} target="_blank" rel="noopener noreferrer">Join Session</Button>
                        </Paper>
                      ))}
                    </Stack>
                  )}
                </TabPanel>
                
              </Box>
            ) : (
              <Box sx={{ textAlign: 'center', pt: 8 }}>
                <Typography variant="h6" color="text.secondary">Select a lesson to begin.</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Curriculum Sidebar (Right) */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              bgcolor: 'rgba(32,47,50,0.03)',
              borderRadius: '16px',
              position: { md: 'sticky' },
              top: { md: 90 },
              maxHeight: { md: 'calc(100vh - 100px)' },
              overflowY: 'auto',
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 'bold', p: 2 }}>Course Curriculum</Typography>
            <List>
              {lessons.map((lesson, index) => (
                <ListItem key={lesson._id} disablePadding>
                  <ListItemButton
                    selected={selectedLesson?._id === lesson._id}
                    onClick={() => handleLessonClick(lesson)}
                    sx={{ borderRadius: '8px', mb: 1 }}
                  >
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      {lesson.videoUrl || lesson.videoFile ? (
                        <PlayCircleOutline color={selectedLesson?._id === lesson._id ? 'primary' : 'inherit'} />
                      ) : (
                        <DescriptionOutlined color={selectedLesson?._id === lesson._id ? 'primary' : 'inherit'} />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="body2" sx={{ fontWeight: selectedLesson?._id === lesson._id ? 'bold' : 'regular' }}>
                          {index + 1}. {lesson.title}
                        </Typography>
                      }
                      secondary={`${lesson.duration || 0} min`}
                    />
                    {completedLessonIds.has(lesson._id) && <CheckCircle color="success" fontSize="small" />}
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default CourseContent;
