import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Grid,
  ListItemIcon,
} from '@mui/material';
import { ArrowBack, ArrowForward, PlayCircleOutline } from '@mui/icons-material';
import ReactPlayer from 'react-player';
import { useQuery } from 'react-query';
import api from '../../utils/api';

const AdminLessonView = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();

  const { data: lesson, isLoading: lessonLoading } = useQuery(
    ['admin-lesson', lessonId],
    async () => {
      const response = await api.get(`/lessons/${lessonId}`);
      return response.data.data;
    }
  );

  const { data: allLessons, isLoading: lessonsLoading } = useQuery(
    ['admin-course-lessons', courseId],
    async () => {
      const response = await api.get(`/lessons/course/${courseId}`);
      return response.data.data;
    }
  );

  const lessons = allLessons || [];
  const currentIndex = lessons.findIndex((l) => l._id === lessonId);
  const nextLesson = lessons[currentIndex + 1];
  const prevLesson = lessons[currentIndex - 1];

  if (lessonLoading || lessonsLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!lesson) {
    return <Alert severity="error">Lesson not found.</Alert>;
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(`/admin/courses/${courseId}`)}
        sx={{ mb: 3, color: '#FD7E14', textTransform: 'none' }}
      >
        Back to Course Details
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: 0 }}>
            <Typography variant="h4" gutterBottom>{lesson.title}</Typography>
            <Divider sx={{ my: 2 }} />

            {lesson.videoUrl || lesson.videoFile ? (
              <Box sx={{ mb: 3, position: 'relative', paddingTop: '56.25%' }}>
                <ReactPlayer
                  url={lesson.videoUrl || `https://academy-server-f60a.onrender.com${lesson.videoFile}`}
                  controls
                  width="100%"
                  height="100%"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                />
              </Box>
            ) : null}

            {lesson.content && (
              <Box sx={{ mb: 3 }} dangerouslySetInnerHTML={{ __html: lesson.content }} />
            )}
          </Paper>

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(`/admin/courses/${courseId}/lessons/${prevLesson._id}`)}
              disabled={!prevLesson}
              sx={{ color: '#FD7E14', textTransform: 'none', '&.Mui-disabled': { color: 'action.disabled' } }}
            >
              Previous Lesson
            </Button>
            <Button
              endIcon={<ArrowForward />}
              onClick={() => navigate(`/admin/courses/${courseId}/lessons/${nextLesson._id}`)}
              disabled={!nextLesson}
              sx={{ color: '#FD7E14', textTransform: 'none', '&.Mui-disabled': { color: 'action.disabled' } }}
            >
              Next Lesson
            </Button>
          </Box>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, position: 'sticky', top: 20, borderRadius: 0 }}>
            <Typography variant="h6" gutterBottom>Course Curriculum</Typography>
            <List>
              {lessons.map((l, index) => {
                const isCurrent = l._id === lessonId;
                return (
                  <ListItem
                    key={l._id}
                    button
                    component={Link}
                    to={`/admin/courses/${courseId}/lessons/${l._id}`}
                    selected={isCurrent}
                  >
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <PlayCircleOutline sx={{ color: isCurrent ? '#FD7E14' : 'inherit' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={`Chapter ${index + 1}: ${l.title}`}
                      primaryTypographyProps={{
                        fontWeight: isCurrent ? 'bold' : 'normal',
                        color: isCurrent ? '#FD7E14' : 'text.primary',
                      }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminLessonView;