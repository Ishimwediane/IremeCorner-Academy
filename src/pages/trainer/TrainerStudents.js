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
  IconButton,
  Button,
  Select,
  MenuItem,
  Checkbox,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useMemo, useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import TrainerLayout from '../../components/TrainerLayout';

const TrainerStudents = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');

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
    <TrainerLayout>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>Students</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: '#6366F1',
            '&:hover': { bgcolor: '#4F46E5' },
            borderRadius: '8px',
            textTransform: 'none'
          }}
        >
          Add student
        </Button>
      </Box>

      {/* Filters and Search Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: '12px' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search for students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#6B7280' }} />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <Select
              fullWidth
              size="small"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              displayEmpty
            >
              <MenuItem value="all">All filters</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6} md={2}>
            <Select
              fullWidth
              size="small"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              displayEmpty
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="grade">Avg. grade</MenuItem>
              <MenuItem value="age">Age</MenuItem>
            </Select>
          </Grid>
        </Grid>
      </Paper>

      {/* Students Table */}
      <Paper sx={{ borderRadius: '12px' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStudents(filteredStudents.map(s => s._id));
                      } else {
                        setSelectedStudents([]);
                      }
                    }}
                  />
                </TableCell>
                <TableCell>ID</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Age</TableCell>
                <TableCell>Class</TableCell>
                <TableCell>Avg. Grade</TableCell>
                <TableCell>Missing Days</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredStudents.map((student, index) => (
                <TableRow key={student._id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedStudents.includes(student._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStudents([...selectedStudents, student._id]);
                        } else {
                          setSelectedStudents(selectedStudents.filter(id => id !== student._id));
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar src={student.avatar} alt={student.name}>
                        {student.name?.charAt(0)}
                      </Avatar>
                      <Typography variant="body2">{student.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{student.gender || 'N/A'}</TableCell>
                  <TableCell>{student.age || 'N/A'}</TableCell>
                  <TableCell>{student.class || 'N/A'}</TableCell>
                  <TableCell>{student.avgGrade || 'N/A'}</TableCell>
                  <TableCell>{student.missingDays || 0}</TableCell>
                  <TableCell align="right">
                    <IconButton size="small">
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </TrainerLayout>
  );
};

export default TrainerStudents;

