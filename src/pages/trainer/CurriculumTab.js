import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Paper,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Checkbox,
  FormControlLabel,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Videocam as VideoIcon,
  Description as FileTextIcon,
  AccessTime as ClockIcon,
  DragIndicator as GripVerticalIcon,
  Delete as TrashIcon,
  Edit as EditIcon,
  CloudUpload as UploadCloudIcon,
  Close as XIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import api from '../../utils/api';

const CurriculumTab = ({ courseId, lessons, fetchData }) => {
  const [saving, setSaving] = useState(false);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    videoType: 'url',
    duration: 0,
    isPublished: true,
    materials: [],
    existingMaterials: [],
  });

  const openLessonModal = (lesson) => {
    if (lesson) {
      setEditingLessonId(lesson._id);
      setLessonForm({
        title: lesson.title,
        description: lesson.description,
        content: lesson.content,
        videoType: lesson.videoUrl ? 'url' : 'file',
        videoUrl: lesson.videoUrl || '',
        duration: lesson.duration,
        isPublished: lesson.isPublished,
        existingMaterials: lesson.materials || [],
        materials: [],
      });
    } else {
      setEditingLessonId(null);
      setLessonForm({
        title: '',
        description: '',
        content: '',
        videoType: 'url',
        videoUrl: '',
        duration: 0,
        isPublished: true,
        materials: [],
        existingMaterials: [],
      });
    }
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = async () => {
    if (!courseId || !lessonForm.title) {
      alert('Title is required');
      return;
    }
    setSaving(true);
    try {
      const formData = new FormData();
      formData.append('course', courseId);
      formData.append('title', lessonForm.title);
      formData.append('description', lessonForm.description || '');
      formData.append('content', lessonForm.content || '');
      formData.append('duration', Number(lessonForm.duration) || 0);
      formData.append('isPublished', lessonForm.isPublished);

      if (lessonForm.videoType === 'url') {
        formData.append('videoUrl', lessonForm.videoUrl);
      } else if (lessonForm.videoFile) {
        formData.append('videoFile', lessonForm.videoFile);
      }

      if (lessonForm.materials.length > 0) {
        lessonForm.materials.forEach((file) => {
          formData.append('materials', file);
        });
      }

      if (editingLessonId && lessonForm.existingMaterials) {
        formData.append('existingMaterials', JSON.stringify(lessonForm.existingMaterials));
      }

      if (editingLessonId) {
        await api.put(`/lessons/${editingLessonId}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      } else {
        await api.post('/lessons', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      }

      setIsLessonModalOpen(false);
      fetchData();
    } catch (error) {
      console.error(error);
      alert('Failed to save lesson');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLesson = async (id) => {
    if (!window.confirm('Are you sure you want to delete this lesson? This cannot be undone.')) return;
    try {
      await api.delete(`/lessons/${id}`);
      fetchData();
    } catch (e) {
      console.error(e);
      alert('Failed to delete lesson.');
    }
  };

  return (
    <>
      <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Course Content</Typography>
            <Typography variant="body2" color="text.secondary">Organize and manage your lessons.</Typography>
          </Box>
          <Button
            onClick={() => openLessonModal()}
            variant="contained"
            size="small"
            startIcon={<AddIcon />}
            sx={{ bgcolor: '#FD7E14', borderRadius: 0, py: 0.5, px: 1.5, fontSize: '0.8rem', '&:hover': { bgcolor: '#E56D0F' }, textTransform: 'none' }}
          >
            Add Lesson
          </Button>
        </Box>

        {lessons.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, border: '2px dashed #e0e0e0', borderRadius: 2, bgcolor: '#fafafa' }}>
            <Box sx={{ width: 64, height: 64, bgcolor: '#eeeeee', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2 }}>
              <FileTextIcon sx={{ fontSize: 32, color: 'text.secondary' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'medium', mb: 1 }}>No lessons yet</Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>Start building your curriculum by adding a lesson.</Typography>
            <Button onClick={() => openLessonModal()} size="small" sx={{ color: '#FD7E14', fontWeight: 'medium', borderRadius: 0, py: 0.5, px: 1.5, fontSize: '0.8rem' }}>
              Create your first lesson
            </Button>
          </Box>
        ) : (
          <Stack spacing={2}>
            {lessons.map((lesson) => (
              <Paper key={lesson._id} variant="outlined" sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, '&:hover .actions': { opacity: 1 } }}>
                <GripVerticalIcon sx={{ color: 'text.disabled', cursor: 'grab' }} />
                <Box sx={{ width: 40, height: 40, borderRadius: 1, bgcolor: 'primary.lightest', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {lesson.videoUrl || lesson.videoFile ? <VideoIcon color="primary" /> : <FileTextIcon color="primary" />}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography sx={{ fontWeight: 'medium', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lesson.title}</Typography>
                    {!lesson.isPublished && <Chip label="Draft" size="small" />}
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'text.secondary' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><ClockIcon sx={{ fontSize: 16 }} /> <Typography variant="body2">{lesson.duration} min</Typography></Box>
                    {lesson.materials && lesson.materials.length > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}><FileIcon sx={{ fontSize: 16 }} /> <Typography variant="body2">{lesson.materials.length} files</Typography></Box>
                    )}
                  </Box>
                </Box>
                <Box className="actions" sx={{ display: 'flex', gap: 1, opacity: { xs: 1, md: 0 }, transition: 'opacity 0.2s' }}>
                  <IconButton onClick={() => openLessonModal(lesson)} title="Edit Lesson"><EditIcon /></IconButton>
                  <IconButton onClick={() => handleDeleteLesson(lesson._id)} title="Delete Lesson" color="error"><TrashIcon /></IconButton>
                </Box>
              </Paper>
            ))}
          </Stack>
        )}
      </Box>

      {/* LESSON MODAL */}
      <Dialog open={isLessonModalOpen} onClose={() => setIsLessonModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {editingLessonId ? 'Edit Lesson' : 'Create New Lesson'}
          <IconButton onClick={() => setIsLessonModalOpen(false)}><XIcon /></IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3} sx={{ py: 2 }}>
            <Grid item xs={12}><TextField fullWidth label="Lesson Title" placeholder="e.g., Introduction to the Course" value={lessonForm.title || ''} onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })} /></Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>Video Source</Typography>
              <Paper variant="outlined" sx={{ display: 'flex', p: 0.5 }}>
                <Button fullWidth size="small" variant={lessonForm.videoType === 'url' ? 'contained' : 'text'} onClick={() => setLessonForm({ ...lessonForm, videoType: 'url' })}>URL</Button>
                <Button fullWidth size="small" variant={lessonForm.videoType === 'file' ? 'contained' : 'text'} onClick={() => setLessonForm({ ...lessonForm, videoType: 'file' })}>Upload</Button>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Duration (minutes)" type="number" value={lessonForm.duration || 0} onChange={e => setLessonForm({ ...lessonForm, duration: parseInt(e.target.value) || 0 })} /></Grid>
            <Grid item xs={12}>
              {lessonForm.videoType === 'url' ? (
                <TextField fullWidth label="Video URL" placeholder="https://youtube.com/..." value={lessonForm.videoUrl || ''} onChange={e => setLessonForm({ ...lessonForm, videoUrl: e.target.value })} InputProps={{ startAdornment: <InputAdornment position="start"><VideoIcon /></InputAdornment> }} />
              ) : (
                <Box>
                  <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>Upload Video File</Typography>
                  <Button component="label" fullWidth size="small" variant="outlined" startIcon={<UploadCloudIcon />} sx={{ p: 3, borderStyle: 'dashed', textTransform: 'none' }}>
                    {lessonForm.videoFile ? lessonForm.videoFile.name : 'Click to upload or drag and drop'}
                    <input type="file" hidden accept="video/*" onChange={e => { if (e.target.files && e.target.files[0]) { setLessonForm({ ...lessonForm, videoFile: e.target.files[0] }); } }} />
                  </Button>
                </Box>
              )}
            </Grid>
            <Grid item xs={12}><TextField fullWidth label="Description & Content" multiline rows={4} placeholder="What will students learn in this lesson?" value={lessonForm.description || ''} onChange={e => setLessonForm({ ...lessonForm, description: e.target.value })} /></Grid>
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ mb: 1, fontWeight: 'medium' }}>Downloadable Materials</Typography>
              <Stack spacing={1}>
                {lessonForm.existingMaterials.map((mat, idx) => (
                  <Chip key={idx} icon={<FileIcon />} label={`${mat.originalName} (${(mat.fileSize / 1024).toFixed(0)} KB)`} onDelete={() => { setLessonForm({ ...lessonForm, existingMaterials: lessonForm.existingMaterials.filter((_, i) => i !== idx) }); }} />
                ))}
                {lessonForm.materials.map((file, idx) => (
                  <Chip key={`new-${idx}`} icon={<UploadCloudIcon />} label={`${file.name} (New)`} color="primary" onDelete={() => { const newMats = [...lessonForm.materials]; newMats.splice(idx, 1); setLessonForm({ ...lessonForm, materials: newMats }); }} />
                ))}
                <Button component="label" startIcon={<AddIcon />} size="small" sx={{ alignSelf: 'flex-start', borderRadius: 0 }}>
                  Add Material
                  <input type="file" hidden multiple onChange={e => { if (e.target.files && e.target.files.length > 0) { const newFiles = Array.from(e.target.files); setLessonForm({ ...lessonForm, materials: [...lessonForm.materials, ...newFiles] }); } }} />
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel control={<Checkbox checked={lessonForm.isPublished} onChange={e => setLessonForm({ ...lessonForm, isPublished: e.target.checked })} />} label="Publish this lesson immediately" />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setIsLessonModalOpen(false)} size="small">Cancel</Button>
          <Button onClick={handleSaveLesson} disabled={saving} variant="contained" size="small" sx={{ bgcolor: '#FD7E14', borderRadius: 0, py: 0.5, px: 1.5, fontSize: '0.8rem', '&:hover': { bgcolor: '#E56D0F' } }}>
            {saving ? 'Saving...' : (editingLessonId ? 'Update Lesson' : 'Create Lesson')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CurriculumTab;