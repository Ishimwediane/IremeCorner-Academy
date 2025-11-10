import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  Avatar,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  PhotoCamera as CameraIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import TrainerLayout from '../../components/TrainerLayout';

const TrainerSettings = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Update profile
    console.log('Update profile:', formData);
  };

  return (
    <TrainerLayout title="Settings">
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: '16px' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  bgcolor: '#C39766',
                  fontSize: '3rem',
                  mx: 'auto',
                  mb: 2,
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase() || 'T'}
              </Avatar>
              <Button
                variant="outlined"
                startIcon={<CameraIcon />}
                size="small"
                sx={{
                  borderColor: '#C39766',
                  color: '#C39766',
                  '&:hover': { borderColor: '#A67A52', bgcolor: 'rgba(195,151,102,0.05)' },
                }}
              >
                Change Photo
              </Button>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box>
              <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                Account Type
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 600, color: '#202F32' }}>
                Instructor
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, borderRadius: '16px' }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#202F32', mb: 3 }}>
              Profile Information
            </Typography>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    multiline
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    startIcon={<SaveIcon />}
                    sx={{
                      bgcolor: '#C39766',
                      '&:hover': { bgcolor: '#A67A52' },
                      textTransform: 'none',
                      px: 4,
                    }}
                  >
                    Save Changes
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: '16px', mt: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#202F32', mb: 3 }}>
              Change Password
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Current Password"
                  type="password"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="New Password"
                  type="password"
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Confirm New Password"
                  type="password"
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  sx={{
                    borderColor: '#C39766',
                    color: '#C39766',
                    '&:hover': { borderColor: '#A67A52', bgcolor: 'rgba(195,151,102,0.05)' },
                    textTransform: 'none',
                  }}
                >
                  Update Password
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </TrainerLayout>
  );
};

export default TrainerSettings;

