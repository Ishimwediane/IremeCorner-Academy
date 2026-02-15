import React from 'react';
import {
    Container,
    Typography,
    Grid,
    Card,
    CardContent,
    CardActions,
    Button,
    Box,
    CircularProgress,
    Chip,
} from '@mui/material';
import { Download, RemoveRedEye, VerifiedUser } from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';


const MyCertificates = ({ showHeader = true }) => {
    const navigate = useNavigate();

    const { data: certificatesData, isLoading } = useQuery(
        'my-certificates',
        async () => {
            const response = await api.get('/certificates');
            return response.data;
        }
    );

    const certificates = certificatesData?.data || [];

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress sx={{ color: '#C39766' }} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 2 }}>
            {showHeader && (
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: '#202F32' }}>
                        My Certificates
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        View and download your earned certificates.
                    </Typography>
                </Box>
            )}

            {certificates.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <VerifiedUser sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary">
                        No certificates earned yet.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Complete courses 100% to earn certificates!
                    </Typography>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/learner/my-learning')}
                        sx={{ bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' } }}
                    >
                        Go to My Courses
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {certificates.map((cert) => (
                        <Grid item key={cert._id} xs={12} sm={6} md={4}>
                            <Card sx={{
                                height: '100%',
                                display: 'flex',
                                flexDirection: 'column',
                                borderRadius: '12px',
                                transition: 'transform 0.2s',
                                '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 }
                            }}>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Chip
                                            label="Verified"
                                            size="small"
                                            color="success"
                                            icon={<VerifiedUser sx={{ fontSize: 16 }} />}
                                            variant="outlined"
                                        />
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(cert.createdAt).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', mb: 1 }}>
                                        {cert.course?.title || 'Unknown Course'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                        Certificate ID: {cert.certificateNumber}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        size="small"
                                        startIcon={<RemoveRedEye />}
                                        onClick={() => navigate(`/learner/certificates/${cert._id}`)}
                                        sx={{ color: '#202F32' }}
                                    >
                                        View
                                    </Button>
                                    <Button
                                        size="small"
                                        startIcon={<Download />}
                                        onClick={() => navigate(`/learner/certificates/${cert._id}`)}
                                        sx={{ color: '#C39766' }}
                                    >
                                        Download
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default MyCertificates;
