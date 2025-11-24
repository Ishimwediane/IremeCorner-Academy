import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Button,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Avatar,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  School,
  Person,
  Assessment,
  Quiz,
  Assignment,
  PlayCircleOutline,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import api from '../../utils/api';

const AdminCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const { data: course, isLoading: courseLoading, error: courseError } = useQuery(
    ['admin-course-detail', id],
    async () => {
      const response = await api.get(`/courses/${id}`);
      return response.data.data;
    }
  );

  const { data: lessons, isLoading: lessonsLoading } = useQuery(
    ['admin-course-lessons', id],
    async () => {
      const response = await api.get(`/lessons/course/${id}`);
      return response.data.data;
    },
    { enabled: !!course }
  );

  if (courseLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (courseError || !course) {
    return <Alert severity="error">Could not load course details.</Alert>;
  }

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button startIcon={<ArrowBack />} onClick={() => navigate('/admin/courses')}>
          Back to All Courses
        </Button>
        <Button variant="contained" startIcon={<Edit />} onClick={() => navigate(`/admin/edit-course/${id}`)}>
          Edit Course
        </Button>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={2}>
            <Avatar
              src={course.thumbnail}
              variant="rounded"
              sx={{ width: '100%', height: 'auto', aspectRatio: '1 / 1' }}
            >
              <School />
            </Avatar>
          </Grid>
          <Grid item xs={12} md={10}>
            <Typography variant="h4" fontWeight="700">{course.title}</Typography>
            <Typography variant="body1" color="text.secondary" paragraph>
              {course.description}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
              <Chip label={course.category} size="small" />
              <Chip label={course.level} size="small" color="primary" />
              <Chip
                label={course.status}
                size="small"
                color={course.status === 'approved' ? 'success' : 'warning'}
              />
              <Chip icon={<Person />} label={`${course.enrolledStudents?.length || 0} Students`} size="small" />
              <Chip icon={<School />} label={course.trainer?.name || 'N/A'} size="small" />
            </Box>
          </Grid>
        </Grid>
      </Paper>

      <Paper>
        <Tabs value={tab} onChange={handleTabChange} centered>
          <Tab icon={<School />} label="Curriculum" />
          <Tab icon={<Assessment />} label="Assignments" />
          <Tab icon={<Quiz />} label="Quizzes" />
          <Tab icon={<Person />} label="Enrolled Students" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {tab === 0 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Course Lessons</Typography>
              {lessonsLoading ? (
                <CircularProgress />
              ) : (
                <List>
                  {lessons && lessons.length > 0 ? (
                    lessons.map((lesson, index) => (
                      <ListItem
                        key={lesson._id}
                        button
                        component={Link}
                        to={`/courses/${course._id}/lessons/${lesson._id}`}
                        divider
                      >
                        <ListItemIcon>
                          <PlayCircleOutline />
                        </ListItemIcon>
                        <ListItemText
                          primary={`Chapter ${index + 1}: ${lesson.title}`}
                          secondary={`${lesson.duration || 0} min`}
                        />
                      </ListItem>
                    ))
                  ) : (
                    <Typography color="text.secondary">No lessons have been added to this course yet.</Typography>
                  )}
                </List>
              )}
            </Box>
          )}
          {tab === 1 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Assignments</Typography>
              <Typography color="text.secondary">Assignment management is not yet implemented.</Typography>
            </Box>
          )}
          {tab === 2 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Quizzes</Typography>
              <Typography color="text.secondary">Quiz management is not yet implemented.</Typography>
            </Box>
          )}
          {tab === 3 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Enrolled Students</Typography>
              {course.enrolledStudents && course.enrolledStudents.length > 0 ? (
                <List>
                  {course.enrolledStudents.map((student) => (
                    <ListItem key={student._id} divider>
                      <ListItemText
                        primary={student.name}
                        secondary={student.email}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">No students are enrolled in this course.</Typography>
              )}
            </Box>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default AdminCourseDetail;