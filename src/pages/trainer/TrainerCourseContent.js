
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
  People as PeopleIcon,
} from '@mui/icons-material';
import AssignmentTab from './AssignmentTab';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuizTab from './QuizTab';
import LiveSessionTab from './LiveSessionTab';
import CertificateTab from './CertificateTab';
import QuizIcon from '@mui/icons-material/Quiz';
import CourseSettingsTab from './CourseSettingsTab';
import CurriculumTab from './CurriculumTab';
import DuoIcon from '@mui/icons-material/Duo';
import StudentsTab from './StudentsTab';
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

  const fetchData = React.useCallback(async () => {
    if (!courseId) return;
    try {
      // Fetch course first
      const courseRes = await api.get(`/courses/${courseId}`);
      const courseData = courseRes.data?.data;

      if (courseData) {
        setCourse(courseData);
        setLessons(courseData.lessons || []); // Use lessons populated from the course endpoint

        // Then fetch related content
        const [assignmentsRes, quizzesRes, certsRes, liveSessionsRes] = await Promise.all([
          api.get(`/assignments/course/${courseId}`),
          api.get(`/quizzes/course/${courseId}`), // Corrected this line
          api.get(`/certificates?course=${courseId}`), // Corrected endpoint for certificates
          api.get(`/live-sessions/course/${courseId}`), // Fetch live sessions
        ]);

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
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCreateLessonLocal = (newLessonData) => {
    const newLesson = {
      _id: `new-${Date.now()}`, // Temporary ID
      ...newLessonData,
      materials: newLessonData.materials.map(f => ({ originalName: f.name, fileSize: f.size })),
    };
    setLessons(prevLessons => [...prevLessons, newLesson]);
  };

  const handleUpdateLessonLocal = (lessonId, updatedLessonData) => {
    setLessons(prevLessons =>
      prevLessons.map(lesson =>
        lesson._id === lessonId
          ? {
            ...lesson,
            ...updatedLessonData,
            materials: [...(updatedLessonData.existingMaterials || []), ...updatedLessonData.materials.map(f => ({ originalName: f.name, fileSize: f.size }))]
          }
          : lesson
      )
    );
  };

  const handleDeleteLessonLocal = (lessonId) => {
    setLessons(prevLessons => prevLessons.filter(lesson => lesson._id !== lessonId));
  };

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
          <IconButton onClick={() => navigate('/trainer/courses')} sx={{ bgcolor: 'white', border: '1px solid #e0e0e0', borderRadius: 0 }}>
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
          <Button variant="outlined" size="small" sx={{ borderRadius: 0 }}>
            Preview Course
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Paper sx={{ borderBottom: 1, borderColor: 'divider', borderRadius: 0 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ '& .MuiTab-root': { textTransform: 'none' } }}>
          <Tab icon={<LayoutIcon />} iconPosition="start" label="Curriculum" />
          <Tab icon={<SettingsIcon />} iconPosition="start" label="Course Info & Settings" />
          <Tab icon={<AssignmentIcon />} iconPosition="start" label="Assignments" />
          <Tab icon={<QuizIcon />} iconPosition="start" label="Quizzes" />
          <Tab icon={<DuoIcon />} iconPosition="start" label="Live Sessions" />
          <Tab icon={<CertificateIcon />} iconPosition="start" label="Certificates" />
          <Tab icon={<PeopleIcon />} iconPosition="start" label="Students" />
        </Tabs>
      </Paper>

      {/* Content Area */}
      <Paper sx={{ minHeight: '600px', p: 3, borderRadius: 0 }}>

        {/* CURRICULUM TAB */}
        {activeTab === 0 && (
          <CurriculumTab
            lessons={lessons}
            courseId={courseId}
            fetchData={fetchData}
            onCreateLesson={handleCreateLessonLocal}
            onUpdateLesson={handleUpdateLessonLocal}
            onDeleteLesson={handleDeleteLessonLocal}
          />
        )}

        {/* SETTINGS TAB */}
        {activeTab === 1 && (
          <CourseSettingsTab course={course} fetchData={fetchData} />
        )}

        {/* ASSIGNMENTS TAB */}
        {activeTab === 2 && (
          <AssignmentTab courseId={courseId} assignments={assignments} course={course} fetchData={fetchData} />
        )}

        {/* QUIZZES TAB */}
        {activeTab === 3 && (
          <QuizTab courseId={courseId} quizzes={quizzes} course={course} fetchData={fetchData} />
        )}

        {/* LIVE SESSIONS TAB */}
        {activeTab === 4 && (
          <LiveSessionTab courseId={courseId} liveSessions={liveSessions} fetchData={fetchData} />
        )}

        {/* CERTIFICATES TAB */}
        {activeTab === 5 && (
          <CertificateTab courseId={courseId} certificates={certificates} course={course} />
        )}

        {/* STUDENTS TAB */}
        {activeTab === 6 && (
          <StudentsTab courseId={courseId} />
        )}
      </Paper>
    </TrainerLayout>
  );
};

export default TrainerCourseContent;
