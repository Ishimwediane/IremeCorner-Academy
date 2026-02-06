import React from 'react';
import { Box, Container, Typography, Grid } from '@mui/material';

const features = [
    {
        title: (
            <>
                <Box component="span" sx={{ color: '#FD7E14' }}>Tools</Box> For Teachers<br />And Learners
            </>
        ),
        description: "Class has a dynamic set of teaching tools built to be deployed and used during class. Teachers can handout assignments in real-time for students to complete and submit.",
        image: "/teacher-learner.jpg",
        reverse: false,
    },
    {
        title: (
            <>
                Assessments,<br />
                <Box component="span" sx={{ color: '#FD7E14' }}>Quizzes</Box>, Tests
            </>
        ),
        description: "Easily launch live assignments, quizzes, and tests. Student results are automatically entered in the online gradebook.",
        image: "/test.jpg",
        reverse: true,
    },
    {
        title: (
            <>
                Class Management<br />
                <Box component="span" sx={{ color: '#FD7E14' }}>Tools for Educators</Box>
            </>
        ),
        description: "Class provides tools to help run and manage the class such as Class Roster, Attendance, and more. With the Gradebook, teachers can review and grade tests and quizzes in real-time.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        reverse: false,
    },
    {
        title: (
            <>
                One-on-One<br />
                <Box component="span" sx={{ color: '#FD7E14' }}>Discussions</Box>
            </>
        ),
        description: "Teachers and teacher assistants can talk with students privately without leaving the Zoom environment.",
        image: "/one-one.jpg",
        reverse: true,
    },
];

const FeaturesSection = () => {
    return (
        <Box sx={{ py: 10, bgcolor: 'white', overflow: 'hidden' }}>
            <Container maxWidth="lg">
                {features.map((feature, index) => (
                    <Grid
                        container
                        spacing={6} // Reduced spacing
                        alignItems="center"
                        direction={{ xs: 'column', md: feature.reverse ? 'row-reverse' : 'row' }}
                        key={index}
                        sx={{
                            mb: { xs: 8, md: 10 },
                            '&:last-child': { mb: 0 },
                            px: { xs: 4, md: 10, lg: 18 } // Maximized side padding
                        }}
                    >
                        {/* Text Side */}
                        <Grid item xs={12} md={6}>
                            <Box sx={{ position: 'relative' }}>
                                <Typography
                                    variant="h3"
                                    sx={{
                                        fontWeight: 700, // Reduced weight slightly
                                        color: '#1A1A1A',
                                        lineHeight: 1.2,
                                        mb: 2,
                                        fontSize: { xs: '1.5rem', md: '2rem' }, // Aggressively Reduced
                                    }}
                                >
                                    {feature.title}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: '#666',
                                        fontSize: '0.925rem', // Reduced to <1rem
                                        lineHeight: 1.6,
                                        mb: 3,
                                    }}
                                >
                                    {feature.description}
                                </Typography>
                            </Box>
                        </Grid>

                        {/* Image Side */}
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    position: 'relative',
                                    display: 'inline-block', // Ensure wrapper fits image
                                    width: '100%',
                                }}
                            >
                                {/* Background color shape */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -20,
                                        left: feature.reverse ? 'auto' : -20,
                                        right: feature.reverse ? -20 : 'auto',
                                        width: '100%',
                                        height: '100%',
                                        borderRadius: '20px',
                                        bgcolor: index % 2 === 0 ? '#FFF8E1' : '#FFF3E0', // Cream/Light Orange tints
                                        zIndex: 0,
                                    }}
                                />

                                {/* Decorative Dots - Top Left / Top Right */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        top: -40,
                                        [feature.reverse ? 'left' : 'right']: -30,
                                        zIndex: 0,
                                        display: { xs: 'none', md: 'block' },
                                    }}
                                >
                                    {[...Array(5)].map((_, i) => (
                                        <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1, justifyContent: 'flex-end' }}>
                                            {[...Array(5)].map((_, j) => (
                                                <Box
                                                    key={j}
                                                    sx={{
                                                        width: 6,
                                                        height: 6,
                                                        borderRadius: '50%',
                                                        bgcolor: index % 2 === 0 ? '#FFCC80' : '#FFAB91', // Matching orange tints
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    ))}
                                </Box>

                                {/* Decorative Dots - Bottom Right / Bottom Left */}
                                <Box
                                    sx={{
                                        position: 'absolute',
                                        bottom: -40,
                                        [feature.reverse ? 'right' : 'left']: -30,
                                        zIndex: 0,
                                        display: { xs: 'none', md: 'block' },
                                    }}
                                >
                                    {[...Array(5)].map((_, i) => (
                                        <Box key={i} sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                            {[...Array(5)].map((_, j) => (
                                                <Box
                                                    key={j}
                                                    sx={{
                                                        width: 6,
                                                        height: 6,
                                                        borderRadius: '50%',
                                                        bgcolor: index % 2 === 0 ? '#FFCC80' : '#FFAB91',
                                                    }}
                                                />
                                            ))}
                                        </Box>
                                    ))}
                                </Box>

                                <Box
                                    component="img"
                                    src={feature.image}
                                    alt="Feature"
                                    sx={{
                                        display: 'block',
                                        width: '100%',
                                        maxHeight: '300px',
                                        objectFit: 'cover',
                                        borderRadius: '20px',
                                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                                        position: 'relative',
                                        zIndex: 1,
                                        transition: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-10px)',
                                        },
                                    }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                ))}
            </Container>
        </Box>
    );
};

export default FeaturesSection;
