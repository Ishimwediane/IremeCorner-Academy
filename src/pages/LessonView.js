import React, { useState } from 'react';
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
  PlayArrow,
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
  const [completed, setCompleted] = useState(false);

  const { data: courseData } = useQuery(
    ['course', courseId],
    async () => {
      const response = await api.get(`/courses/${courseId}`);
      return response.data;
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

  const progressMutation = useMutation(
    async () => {
      const enrollment = await api.get('/enrollments').then((res) =>
        res.data.data.find((e) => e.course._id === courseId || e.course === courseId)
      );

      if (enrollment) {
        await api.put(`/enrollments/${enrollment._id}/progress`, {
          lessonId,
          progress: Math.min(
            100,
            Math.round(
              ((currentIndex + 1) / lessons.length) * 100
            )
          ),
        });
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['enrollments']);
        setCompleted(true);
        toast.success('Progress updated!');
      },
    }
  );

  const handleComplete = () => {
    if (!completed) {
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
                  url={lesson.videoUrl || `http://localhost:5001${lesson.videoFile}`}
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
                        href={`http://localhost:5001${material.filePath}`}
                        target="_blank"
                      >
                        Download
                      </Button>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
              {completed && (
                <Alert severity="success" sx={{ flexGrow: 1 }}>
                  Lesson completed!
                </Alert>
              )}
              <Button
                variant="contained"
                onClick={handleComplete}
                disabled={completed || progressMutation.isLoading}
                startIcon={<CheckCircle />}
              >
                {completed ? 'Completed' : 'Mark as Complete'}
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
              {lessons.map((l, index) => (
                <ListItem
                  key={l._id}
                  button
                  component={Link}
                  to={`/courses/${courseId}/lessons/${l._id}`}
                  selected={l._id === lessonId}
                >
                  <ListItemText
                    primary={`${index + 1}. ${l.title}`}
                    secondary={l.duration ? `${l.duration} min` : ''}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default LessonView;

