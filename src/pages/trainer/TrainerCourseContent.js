
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
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CardMembership as CertificateIcon,
  ViewList as LayoutIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import AssignmentTab from './AssignmentTab';
import { format, addDays, eachDayOfInterval, startOfMonth, endOfMonth, addMonths, subMonths } from 'date-fns';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizTab from './QuizTab';
import LiveSessionTab from './LiveSessionTab';
import CertificateTab from './CertificateTab';
import QuizIcon from '@mui/icons-material/Quiz';
import CourseSettingsTab from './CourseSettingsTab';
import CurriculumTab from './CurriculumTab';
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
  const [certificates, setCertificates] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchData = async () => {
    if (!courseId) return;
    try {
      // Fetch course first
      const courseRes = await api.get(`/courses/${courseId}`);
      const courseData = courseRes.data?.data;

      if (courseData) {
        setCourse(courseData);
        // Then fetch related content
        const [lessonsRes, assignmentsRes, quizzesRes, certsRes, liveSessionsRes] = await Promise.all([
          api.get(`/lessons/course/${courseId}`),
          api.get(`/assignments/course/${courseId}`),
          api.get(`/quizzes/course/${courseId}`),
          api.get(`/certificates/course/${courseId}`), // Assuming this endpoint exists
          api.get(`/live-sessions/course/${courseId}`), // Fetch live sessions
        ]);

        setLessons(lessonsRes.data?.data || []);
        setAssignments(assignmentsRes.data?.data || []);
        setQuizzes(quizzesRes.data?.data || []);
        setCertificates(certsRes.data?.data || []);
        setLiveSessions(liveSessionsRes.data?.data || []);
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
          <Tab icon={<CertificateIcon />} iconPosition="start" label="Certificates" />
        </Tabs>
      </Paper>

      {/* Content Area */}
      <Paper sx={{ minHeight: '600px', p: 3, borderRadius: '0 0 12px 12px' }}>
        
        {/* CURRICULUM TAB */}
        {activeTab === 0 && (
          <CurriculumTab courseId={courseId} lessons={lessons} fetchData={fetchData} />
        )}

        {/* SETTINGS TAB */}
        {activeTab === 1 && (
          <CourseSettingsTab course={course} fetchData={fetchData} />
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

        {/* CERTIFICATES TAB */}
        {activeTab === 5 && (
          <CertificateTab courseId={courseId} certificates={certificates} course={course} />
        )}
      </Paper>
    </TrainerLayout>
  );
};

export default TrainerCourseContent;
