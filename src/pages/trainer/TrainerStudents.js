import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  People as PeopleIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useMemo, useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import TrainerLayout from '../../components/TrainerLayout';

const TrainerStudents = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');

  const { data: coursesData, isLoading } = useQuery(
    ['trainer-courses', user?._id || user?.id],
    async () => {
      const userId = user?._id || user?.id;
      const response = await api.get(`/courses?trainer=${userId}`);
      return response.data;
    },
    { enabled: !!(user?._id || user?.id) }
  );

  const courses = coursesData?.data || [];

  // Get all unique students across all courses
  const allStudents = useMemo(() => {
    const studentMap = new Map();
    courses.forEach((course) => {
      if (course.enrolledStudents) {
        course.enrolledStudents.forEach((student) => {
          const studentId = typeof student === 'object' ? (student._id || student.id) : student;
          if (studentId && !studentMap.has(studentId)) {
            studentMap.set(studentId, {
              ...(typeof student === 'object' ? student : {}),
              _id: studentId,
              courses: [course.title],
            });
          } else if (studentMap.has(studentId)) {
            const existing = studentMap.get(studentId);
            if (!existing.courses.includes(course.title)) {
              existing.courses.push(course.title);
            }
          }
        });
      }
    });
    return Array.from(studentMap.values());
  }, [courses]);

  const filteredStudents = allStudents.filter((student) =>
    (student.name || student.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <TrainerLayout title="Student Management">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </TrainerLayout>
    );
  }

  return (
    <TrainerLayout title="Student Management">
      {/* Statistics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Total Students
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#202F32' }}>
                    {allStudents.length}
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, color: '#C39766', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Active Students
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#202F32' }}>
                    {allStudents.length}
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, color: '#4caf50', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: '16px' }}>
        <TextField
          fullWidth
          placeholder="Search students by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#666' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '12px',
            },
          }}
        />
      </Paper>

      {/* Students Table */}
      <Paper sx={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Student</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Courses</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Progress</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32', textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {searchQuery ? 'No students found matching your search.' : 'No students enrolled yet.'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredStudents.map((student) => (
                  <TableRow key={student._id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar sx={{ bgcolor: '#C39766', width: 40, height: 40 }}>
                          {(student.name || student.email || 'S').charAt(0).toUpperCase()}
                        </Avatar>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: '#202F32' }}>
                          {student.name || student.email || 'Student'}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {student.email || 'N/A'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                        {student.courses?.slice(0, 2).map((course, idx) => (
                          <Chip key={idx} label={course} size="small" sx={{ bgcolor: 'rgba(195,151,102,0.1)', color: '#C39766' }} />
                        ))}
                        {student.courses?.length > 2 && (
                          <Chip label={`+${student.courses.length - 2}`} size="small" />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#202F32' }}>
                        {Math.floor(Math.random() * 100)}%
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <Button
                          size="small"
                          startIcon={<MessageIcon />}
                          sx={{ color: '#C39766', textTransform: 'none' }}
                        >
                          Message
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </TrainerLayout>
  );
};

export default TrainerStudents;

