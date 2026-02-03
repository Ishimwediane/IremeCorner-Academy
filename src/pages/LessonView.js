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
import MarkdownRenderer from '../components/MarkdownRenderer';

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
        {/* Chapter Sidebar - LEFT SIDE */}
        <Grid item xs={12} md={3}>
          <Paper sx={{
            p: 2,
            position: 'sticky',
            top: 20,
            bgcolor: 'rgba(32,47,50,0.03)',
            borderRadius: 2,
            maxHeight: 'calc(100vh - 100px)',
            overflowY: 'auto'
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, color: '#202F32', mb: 3 }}>
              Course Chapters
            </Typography>
            <List sx={{ p: 0 }}>
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
                      mb: 1,
                      borderRadius: 1,
                      backgroundColor: isCurrent ? '#C39766' : 'transparent',
                      color: isCurrent ? 'white' : 'inherit',
                      '&:hover': {
                        backgroundColor: isCurrent ? '#A67A52' : 'rgba(195,151,102,0.1)',
                      },
                      transition: 'all 0.2s',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                      {isCompleted ? (
                        <CheckCircle
                          sx={{
                            mr: 1.5,
                            fontSize: 20,
                            color: isCurrent ? 'white' : '#2E7D32'
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            border: '2px solid',
                            borderColor: isCurrent ? 'white' : 'rgba(32,47,50,0.3)',
                            mr: 1.5,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              fontSize: '0.65rem',
                              color: isCurrent ? 'white' : 'text.secondary',
                              fontWeight: 600
                            }}
                          >
                            {index + 1}
                          </Typography>
                        </Box>
                      )}
                      <ListItemText
                        primary={
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: isCurrent ? 700 : 500,
                              color: isCurrent ? 'white' : '#202F32',
                              fontSize: '0.9rem'
                            }}
                          >
                            {l.title}
                          </Typography>
                        }
                        secondary={
                          l.duration ? (
                            <Typography
                              variant="caption"
                              sx={{
                                color: isCurrent ? 'rgba(255,255,255,0.8)' : 'text.secondary',
                                fontSize: '0.75rem'
                              }}
                            >
                              {l.duration} min
                            </Typography>
                          ) : null
                        }
                      />
                    </Box>
                  </ListItem>
                );
              })}
            </List>
            {progressData && (
              <Box sx={{ mt: 3, p: 2, bgcolor: 'rgba(195,151,102,0.1)', borderRadius: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#202F32', mb: 0.5 }}>
                  Your Progress
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#C39766', mb: 0.5 }}>
                  {Math.round((completedLessons.filter(p => p.isCompleted).length / lessons.length) * 100)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {completedLessons.filter(p => p.isCompleted).length} of {lessons.length} chapters completed
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Main Content - RIGHT SIDE */}
        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, color: '#202F32' }}>
              {lesson.title}
            </Typography>
            <Divider sx={{ my: 2 }} />

            {/* Debug logging */}
            {console.log('=== LESSON OBJECT ===', lesson)}
            {console.log('Has description?', !!lesson.description)}
            {console.log('Has content?', !!lesson.content)}
            {console.log('Description preview:', lesson.description?.substring(0, 100))}

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

            {lesson.description && (
              <Box sx={{ mb: 3 }}>
                <MarkdownRenderer content={lesson.description} />
              </Box>
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
                sx={{
                  flexGrow: 1,
                  bgcolor: isLessonCompleted ? 'transparent' : '#2E7D32',
                  '&:hover': {
                    bgcolor: isLessonCompleted ? 'transparent' : '#1B5E20'
                  }
                }}
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
              variant="outlined"
              sx={{
                borderColor: '#C39766',
                color: '#C39766',
                '&:hover': {
                  borderColor: '#A67A52',
                  bgcolor: 'rgba(195,151,102,0.05)'
                }
              }}
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
              variant="contained"
              sx={{
                bgcolor: '#C39766',
                '&:hover': {
                  bgcolor: '#A67A52'
                }
              }}
            >
              Next Lesson
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LessonView;















