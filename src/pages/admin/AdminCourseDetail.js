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
import AssignmentTab from '../trainer/AssignmentTab';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizTab from '../trainer/QuizTab';
import LiveSessionTab from '../trainer/LiveSessionTab';
import CertificateTab from '../trainer/CertificateTab';
import QuizIcon from '@mui/icons-material/Quiz';
import CourseSettingsTab from '../trainer/CourseSettingsTab';
import CurriculumTab from '../trainer/CurriculumTab';
import DuoIcon from '@mui/icons-material/Duo';

const AdminCourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [liveSessions, setLiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const courseRes = await api.get(`/courses/${id}`);
      const courseData = courseRes.data?.data;

      if (courseData) {
        setCourse(courseData);
        setLessons(courseData.lessons || []);

        const [assignmentsRes, quizzesRes, certsRes, liveSessionsRes] = await Promise.all([
          api.get(`/assignments/course/${id}`),
          api.get(`/quizzes/course/${id}`),
          api.get(`/certificates?course=${id}`),
          api.get(`/live-sessions/course/${id}`),
        ]);

        setAssignments(assignmentsRes.data?.data || []);
        setQuizzes(quizzesRes.data?.data || []);
        setCertificates(certsRes.data?.data || []);
        setLiveSessions(liveSessionsRes.data?.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch course content for admin:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!course) {
    return <Typography sx={{ textAlign: 'center', mt: 4 }}>Course not found</Typography>;
  }

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => navigate('/admin/courses')} sx={{ bgcolor: 'white', border: '1px solid #e0e0e0' }}>
            <ArrowBackIcon />
          </IconButton>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>{course.title}</Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5, color: 'text.secondary' }}>
              <Chip label={course.status} size="small" color={course.status === 'approved' ? 'success' : 'warning'} />
              <Typography variant="body2">•</Typography>
              <Typography variant="body2">{lessons.length} Lessons</Typography>
              <Typography variant="body2">•</Typography>
              <Typography variant="body2">{course.duration} Hours Total</Typography>
            </Box>
          </Box>
        </Box>
        <Button variant="outlined">Preview Course</Button>
      </Box>

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

      <Paper sx={{ minHeight: '600px', p: 3, borderRadius: '0 0 12px 12px' }}>
        {activeTab === 0 && <CurriculumTab courseId={id} lessons={lessons} fetchData={fetchData} />}
        {activeTab === 1 && <CourseSettingsTab course={course} fetchData={fetchData} />}
        {activeTab === 2 && <AssignmentTab courseId={id} assignments={assignments} course={course} fetchData={fetchData} />}
        {activeTab === 3 && <QuizTab courseId={id} quizzes={quizzes} course={course} fetchData={fetchData} />}
        {activeTab === 4 && <LiveSessionTab courseId={id} liveSessions={liveSessions} fetchData={fetchData} />}
        {activeTab === 5 && <CertificateTab courseId={id} certificates={certificates} course={course} />}
      </Paper>
    </>
  );
};

export default AdminCourseDetail;