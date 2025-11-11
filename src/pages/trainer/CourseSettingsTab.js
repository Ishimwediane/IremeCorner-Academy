import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
  InputAdornment,
} from '@mui/material';
import { Save as SaveIcon, Publish as PublishIcon } from '@mui/icons-material';
import api from '../../utils/api';

const CourseSettingsTab = ({ course, fetchData }) => {
  const [courseForm, setCourseForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (course) {
      setCourseForm(course);
    }
  }, [course]);

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    if (!course) return;
    setSaving(true);
    try {
      await api.put(`/courses/${course._id}`, courseForm);
      alert('Course details updated successfully!');
      fetchData(); // Refetch data on the parent to update the title, etc.
    } catch (e) {
      console.error(e);
      alert('Failed to update course');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!course || course.status === 'pending' || !window.confirm('Are you sure you want to submit this course for review? Once submitted, you cannot edit it until it is reviewed.')) return;
    setSaving(true);
    try {
      // We can use the general update endpoint to change the status to 'pending'
      await api.put(`/courses/${course._id}`, { status: 'pending' });
      alert('Course submitted for review!');
      fetchData();
    } catch (e) {
      console.error(e);
      alert('Failed to publish course.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Course Settings</Typography>
      <Box component="form" onSubmit={handleUpdateCourse}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField fullWidth label="Course Title" value={courseForm.title || ''} onChange={e => setCourseForm({ ...courseForm, title: e.target.value })} />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Status"
              value={courseForm.status || 'draft'}
              InputProps={{ readOnly: true, sx: { textTransform: 'capitalize' } }}
              helperText="Submit the course for review when you are ready to publish."
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth select label="Category" value={courseForm.category || ''} onChange={e => setCourseForm({ ...courseForm, category: e.target.value })}>
              <MenuItem value="Digital Tools">Digital Tools</MenuItem>
              <MenuItem value="Marketing">Marketing</MenuItem>
              <MenuItem value="Financial Literacy">Financial Literacy</MenuItem>
              <MenuItem value="Business Management">Business Management</MenuItem>
              <MenuItem value="Technical Skills">Technical Skills</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField fullWidth select label="Level" value={courseForm.level || ''} onChange={e => setCourseForm({ ...courseForm, level: e.target.value })}>
              <MenuItem value="Beginner">Beginner</MenuItem>
              <MenuItem value="Intermediate">Intermediate</MenuItem>
              <MenuItem value="Advanced">Advanced</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Price (USD)"
              type="number"
              value={courseForm.price || 0}
              onChange={e => setCourseForm({ ...courseForm, price: parseFloat(e.target.value), isFree: parseFloat(e.target.value) === 0 })}
              InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Duration (Hours)"
              type="number"
              value={courseForm.duration || 0}
              onChange={e => setCourseForm({ ...courseForm, duration: parseFloat(e.target.value) })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={4}
              value={courseForm.description || ''}
              onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
            />
          </Grid>
        </Grid>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, pt: 3, mt: 3, borderTop: 1, borderColor: 'divider' }}>
          {course.status === 'draft' && (
            <Button
              onClick={handlePublish}
              disabled={saving}
              variant="outlined"
              startIcon={<PublishIcon />}
              sx={{ mr: 'auto', color: 'success.main', borderColor: 'success.light' }}
            >
              Submit for Review
            </Button>
          )}
          <Button onClick={() => setCourseForm(course)}>Reset</Button>
          <Button
            type="submit"
            disabled={saving}
            variant="contained"
            startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
            sx={{ bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' } }}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseSettingsTab;