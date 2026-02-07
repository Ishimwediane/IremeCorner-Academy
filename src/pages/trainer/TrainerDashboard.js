import React from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    LinearProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Button,
    Chip,
    Paper,
} from '@mui/material';
import {
    People as PeopleIcon,
    School as SchoolIcon,
    AttachMoney as MoneyIcon,
    Star as StarIcon,
    TrendingUp,
    VideoCall,
    Assignment,
    Message,
    Add,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import TrainerLayout from '../../components/TrainerLayout';

const TrainerDashboard = () => {
    const { user } = useAuth();

    // Fetch dashboard stats
    const { data: statsData } = useQuery('trainer-stats', async () => {
        const res = await api.get('/trainer/stats');
        return res.data.data;
    });

    const { data: coursesData } = useQuery('trainer-courses', async () => {
        const res = await api.get('/courses/trainer');
        return res.data.data;
    });

    const { data: studentsData } = useQuery('trainer-students', async () => {
        const res = await api.get('/trainer/students');
        return res.data.data;
    });

    const stats = statsData || {};
    const courses = coursesData || [];
    const students = studentsData || [];

    const statCards = [
        {
            title: 'Total Students',
            value: stats.totalStudents || 0,
            icon: <PeopleIcon />,
            color: '#FD7E14',
            bgColor: 'rgba(253, 126, 20, 0.1)',
            trend: '+12%',
        },
        {
            title: 'Active Courses',
            value: stats.activeCourses || courses.length,
            icon: <SchoolIcon />,
            color: '#2E7D32',
            bgColor: 'rgba(46, 125, 50, 0.1)',
            trend: '+3',
        },
        {
            title: 'Total Earnings',
            value: `$${stats.totalEarnings || 0}`,
            icon: <MoneyIcon />,
            color: '#1976D2',
            bgColor: 'rgba(25, 118, 210, 0.1)',
            trend: '+8%',
        },
        {
            title: 'Average Rating',
            value: stats.averageRating || '4.8',
            icon: <StarIcon />,
            color: '#F57C00',
            bgColor: 'rgba(245, 124, 0, 0.1)',
            trend: '+0.2',
        },
    ];

    const quickActions = [
        { label: 'Create Course', icon: <Add />, path: '/trainer/courses', color: '#FD7E14' },
        { label: 'View Messages', icon: <Message />, path: '/trainer/messages', color: '#2E7D32' },
        { label: 'Schedule Session', icon: <VideoCall />, path: '/trainer/live-sessions', color: '#1976D2' },
        { label: 'Create Assignment', icon: <Assignment />, path: '/trainer/assignments', color: '#F57C00' },
    ];

    return (
        <TrainerLayout title="Dashboard">
            <Box>
                {/* Welcome Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#202F32', mb: 1 }}>
                        Welcome back, {user?.name || 'Trainer'}! 👋
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Here's what's happening with your courses today
                    </Typography>
                </Box>

                {/* Stats Cards */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    {statCards.map((stat, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card
                                sx={{
                                    borderRadius: 0,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
                                    },
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Box
                                            sx={{
                                                width: 48,
                                                height: 48,
                                                borderRadius: 2,
                                                bgcolor: stat.bgColor,
                                                color: stat.color,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {stat.icon}
                                        </Box>
                                        <Chip
                                            label={stat.trend}
                                            size="small"
                                            icon={<TrendingUp sx={{ fontSize: 16 }} />}
                                            sx={{
                                                bgcolor: 'rgba(46, 125, 50, 0.1)',
                                                color: '#2E7D32',
                                                fontWeight: 600,
                                                height: 24,
                                            }}
                                        />
                                    </Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#202F32', mb: 0.5 }}>
                                        {stat.value}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {stat.title}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                <Grid container spacing={3}>
                    {/* Quick Actions */}
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3, borderRadius: 0, mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                Quick Actions
                            </Typography>
                            <Grid container spacing={2}>
                                {quickActions.map((action, index) => (
                                    <Grid item xs={6} sm={3} key={index}>
                                        <Button
                                            component={Link}
                                            to={action.path}
                                            fullWidth
                                            sx={{
                                                py: 1,
                                                px: 1.5,
                                                flexDirection: 'column',
                                                gap: 0.5,
                                                bgcolor: 'transparent',
                                                color: action.color,
                                                borderRadius: 0,
                                                border: '1px solid',
                                                borderColor: 'rgba(0,0,0,0.08)',
                                                '&:hover': {
                                                    bgcolor: 'rgba(253, 126, 20, 0.05)',
                                                    borderColor: action.color,
                                                },
                                            }}
                                        >
                                            {action.icon}
                                            <Typography variant="caption" sx={{ fontWeight: 600, fontSize: '0.75rem' }}>
                                                {action.label}
                                            </Typography>
                                        </Button>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>

                        {/* Recent Courses */}
                        <Paper sx={{ p: 3, borderRadius: 0 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    Your Courses
                                </Typography>
                                <Button component={Link} to="/trainer/courses" size="small" sx={{ color: '#FD7E14' }}>
                                    View All
                                </Button>
                            </Box>
                            <List>
                                {courses.slice(0, 3).map((course, index) => (
                                    <ListItem
                                        key={course._id || index}
                                        sx={{
                                            borderRadius: 2,
                                            mb: 1,
                                            bgcolor: '#F9FAFB',
                                            '&:hover': { bgcolor: '#F3F4F6' },
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar
                                                src={course.thumbnail}
                                                sx={{ width: 56, height: 56, borderRadius: 2 }}
                                            >
                                                {course.title?.charAt(0)}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                                    {course.title}
                                                </Typography>
                                            }
                                            secondary={
                                                <Box sx={{ mt: 0.5 }}>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {course.enrolledStudents?.length || 0} students enrolled
                                                    </Typography>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={75}
                                                        sx={{
                                                            mt: 1,
                                                            height: 6,
                                                            borderRadius: 3,
                                                            bgcolor: '#E5E7EB',
                                                            '& .MuiLinearProgress-bar': { bgcolor: '#FD7E14' },
                                                        }}
                                                    />
                                                </Box>
                                            }
                                        />
                                        <Chip
                                            label={course.status || 'Active'}
                                            size="small"
                                            sx={{
                                                bgcolor: course.status === 'approved' ? 'rgba(46, 125, 50, 0.1)' : 'rgba(253, 126, 20, 0.1)',
                                                color: course.status === 'approved' ? '#2E7D32' : '#FD7E14',
                                                fontWeight: 600,
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    </Grid>

                    {/* Recent Activity */}
                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, borderRadius: 0, mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                Recent Students
                            </Typography>
                            <List>
                                {students.slice(0, 5).map((student, index) => (
                                    <ListItem key={student._id || index} sx={{ px: 0 }}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: '#FD7E14' }}>
                                                {student.name?.charAt(0) || 'S'}
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {student.name || 'Student'}
                                                </Typography>
                                            }
                                            secondary={
                                                <Typography variant="caption" color="text.secondary">
                                                    {student.email}
                                                </Typography>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                            <Button
                                component={Link}
                                to="/trainer/students"
                                fullWidth
                                variant="outlined"
                                sx={{
                                    mt: 2,
                                    borderColor: '#FD7E14',
                                    color: '#FD7E14',
                                    '&:hover': {
                                        borderColor: '#E56D0F',
                                        bgcolor: 'rgba(253, 126, 20, 0.05)',
                                    },
                                }}
                            >
                                View All Students
                            </Button>
                        </Paper>

                        {/* Upcoming Sessions */}
                        <Paper sx={{ p: 3, borderRadius: 0 }}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                Upcoming Sessions
                            </Typography>
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <VideoCall sx={{ fontSize: 48, color: '#E5E7EB', mb: 1 }} />
                                <Typography variant="body2" color="text.secondary">
                                    No upcoming sessions
                                </Typography>
                                <Button
                                    component={Link}
                                    to="/trainer/live-sessions"
                                    size="small"
                                    sx={{ mt: 2, color: '#FD7E14' }}
                                >
                                    Schedule Session
                                </Button>
                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </TrainerLayout>
    );
};

export default TrainerDashboard;
