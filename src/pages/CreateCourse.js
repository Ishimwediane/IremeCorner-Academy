import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  MenuItem,
  Alert,
  CircularProgress,
  Box,
  IconButton
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import api from '../utils/api';
import { toast } from 'react-toastify';

const CreateCourse = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    level: 'Beginner',
    duration: 0,
    isFree: true,
    price: 0,
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
    'Digital Tools',
    'Marketing',
    'Financial Literacy',
    'Business Management',
    'Technical Skills',
    'Other',
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced'];

  const handleChange = (e) => {
    const value =
      e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value,
    });
    setError('');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key !== 'isFree') {
          formDataToSend.append(key, formData[key]);
        }
      });
      formDataToSend.append('type', formData.isFree ? 'free' : 'paid');
      if (thumbnail) {
        formDataToSend.append('thumbnail', thumbnail);
      }

      const response = await api.post('/courses', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Course created successfully!');
      navigate(`/trainer/courses/${response.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Course creation failed');
      toast.error('Course creation failed');
    }

    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create New Course
      </Typography>

      <Paper elevation={3} sx={{ p: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Course Thumbnail</Typography>
              <Box
                sx={{
                  border: '2px dashed #ccc',
                  borderRadius: '4px',
                  p: 2,
                  textAlign: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                  },
                }}
                onClick={() => document.getElementById('thumbnail-upload').click()}
              >
                <input
                  accept="image/*"
                  id="thumbnail-upload"
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
                {preview ? (
                  <img src={preview} alt="Thumbnail preview" style={{ maxHeight: '200px', maxWidth: '100%' }} />
                ) : (
                  <>
                    <IconButton color="primary" component="span">
                      <PhotoCamera />
                    </IconButton>
                    <Typography>Click to upload</Typography>
                  </>
                )}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Course Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>
                    {cat}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                required
              >
                {levels.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Duration (hours)"
                name="duration"
                type="number"
                value={formData.duration}
                onChange={handleChange}
                inputProps={{ min: 0 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Course Type"
                name="isFree"
                value={formData.isFree ? 'true' : 'false'}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isFree: e.target.value === 'true',
                  })
                }
              >
                <MenuItem value="true">Free</MenuItem>
                <MenuItem value="false">Paid</MenuItem>
              </TextField>
            </Grid>
            {!formData.isFree && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  required
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                size="large"
              >
                {loading ? <CircularProgress size={24} /> : 'Create Course'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

export default CreateCourse;
