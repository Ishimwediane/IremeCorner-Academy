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

  // Get lesson progress for the current user and course
  const { data: progressData } = useQuery(
    ['progress', courseId],
    async () => {
      const response = await api.get(`/progress/courses/${courseId}`);
      return response.data.data || [];
    },
    {
      refetchOnWindowFocus: false,
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

  React.useEffect(() => {
    if (lesson) {
      console.log('Lesson data:', lesson);
    }
  }, [lesson]);

  const lesson = lessonData?.data;
  const lessons = lessonsData?.data || [];
  const currentIndex = lessons.findIndex((l) => l._id === lessonId);
  const nextLesson = lessons[currentIndex + 1];
  const prevLesson = lessons[currentIndex - 1];

  // Check if current lesson is completed
  const completedLessons = progressData || [];
  const isLessonCompleted = completedLessons.some(
    (p) => p.lesson === lessonId && p.isCompleted
  );

  const progressMutation = useMutation(
    async (isCompleted) => {
      await api.post('/progress/lessons', {
        lessonId,
        courseId,
        isCompleted,
      });
    },
    {
      onSuccess: (_, isCompleted) => {
        queryClient.invalidateQueries(['progress', courseId]);
        if (isCompleted) {
          toast.success(`Lesson ${currentIndex + 1} marked as complete!`);
        } else {
          toast.info(`Lesson ${currentIndex + 1} marked as incomplete.`);
        }
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update lesson progress');
      },
    }
  );

  const handleComplete = () => {
    progressMutation.mutate(!isLessonCompleted);
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
              <Button
                variant={isLessonCompleted ? "outlined" : "contained"}
                color="secondary"
                size="large"
                onClick={handleComplete}
                disabled={progressMutation.isLoading}
                startIcon={<CheckCircle />}
                sx={{ flexGrow: 1 }}
              >
                {progressMutation.isLoading
                  ? 'Updating...'
                  : isLessonCompleted
                  ? `Mark as Incomplete`
                  : `Mark Chapter ${currentIndex + 1} as Complete`}
              </Button>
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
                  (p) => p.lesson === l._id && p.isCompleted
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
            {progressData && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.light', borderRadius: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Progress: {Math.round((completedLessons.filter(p => p.isCompleted).length / lessons.length) * 100)}%
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {completedLessons.filter(p => p.isCompleted).length} of {lessons.length} chapters completed
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















