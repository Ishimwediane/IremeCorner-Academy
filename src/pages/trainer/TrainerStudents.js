import React, { useState, useMemo } from 'react';
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
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Alert,
  Snackbar,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  Download as DownloadIcon,
  Print as PrintIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Mail as MailIcon,
  CardMembership as CertificateIcon,
} from '@mui/icons-material';
import { useQuery, useMutation } from 'react-query';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import TrainerLayout from '../../components/TrainerLayout';

const TrainerStudents = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [sortBy, setSortBy] = useState('name');
  const [filterBy, setFilterBy] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [classFilter, setClassFilter] = useState('all');

  // Certificate Issuance State
  const [certDialogOpen, setCertDialogOpen] = useState(false);
  const [selectedCourseForCert, setSelectedCourseForCert] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState({ open: false, message: '', severity: 'success' });

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
              courseIds: [course._id] // Track course IDs
            });
          } else if (studentMap.has(studentId)) {
            const existing = studentMap.get(studentId);
            if (!existing.courses.includes(course.title)) {
              existing.courses.push(course.title);
              existing.courseIds.push(course._id);
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

  const handleExportData = () => {
    const csvData = filteredStudents.map(student => ({
      ID: student._id,
      Name: student.name,
      Gender: student.gender,
      Age: student.age,
      Class: student.class,
      'Average Grade': student.avgGrade,
      'Missing Days': student.missingDays
    }));

    const csvString = [
      Object.keys(csvData[0]),
      ...csvData.map(row => Object.values(row))
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'students.csv';
    a.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleActionClick = (event, student) => {
    setAnchorEl(event.currentTarget);
    setSelectedStudent(student);
  };

  const handleActionClose = () => {
    setAnchorEl(null);
    setSelectedStudent(null);
  };

  const handleSelectAllStudents = (e) => {
    if (e.target.checked) {
      setSelectedStudents(filteredStudents.map(s => s._id));
    } else {
      setSelectedStudents([]);
    }
  };

  const handleStudentSelect = (studentId) => {
    if (selectedStudents.includes(studentId)) {
      setSelectedStudents(selectedStudents.filter(id => id !== studentId));
    } else {
      setSelectedStudents([...selectedStudents, studentId]);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilterChange = (e) => {
    setFilterBy(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleClassFilterChange = (e) => {
    setClassFilter(e.target.value);
  };

  // Certificate Issuance Logic
  const issueCertificateMutation = useMutation(
    async (data) => {
      const response = await api.post('/certificates/issue', data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setFeedbackMessage({ open: true, message: 'Certificate issued successfully!', severity: 'success' });
        setCertDialogOpen(false);
        handleActionClose();
      },
      onError: (error) => {
        setFeedbackMessage({
          open: true,
          message: error.response?.data?.message || 'Failed to issue certificate',
          severity: 'error'
        });
      }
    }
  );

  const handleIssueCertificateClick = () => {
    if (!selectedStudent) return;

    // If student is in only one course, auto-select it
    if (selectedStudent.courseIds && selectedStudent.courseIds.length === 1) {
      setSelectedCourseForCert(selectedStudent.courseIds[0]);
    } else {
      setSelectedCourseForCert(''); // Reset selection for manual pick
    }
    setCertDialogOpen(true);
    setAnchorEl(null); // Close menu, keep selected student
  };

  const handleConfirmIssueCertificate = () => {
    if (!selectedCourseForCert) {
      setFeedbackMessage({ open: true, message: 'Please select a course', severity: 'warning' });
      return;
    }
    issueCertificateMutation.mutate({
      studentId: selectedStudent._id,
      courseId: selectedCourseForCert
    });
  };

  const filteredAndSortedStudents = useMemo(() => {
    let students = filteredStudents;

    // Apply class filter
    if (classFilter !== 'all') {
      students = students.filter(student => student.class === classFilter);
    }

    // Apply sort
    students = students.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'grade') {
        return (a.avgGrade || 0) - (b.avgGrade || 0);
      } else if (sortBy === 'age') {
        return (a.age || 0) - (b.age || 0);
      }
      return 0;
    });

    return students;
  }, [filteredStudents, sortBy, classFilter]);

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
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            startIcon={<DownloadIcon />}
            onClick={handleExportData}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Export
          </Button>
          <Button
            startIcon={<PrintIcon />}
            onClick={handlePrint}
            variant="outlined"
            sx={{ textTransform: 'none' }}
          >
            Print
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{
              bgcolor: '#6366F1',
              '&:hover': { bgcolor: '#4F46E5' },
              textTransform: 'none'
            }}
          >
            Add student
          </Button>
        </Box>
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
              onChange={handleSearchChange}
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
              onChange={handleFilterChange}
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
              onChange={handleSortChange}
              displayEmpty
            >
              <MenuItem value="name">Name</MenuItem>
              <MenuItem value="grade">Avg. grade</MenuItem>
              <MenuItem value="age">Age</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={6} md={2}>
            <Select
              fullWidth
              size="small"
              value={classFilter}
              onChange={handleClassFilterChange}
              displayEmpty
            >
              <MenuItem value="all">All Classes</MenuItem>
              <MenuItem value="1A">1A</MenuItem>
              <MenuItem value="1B">1B</MenuItem>
              <MenuItem value="1C">1C</MenuItem>
              {/* Add more class options as needed */}
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
                    onChange={handleSelectAllStudents}
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
              {filteredAndSortedStudents.map((student, index) => (
                <TableRow key={student._id} hover>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedStudents.includes(student._id)}
                      onChange={() => handleStudentSelect(student._id)}
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
                    <IconButton size="small" onClick={(e) => handleActionClick(e, student)}>
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Actions Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleActionClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleActionClose}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleIssueCertificateClick}>
          <ListItemIcon>
            <CertificateIcon fontSize="small" color="primary" />
          </ListItemIcon>
          <ListItemText>Issue Certificate</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleActionClose}>
          <ListItemIcon>
            <MailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Send Email</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleActionClose} sx={{ color: 'error.main' }}>
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* Issue Certificate Dialog */}
      <Dialog open={certDialogOpen} onClose={() => setCertDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Issue Certificate</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3 }}>
            Issue a certificate for <b>{selectedStudent?.name}</b>. The student must have 100% progress in the course.
          </Typography>

          <FormControl fullWidth margin="normal">
            <InputLabel>Select Course</InputLabel>
            <Select
              value={selectedCourseForCert}
              onChange={(e) => setSelectedCourseForCert(e.target.value)}
              label="Select Course"
            >
              {selectedStudent && selectedStudent.courseIds?.map((courseId, idx) => {
                const courseName = selectedStudent.courses[idx];
                return (
                  <MenuItem key={courseId} value={courseId}>
                    {courseName}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCertDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmIssueCertificate}
            variant="contained"
            sx={{ bgcolor: '#6366F1' }}
            disabled={issueCertificateMutation.isLoading}
          >
            {issueCertificateMutation.isLoading ? 'Issuing...' : 'Issue Certificate'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Snackbar */}
      <Snackbar
        open={feedbackMessage.open}
        autoHideDuration={6000}
        onClose={() => setFeedbackMessage({ ...feedbackMessage, open: false })}
      >
        <Alert onClose={() => setFeedbackMessage({ ...feedbackMessage, open: false })} severity={feedbackMessage.severity} sx={{ width: '100%' }}>
          {feedbackMessage.message}
        </Alert>
      </Snackbar>
    </TrainerLayout>
  );
};

export default TrainerStudents;

