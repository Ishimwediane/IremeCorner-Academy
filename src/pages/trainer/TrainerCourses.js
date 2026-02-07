import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  CircularProgress,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import TrainerLayout from '../../components/TrainerLayout';
import { format } from 'date-fns';

const TrainerCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Modal state
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: '',
    category: '',
    description: '',
    type: 'free',
    level: 'Beginner',
    duration: '',
    price: '',
    language: 'English',
  });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState([]);

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/courses/categories');
        setCategories(res.data?.data || []);
      } catch {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const { data: coursesData, isLoading, refetch } = useQuery(
    ['trainer-courses', user?._id || user?.id],
    async () => {
      const userId = user?._id || user?.id;
      const response = await api.get(`/courses?trainer=${userId}`);
      return response.data;
    },
    { enabled: !!(user?._id || user?.id) }
  );

  const courses = coursesData?.data || [];

  // Handle modal open/close
  const handleOpen = () => {
    setForm({
      title: '',
      category: '',
      description: '',
      type: 'free',
      level: 'Beginner',
      duration: '',
      price: '',
      language: 'English',
    });
    setError('');
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  // Handle form change
  const handleChange = (e) => {
    // Ensure level is always capitalized for backend
    if (e.target.name === 'level') {
      let value = e.target.value;
      if (value === 'intermediate') value = 'Intermediate';
      else if (value === 'advanced') value = 'Advanced';
      else if (value === 'Beginner') value = 'Beginner';
      setForm({ ...form, level: value });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  // Helper to convert duration string to number (hours)
  const parseDuration = (str) => {
    if (!str) return 0;
    // Accept formats like "10", "10h", "10h 30m", "1.5", "1.5h"
    const match = str.match(/(\d+\.?\d*)\s*h(?:\s*(\d+)\s*m)?/i);
    if (match) {
      const hours = parseFloat(match[1]);
      const minutes = match[2] ? parseInt(match[2], 10) : 0;
      return hours + (minutes / 60);
    }
    // fallback: try parse as float
    return parseFloat(str) || 0;
  };

  // Handle create course
  const handleCreate = async () => {
    setCreating(true);
    setError('');
    try {
      const durationValue = parseDuration(form.duration);
      if (!form.title || !form.category || !form.description || !durationValue) {
        setError('All fields including a valid duration are required.');
        setCreating(false);
        return;
      }

      // Capitalize level for backend enum
      const levelMap = {
        Beginner: 'Beginner',
        intermediate: 'Intermediate',
        advanced: 'Advanced',
      };
      const payload = {
        title: form.title,
        category: form.category,
        description: form.description,
        level: levelMap[form.level] || 'Beginner',
        duration: durationValue,
        type: form.type, // 'free' or 'paid'
        price: form.type === 'paid' ? Number(form.price) || 0 : 0,
        // trainer: user._id || user.id, // backend uses req.user._id, not from body
      };

      await api.post('/courses', payload);
      setOpen(false);
      refetch();
    } catch (err) {
      setError(
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.errors)
          ? err.response.data.errors.map((e) => e.msg).join('; ')
          : '') ||
        'Failed to create course'
      );
    } finally {
      setCreating(false);
    }
  };

  if (isLoading) {
    return (
      <TrainerLayout title="Course Management">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </TrainerLayout>
    );
  }

  return (
    <TrainerLayout title="Course Management">
      {/* Header Actions */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#202F32' }}>
          My Courses ({courses.length})
        </Typography>
        <Button
          variant="contained"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleOpen}
          sx={{
            bgcolor: '#FD7E14',
            borderRadius: 0,
            py: 0.5,
            px: 1.5,
            fontSize: '0.8rem',
            '&:hover': { bgcolor: '#E56D0F' },
            textTransform: 'none',
          }}
        >
          Create New Course
        </Button>
      </Box>

      {/* Create Course Modal */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Course</DialogTitle>
        <DialogContent>
          <TextField
            margin="normal"
            label="Course Title"
            name="title"
            fullWidth
            value={form.title}
            onChange={handleChange}
            required
          />
          <TextField
            margin="normal"
            label="Category"
            name="category"
            fullWidth
            select
            value={form.category}
            onChange={handleChange}
            required
          >
            {categories.length === 0 ? (
              <MenuItem value="" disabled>No categories found</MenuItem>
            ) : (
              categories.map((cat) => (
                <MenuItem key={cat.value || cat.name} value={cat.value || cat.name}>
                  {cat.name || cat.value}
                </MenuItem>
              ))
            )}
          </TextField>
          <TextField
            margin="normal"
            label="Type"
            name="type"
            fullWidth
            select
            value={form.type}
            onChange={handleChange}
            required
          >
            <MenuItem value="free">Free</MenuItem>
            <MenuItem value="paid">Paid</MenuItem>
          </TextField>
          {form.type === 'paid' && (
            <TextField
              margin="normal"
              label="Price (USD)"
              name="price"
              type="number"
              fullWidth
              value={form.price}
              onChange={handleChange}
              required
              inputProps={{ min: 0 }}
            />
          )}
          <TextField
            margin="normal"
            label="Level"
            name="level"
            fullWidth
            select
            value={form.level}
            onChange={handleChange}
            required
          >
            <MenuItem value="Beginner">Beginner</MenuItem>
            <MenuItem value="Intermediate">Intermediate</MenuItem>
            <MenuItem value="Advanced">Advanced</MenuItem>
          </TextField>
          <TextField
            margin="normal"
            label="Language"
            name="language"
            fullWidth
            select
            value={form.language}
            onChange={handleChange}
            required
          >
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Kinyarwanda">Kinyarwanda</MenuItem>
          </TextField>
          <TextField
            margin="normal"
            label="Duration (e.g. 10h 30m)"
            name="duration"
            fullWidth
            value={form.duration}
            onChange={handleChange}
            required
            helperText="Enter as hours (e.g. 1.5 or 10h 30m)"
          />
          <TextField
            margin="normal"
            label="Description"
            name="description"
            fullWidth
            multiline
            minRows={3}
            value={form.description}
            onChange={handleChange}
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={creating} size="small">Cancel</Button>
          <Button onClick={handleCreate} variant="contained" size="small" disabled={creating} sx={{ bgcolor: '#FD7E14', borderRadius: 0, py: 0.5, px: 1.5, fontSize: '0.8rem', '&:hover': { bgcolor: '#E56D0F' } }}>
            {creating ? 'Creating...' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Total Courses
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#202F32' }}>
                    {courses.length}
                  </Typography>
                </Box>
                <SchoolIcon sx={{ fontSize: 40, color: '#C39766', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Approved
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#202F32' }}>
                    {courses.filter(c => c.status === 'approved').length}
                  </Typography>
                </Box>
                <SchoolIcon sx={{ fontSize: 40, color: '#4caf50', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Pending
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#202F32' }}>
                    {courses.filter(c => c.status === 'pending').length}
                  </Typography>
                </Box>
                <SchoolIcon sx={{ fontSize: 40, color: '#ff9800', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Total Students
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#202F32' }}>
                    {courses.reduce((sum, course) => sum + (course.enrolledStudents?.length || 0), 0)}
                  </Typography>
                </Box>
                <SchoolIcon sx={{ fontSize: 40, color: '#2196f3', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Courses Table */}
      <Paper sx={{ borderRadius: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Course Title</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Students</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Created</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32', textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {courses.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      No courses found. Create your first course to get started!
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                courses.map((course) => (
                  <TableRow
                    key={course._id}
                    hover
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/trainer/course-content/${course._id}`)} // This makes the entire row clickable

                  >
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#202F32' }}>
                        {course.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label={course.category} size="small" sx={{ bgcolor: 'rgba(195,151,102,0.1)', color: '#C39766' }} />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={course.status}
                        size="small"
                        color={
                          course.status === 'approved' ? 'success' :
                            course.status === 'pending' ? 'warning' :
                              course.status === 'rejected' ? 'error' : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#202F32' }}>
                        {course.enrolledStudents?.length || 0}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {format(new Date(course.createdAt), 'MMM dd, yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <IconButton
                          size="small"
                          onClick={e => { e.stopPropagation(); navigate(`/trainer/course-content/${course._id}`); }}
                          sx={{ color: '#2196f3' }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={e => { e.stopPropagation(); navigate(`/create-course?edit=${course._id}`); }}
                          sx={{ color: '#C39766' }}

                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: '#f44336' }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
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

export default TrainerCourses;
