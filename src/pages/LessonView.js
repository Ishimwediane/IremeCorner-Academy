import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import {
  CheckCircle,
  ArrowBack,
  ArrowForward,
} from '@mui/icons-material';
import ReactPlayer from 'react-player';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../utils/api';
import { toast } from 'react-toastify';

const LessonView = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get enrollment data to check completed lessons
  const { data: enrollmentData } = useQuery(
    ['enrollment', courseId],
    async () => {
      const response = await api.get('/enrollments');
      const enrollments = response.data.data || [];
      return enrollments.find(e => 
        e.course._id === courseId || e.course === courseId
      );
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
    }
  );

  const { data: lessonsData } = useQuery(
    ['lessons', courseId],
    async () => {
      const response = await api.get(`/lessons/course/${courseId}`);
      return response.data;
    }
  );

  const { data: lessonData, isLoading } = useQuery(
    ['lesson', lessonId],
    async () => {
      const response = await api.get(`/lessons/${lessonId}`);
      return response.data;
    }
  );

  const lesson = lessonData?.data;
  const lessons = lessonsData?.data || [];
  const currentIndex = lessons.findIndex((l) => l._id === lessonId);
  const nextLesson = lessons[currentIndex + 1];
  const prevLesson = lessons[currentIndex - 1];

  // Check if current lesson is completed
  const completedLessons = enrollmentData?.completedLessons || [];
  const isLessonCompleted = completedLessons.some(
    (id) => id === lessonId || id._id === lessonId || id.toString() === lessonId
  );

  const progressMutation = useMutation(
    async () => {
      if (!enrollmentData) {
        throw new Error('You must be enrolled in this course');
      }

      // Mark this specific lesson as complete
      await api.put(`/enrollments/${enrollmentData._id}/progress`, {
        lessonId: lessonId,
      });
    },
    {
      onSuccess: () => {
        // Invalidate all related queries
        queryClient.invalidateQueries(['enrollment', courseId]);
        queryClient.invalidateQueries('my-enrollments');
        queryClient.invalidateQueries(['lessons', courseId]);
        toast.success(`Lesson ${currentIndex + 1} marked as complete!`);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to mark lesson as complete');
      },
    }
  );

  const handleComplete = () => {
    if (!isLessonCompleted) {
      progressMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <Container sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (!lesson) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Lesson not found</Alert>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBack />}
          component={Link}
          to={`/courses/${courseId}`}
          sx={{ mb: 2 }}
        >
          Back to Course
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
              {lesson.title}
            </Typography>
            <Divider sx={{ my: 2 }} />

            {lesson.videoUrl || lesson.videoFile ? (
              <Box sx={{ mb: 3 }}>
                <ReactPlayer
                  url={lesson.videoUrl || `https://academy-server-f60a.onrender.com${lesson.videoFile}`}
                  controls
                  width="100%"
                  height="400px"
                />
              </Box>
            ) : null}

            {lesson.content && (
              <Box
                sx={{
                  mb: 3,
                  '& p': { mb: 2 },
                }}
                dangerouslySetInnerHTML={{ __html: lesson.content }}
              />
            )}

            {lesson.materials && lesson.materials.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Learning Materials
                </Typography>
                <List>
                  {lesson.materials.map((material, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={material.originalName}
                        secondary={material.fileType}
                      />
                      <Button
                        size="small"
                        href={`https://academy-server-f60a.onrender.com${material.filePath}`}
                        target="_blank"
                      >
                        Download
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Divider sx={{ my: 3 }} />
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mt: 3 }}>
              {isLessonCompleted ? (
                <Alert severity="success" sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle />
                    <Typography variant="body1">
                      Chapter {currentIndex + 1} Completed!
                    </Typography>
                  </Box>
                </Alert>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  size="large"
                  onClick={handleComplete}
                  disabled={progressMutation.isLoading || !enrollmentData}
                  startIcon={<CheckCircle />}
                  sx={{ flexGrow: 1 }}
                >
                  {progressMutation.isLoading
                    ? 'Marking as Complete...'
                    : `Mark Chapter ${currentIndex + 1} as Complete`}
                </Button>
              )}
            </Box>
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() =>
                prevLesson &&
                navigate(`/courses/${courseId}/lessons/${prevLesson._id}`)
              }
              disabled={!prevLesson}
            >
              Previous Lesson
            </Button>
            <Button
              endIcon={<ArrowForward />}
              onClick={() =>
                nextLesson &&
                navigate(`/courses/${courseId}/lessons/${nextLesson._id}`)
              }
              disabled={!nextLesson}
            >
              Next Lesson
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, position: 'sticky', top: 20 }}>
            <Typography variant="h6" gutterBottom>
              Course Lessons
            </Typography>
            <List>
              {lessons.map((l, index) => {
                const isCompleted = completedLessons.some(
                  (id) => id === l._id || id._id === l._id || id.toString() === l._id
                );
                const isCurrent = l._id === lessonId;
                
                return (
                  <ListItem
                    key={l._id}
                    button
                    component={Link}
                    to={`/courses/${courseId}/lessons/${l._id}`}
                    selected={isCurrent}
                    sx={{
                      backgroundColor: isCurrent ? 'action.selected' : 'transparent',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      {isCompleted ? (
                        <CheckCircle
                          color="secondary"
                          sx={{ mr: 1, fontSize: 20 }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            border: '2px solid',
                            borderColor: 'text.secondary',
                            mr: 1,
                          }}
                        />
                      )}
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: isCurrent ? 'bold' : 'normal' }}
                            >
                              Chapter {index + 1}: {l.title}
                            </Typography>
                          </Box>
                        }
                        secondary={l.duration ? `${l.duration} min` : ''}
                      />
                    </Box>
                  </ListItem>
                );
              })}
            </List>
            {enrollmentData && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Progress: {enrollmentData.progress}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {completedLessons.length} of {lessons.length} chapters completed
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LessonView;




