import React, { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    IconButton,
    Alert
} from '@mui/material';
import { Visibility, Check, Close } from '@mui/icons-material';
import axios from 'axios';

const AdminCourses = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [currentTab, setCurrentTab] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [alert, setAlert] = useState({ show: false, message: '', severity: 'success' });

    const tabs = ['All', 'Pending', 'Approved', 'Rejected'];

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        filterCourses();
    }, [currentTab, courses]);

    const fetchCourses = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/courses', {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setCourses(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching courses:', error);
            showAlert('Failed to fetch courses', 'error');
        } finally {
            setLoading(false);
        }
    };

    const filterCourses = () => {
        if (currentTab === 0) {
            setFilteredCourses(courses);
        } else {
            const status = tabs[currentTab].toLowerCase();
            setFilteredCourses(courses.filter(course => course.status === status));
        }
    };

    const handleApprove = async (courseId) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `http://localhost:5000/api/courses/${courseId}/approve`,
                { status: 'approved' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                showAlert('Course approved successfully!', 'success');
                fetchCourses();
            }
        } catch (error) {
            console.error('Error approving course:', error);
            showAlert('Failed to approve course', 'error');
        }
    };

    const handleReject = async () => {
        if (!selectedCourse) return;

        try {
            const token = localStorage.getItem('token');
            const response = await axios.patch(
                `http://localhost:5000/api/courses/${selectedCourse._id}/approve`,
                {
                    status: 'rejected',
                    rejectionReason: rejectionReason
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                showAlert('Course rejected', 'success');
                setRejectDialogOpen(false);
                setRejectionReason('');
                setSelectedCourse(null);
                fetchCourses();
            }
        } catch (error) {
            console.error('Error rejecting course:', error);
            showAlert('Failed to reject course', 'error');
        }
    };

    const showAlert = (message, severity) => {
        setAlert({ show: true, message, severity });
        setTimeout(() => setAlert({ show: false, message: '', severity: 'success' }), 3000);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'success';
            case 'rejected': return 'error';
            case 'pending': return 'warning';
            case 'draft': return 'default';
            default: return 'default';
        }
    };

    const handleViewCourse = (course) => {
        setSelectedCourse(course);
        setViewDialogOpen(true);
    };

    const handleOpenRejectDialog = (course) => {
        setSelectedCourse(course);
        setRejectDialogOpen(true);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Course Management
            </Typography>

            {alert.show && (
                <Alert severity={alert.severity} sx={{ mb: 2 }}>
                    {alert.message}
                </Alert>
            )}

            <Paper sx={{ mt: 3 }}>
                <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
                    {tabs.map((tab, index) => (
                        <Tab
                            key={tab}
                            label={`${tab} (${index === 0 ? courses.length : courses.filter(c => c.status === tab.toLowerCase()).length})`}
                        />
                    ))}
                </Tabs>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Trainer</TableCell>
                                <TableCell>Language</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Created</TableCell>
                                <TableCell align="right">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">Loading...</TableCell>
                                </TableRow>
                            ) : filteredCourses.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">No courses found</TableCell>
                                </TableRow>
                            ) : (
                                filteredCourses.map((course) => (
                                    <TableRow key={course._id}>
                                        <TableCell>{course.title}</TableCell>
                                        <TableCell>{course.trainer?.name || 'N/A'}</TableCell>
                                        <TableCell>{course.language}</TableCell>
                                        <TableCell>{course.category}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={course.status}
                                                color={getStatusColor(course.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(course.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleViewCourse(course)}
                                                title="View Details"
                                            >
                                                <Visibility />
                                            </IconButton>
                                            {course.status === 'pending' && (
                                                <>
                                                    <IconButton
                                                        size="small"
                                                        color="success"
                                                        onClick={() => handleApprove(course._id)}
                                                        title="Approve"
                                                    >
                                                        <Check />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleOpenRejectDialog(course)}
                                                        title="Reject"
                                                    >
                                                        <Close />
                                                    </IconButton>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* View Course Dialog */}
            <Dialog
                open={viewDialogOpen}
                onClose={() => setViewDialogOpen(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Course Details</DialogTitle>
                <DialogContent>
                    {selectedCourse && (
                        <Box>
                            <Typography variant="h6" gutterBottom>{selectedCourse.title}</Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                <strong>Trainer:</strong> {selectedCourse.trainer?.name} ({selectedCourse.trainer?.email})
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                <strong>Language:</strong> {selectedCourse.language}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                <strong>Category:</strong> {selectedCourse.category}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                <strong>Level:</strong> {selectedCourse.level}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                <strong>Duration:</strong> {selectedCourse.duration} hours
                            </Typography>
                            <Typography variant="body2" color="text.secondary" paragraph>
                                <strong>Status:</strong> <Chip label={selectedCourse.status} color={getStatusColor(selectedCourse.status)} size="small" />
                            </Typography>
                            <Typography variant="body2" paragraph>
                                <strong>Description:</strong><br />
                                {selectedCourse.description}
                            </Typography>
                            {selectedCourse.totalLessons > 0 && (
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Total Lessons:</strong> {selectedCourse.totalLessons}
                                </Typography>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    {selectedCourse?.status === 'pending' && (
                        <>
                            <Button onClick={() => handleApprove(selectedCourse._id)} color="success" variant="contained">
                                Approve
                            </Button>
                            <Button onClick={() => {
                                setViewDialogOpen(false);
                                handleOpenRejectDialog(selectedCourse);
                            }} color="error" variant="contained">
                                Reject
                            </Button>
                        </>
                    )}
                    <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
                </DialogActions>
            </Dialog>

            {/* Reject Course Dialog */}
            <Dialog open={rejectDialogOpen} onClose={() => setRejectDialogOpen(false)}>
                <DialogTitle>Reject Course</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" gutterBottom>
                        Are you sure you want to reject this course?
                    </Typography>
                    <TextField
                        label="Rejection Reason (Optional)"
                        multiline
                        rows={4}
                        fullWidth
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleReject} color="error" variant="contained">
                        Reject Course
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AdminCourses;
