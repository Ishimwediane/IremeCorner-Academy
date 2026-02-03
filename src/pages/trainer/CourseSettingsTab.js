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
  IconButton,
  Divider,
} from '@mui/material';
import { Save as SaveIcon, Publish as PublishIcon, Add, Remove } from '@mui/icons-material';
import api from '../../utils/api';

const CourseSettingsTab = ({ course, fetchData }) => {
  const [courseForm, setCourseForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (course) {
      setCourseForm({
        ...course,
        whatYouWillLearn: course.whatYouWillLearn || [''],
        learningObjectives: course.learningObjectives || ['']
      });
    }
  }, [course]);

  const handleAddLearningOutcome = () => {
    setCourseForm({
      ...courseForm,
      whatYouWillLearn: [...(courseForm.whatYouWillLearn || ['']), '']
    });
  };

  const handleRemoveLearningOutcome = (index) => {
    const updated = (courseForm.whatYouWillLearn || ['']).filter((_, i) => i !== index);
    setCourseForm({ ...courseForm, whatYouWillLearn: updated });
  };

  const handleLearningOutcomeChange = (index, value) => {
    const updated = [...(courseForm.whatYouWillLearn || [''])];
    updated[index] = value;
    setCourseForm({ ...courseForm, whatYouWillLearn: updated });
  };

  const handleAddObjective = () => {
    setCourseForm({
      ...courseForm,
      learningObjectives: [...(courseForm.learningObjectives || ['']), '']
    });
  };

  const handleRemoveObjective = (index) => {
    const updated = (courseForm.learningObjectives || ['']).filter((_, i) => i !== index);
    setCourseForm({ ...courseForm, learningObjectives: updated });
  };

  const handleObjectiveChange = (index, value) => {
    const updated = [...(courseForm.learningObjectives || [''])];
    updated[index] = value;
    setCourseForm({ ...courseForm, learningObjectives: updated });
  };

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

          {/* Short Description */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Short Description"
              multiline
              rows={2}
              value={courseForm.shortDescription || ''}
              onChange={e => setCourseForm({ ...courseForm, shortDescription: e.target.value })}
              helperText="A brief summary of the course (optional)"
            />
          </Grid>

          {/* Course Outcome */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Course Outcome"
              multiline
              rows={3}
              value={courseForm.courseOutcome || ''}
              onChange={e => setCourseForm({ ...courseForm, courseOutcome: e.target.value })}
              helperText="What will students achieve after completing this course? (optional)"
            />
          </Grid>

          {/* Instructor Bio */}
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Instructor Bio"
              multiline
              rows={3}
              value={courseForm.instructorBio || ''}
              onChange={e => setCourseForm({ ...courseForm, instructorBio: e.target.value })}
              helperText="Tell students about yourself and your expertise (optional)"
            />
          </Grid>

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
          </Grid>

          {/* What You'll Learn */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>What You'll Learn</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Add key learning outcomes that students will gain from this course
            </Typography>
            {(courseForm.whatYouWillLearn || ['']).map((outcome, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label={`Learning Outcome ${index + 1}`}
                  value={outcome}
                  onChange={(e) => handleLearningOutcomeChange(index, e.target.value)}
                  placeholder="e.g., Master email marketing fundamentals"
                />
                {(courseForm.whatYouWillLearn || ['']).length > 1 && (
                  <IconButton
                    onClick={() => handleRemoveLearningOutcome(index)}
                    color="error"
                  >
                    <Remove />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button
              startIcon={<Add />}
              onClick={handleAddLearningOutcome}
              variant="outlined"
              size="small"
            >
              Add Learning Outcome
            </Button>
          </Grid>

          {/* Learning Objectives */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>Learning Objectives</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Define specific objectives students should accomplish (optional)
            </Typography>
            {(courseForm.learningObjectives || ['']).map((objective, index) => (
              <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2 }}>
                <TextField
                  fullWidth
                  label={`Objective ${index + 1}`}
                  value={objective}
                  onChange={(e) => handleObjectiveChange(index, e.target.value)}
                  placeholder="e.g., Create effective email campaigns"
                />
                {(courseForm.learningObjectives || ['']).length > 1 && (
                  <IconButton
                    onClick={() => handleRemoveObjective(index)}
                    color="error"
                  >
                    <Remove />
                  </IconButton>
                )}
              </Box>
            ))}
            <Button
              startIcon={<Add />}
              onClick={handleAddObjective}
              variant="outlined"
              size="small"
            >
              Add Objective
            </Button>
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