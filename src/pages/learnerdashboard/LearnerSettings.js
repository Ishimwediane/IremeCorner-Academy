import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    TextField,
    Button,
    Grid,
    Avatar,
    Divider,
    Switch,
    FormControlLabel,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import { CameraAlt, Save } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import api from '../../utils/api';
import { toast } from 'react-toastify';

const LearnerSettings = () => {
    const { user, updateUser } = useAuth();
    const { t, i18n } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        bio: user?.bio || '',
    });

    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        courseUpdates: true,
        assignmentReminders: true,
        certificateAlerts: true,
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleNotificationChange = (e) => {
        setNotifications({
            ...notifications,
            [e.target.name]: e.target.checked,
        });
    };

    const handleLanguageChange = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.put('/users/profile', formData);
            updateUser(response.data.data);
            toast.success('Profile updated successfully!');
        } catch (error) {
            toast.error('Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 800, color: '#202F32', mb: 1 }}>
                    Settings
                </Typography>
                <Typography sx={{ color: 'rgba(32,47,50,0.7)' }}>
                    Manage your account settings and preferences
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Profile Settings */}
                <Grid item xs={12} md={8}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid rgba(32,47,50,0.1)', borderRadius: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#202F32' }}>
                            Profile Information
                        </Typography>

                        <Box component="form" onSubmit={handleSubmit}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Full Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 0,
                                            },
                                        }}
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
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 0,
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 0,
                                            },
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Language</InputLabel>
                                        <Select
                                            value={i18n.language}
                                            onChange={handleLanguageChange}
                                            label="Language"
                                            sx={{
                                                borderRadius: 0,
                                            }}
                                        >
                                            <MenuItem value="en">English</MenuItem>
                                            <MenuItem value="rw">Kinyarwanda</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Bio"
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        multiline
                                        rows={3}
                                        variant="outlined"
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                borderRadius: 0,
                                            },
                                        }}
                                    />
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 3 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={loading}
                                    startIcon={<Save />}
                                    sx={{
                                        bgcolor: '#202F32',
                                        color: '#fff',
                                        borderRadius: 0,
                                        textTransform: 'none',
                                        px: 3,
                                        '&:hover': {
                                            bgcolor: '#1a2628',
                                        },
                                    }}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Box>
                        </Box>
                    </Paper>

                    {/* Notification Settings */}
                    <Paper elevation={0} sx={{ p: 3, mt: 3, border: '1px solid rgba(32,47,50,0.1)', borderRadius: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#202F32' }}>
                            Notification Preferences
                        </Typography>

                        <Box>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notifications.emailNotifications}
                                        onChange={handleNotificationChange}
                                        name="emailNotifications"
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#202F32',
                                            },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: '#202F32',
                                            },
                                        }}
                                    />
                                }
                                label="Email Notifications"
                                sx={{ mb: 2, display: 'block' }}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notifications.courseUpdates}
                                        onChange={handleNotificationChange}
                                        name="courseUpdates"
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#202F32',
                                            },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: '#202F32',
                                            },
                                        }}
                                    />
                                }
                                label="Course Updates"
                                sx={{ mb: 2, display: 'block' }}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notifications.assignmentReminders}
                                        onChange={handleNotificationChange}
                                        name="assignmentReminders"
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#202F32',
                                            },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: '#202F32',
                                            },
                                        }}
                                    />
                                }
                                label="Assignment Reminders"
                                sx={{ mb: 2, display: 'block' }}
                            />
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={notifications.certificateAlerts}
                                        onChange={handleNotificationChange}
                                        name="certificateAlerts"
                                        sx={{
                                            '& .MuiSwitch-switchBase.Mui-checked': {
                                                color: '#202F32',
                                            },
                                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                                backgroundColor: '#202F32',
                                            },
                                        }}
                                    />
                                }
                                label="Certificate Alerts"
                                sx={{ display: 'block' }}
                            />
                        </Box>
                    </Paper>
                </Grid>

                {/* Profile Picture */}
                <Grid item xs={12} md={4}>
                    <Paper elevation={0} sx={{ p: 3, border: '1px solid rgba(32,47,50,0.1)', borderRadius: 0, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#202F32' }}>
                            Profile Picture
                        </Typography>

                        <Box sx={{ position: 'relative', display: 'inline-block', mb: 2 }}>
                            <Avatar
                                src={user?.avatar}
                                alt={user?.name}
                                sx={{
                                    width: 120,
                                    height: 120,
                                    border: '3px solid rgba(32,47,50,0.1)',
                                }}
                            >
                                {user?.name?.charAt(0)}
                            </Avatar>
                            <Box
                                sx={{
                                    position: 'absolute',
                                    bottom: 0,
                                    right: 0,
                                    bgcolor: '#202F32',
                                    borderRadius: '50%',
                                    p: 1,
                                    cursor: 'pointer',
                                    '&:hover': {
                                        bgcolor: '#1a2628',
                                    },
                                }}
                            >
                                <CameraAlt sx={{ color: '#fff', fontSize: 20 }} />
                            </Box>
                        </Box>

                        <Typography variant="body2" sx={{ color: 'rgba(32,47,50,0.6)', mb: 2 }}>
                            JPG, PNG or GIF. Max size 2MB
                        </Typography>

                        <Button
                            variant="outlined"
                            size="small"
                            sx={{
                                borderColor: 'rgba(32,47,50,0.3)',
                                color: '#202F32',
                                borderRadius: 0,
                                textTransform: 'none',
                                '&:hover': {
                                    borderColor: '#202F32',
                                    bgcolor: 'rgba(32,47,50,0.05)',
                                },
                            }}
                        >
                            Upload Photo
                        </Button>
                    </Paper>

                    {/* Account Info */}
                    <Paper elevation={0} sx={{ p: 3, mt: 3, border: '1px solid rgba(32,47,50,0.1)', borderRadius: 0 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#202F32' }}>
                            Account Information
                        </Typography>

                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" sx={{ color: 'rgba(32,47,50,0.6)' }}>
                                Member Since
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#202F32', fontWeight: 500 }}>
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box>
                            <Typography variant="caption" sx={{ color: 'rgba(32,47,50,0.6)' }}>
                                Account Type
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#202F32', fontWeight: 500, textTransform: 'capitalize' }}>
                                {user?.role || 'Student'}
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default LearnerSettings;
