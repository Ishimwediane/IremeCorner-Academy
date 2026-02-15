import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Button,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  School,
  EmojiObjects,
  Groups,
  TrendingUp,
  Verified,
  Support,
  ExpandMore,
} from '@mui/icons-material';

const About = () => {
  const [expanded, setExpanded] = useState(false);

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  const features = [
    {
      icon: <School sx={{ fontSize: 48, color: '#FD7E14' }} />,
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with years of experience in their fields.',
    },
    {
      icon: <EmojiObjects sx={{ fontSize: 48, color: '#FD7E14' }} />,
      title: 'Innovative Learning',
      description: 'Interactive courses designed to engage and inspire creative thinking.',
    },
    {
      icon: <Groups sx={{ fontSize: 48, color: '#FD7E14' }} />,
      title: 'Community Support',
      description: 'Join a vibrant community of learners and grow together.',
    },
    {
      icon: <TrendingUp sx={{ fontSize: 48, color: '#FD7E14' }} />,
      title: 'Career Growth',
      description: 'Gain skills that help you advance in your career and achieve your goals.',
    },
    {
      icon: <Verified sx={{ fontSize: 48, color: '#FD7E14' }} />,
      title: 'Certified Courses',
      description: 'Earn recognized certificates upon course completion.',
    },
    {
      icon: <Support sx={{ fontSize: 48, color: '#FD7E14' }} />,
      title: '24/7 Support',
      description: 'Get help whenever you need it with our dedicated support team.',
    },
  ];

  return (
    <Box sx={{ bgcolor: '#FAF1E6', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'white',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            {/* Left Student Image */}
            <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 220,
                    height: 280,
                    borderRadius: '50%',
                    border: '8px solid #FD7E14',
                    boxShadow: '0 10px 30px rgba(253, 126, 20, 0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    bgcolor: 'transparent',
                  }}
                >
                  {/* Placeholder for student image */}
                  <Box
                    component="img"
                    src="/about1 (1).png"
                    alt="Student"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <Box
                    sx={{
                      display: 'none',
                      width: '100%',
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#FAF1E6',
                    }}
                  >
                    <School sx={{ fontSize: 80, color: '#FD7E14' }} />
                  </Box>
                </Box>
              </Box>
            </Grid>

            {/* Center Content */}
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography
                  sx={{
                    color: '#FD7E14',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    mb: 2,
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  Learn From Today
                </Typography>
                <Typography
                  variant="h2"
                  sx={{
                    fontWeight: 800,
                    color: '#1A1A1A',
                    mb: 3,
                    fontSize: { xs: '2rem', md: '2.5rem' },
                    lineHeight: 1.2,
                  }}
                >
                  Best Academic Online Learning Platform
                </Typography>
                <Typography
                  sx={{
                    color: '#666',
                    fontSize: '1rem',
                    lineHeight: 1.8,
                    mb: 4,
                    maxWidth: 500,
                    mx: 'auto',
                  }}
                >
                  The most comprehensive online learning platform that provides general information and also from other perspectives
                </Typography>
                <Button
                  component={Link}
                  to="/courses"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: '#FD7E14',
                    color: 'white',
                    px: 5,
                    py: 1.5,
                    borderRadius: '50px',
                    fontSize: '1rem',
                    fontWeight: 700,
                    textTransform: 'none',
                    boxShadow: '0 8px 20px rgba(253, 126, 20, 0.3)',
                    '&:hover': {
                      bgcolor: '#E56D0F',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 12px 28px rgba(253, 126, 20, 0.4)',
                    },
                    transition: 'all 0.3s',
                  }}
                >
                  Explore Courses
                </Button>
              </Box>
            </Grid>

            {/* Right Student Image */}
            <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Box
                  sx={{
                    width: 220,
                    height: 280,
                    borderRadius: '50%',
                    border: '8px solid white',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    bgcolor: 'transparent',
                  }}
                >
                  {/* Placeholder for student image */}
                  <Box
                    component="img"
                    src="/about1 (2).png"
                    alt="Student"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <Box
                    sx={{
                      display: 'none',
                      width: '100%',
                      height: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#FAF1E6',
                    }}
                  >
                    <Groups sx={{ fontSize: 80, color: '#FD7E14' }} />
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>

        {/* Decorative Elements at bottom */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -50,
            left: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: 'rgba(253, 126, 20, 0.05)',
            zIndex: 0,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: -30,
            right: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            bgcolor: 'rgba(253, 126, 20, 0.05)',
            zIndex: 0,
          }}
        />
      </Box>

      {/* Mission & Vision Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={6}>
          {/* Mission */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}
            >
              <CardContent sx={{ p: 5 }}>
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    bgcolor: 'rgba(253, 126, 20, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <TrendingUp sx={{ fontSize: 36, color: '#FD7E14' }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#1A1A1A',
                    mb: 3,
                  }}
                >
                  Our Mission
                </Typography>
                <Typography
                  sx={{
                    color: '#666',
                    fontSize: '1.05rem',
                    lineHeight: 1.8,
                  }}
                >
                  To empower learners worldwide with accessible, high-quality education that transforms lives and opens doors to new opportunities.
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          {/* Vision */}
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                height: '100%',
                borderRadius: '20px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
                transition: 'transform 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                },
              }}
            >
              <CardContent sx={{ p: 5 }}>
                <Box
                  sx={{
                    width: 70,
                    height: 70,
                    borderRadius: '50%',
                    bgcolor: 'rgba(253, 126, 20, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                  }}
                >
                  <EmojiObjects sx={{ fontSize: 36, color: '#FD7E14' }} />
                </Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    color: '#1A1A1A',
                    mb: 3,
                  }}
                >
                  Our Vision
                </Typography>
                <Typography
                  sx={{
                    color: '#666',
                    fontSize: '1.05rem',
                    lineHeight: 1.8,
                  }}
                >
                  To be the leading online learning platform that inspires innovation, creativity, and lifelong learning for everyone, everywhere.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Box sx={{ bgcolor: 'white', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography
              sx={{
                color: '#FD7E14',
                fontSize: '0.95rem',
                fontWeight: 600,
                mb: 2,
                textTransform: 'uppercase',
                letterSpacing: 1,
              }}
            >
              Why Choose Us
            </Typography>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 800,
                color: '#1A1A1A',
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' },
              }}
            >
              What Makes Us Special
            </Typography>
            <Typography
              sx={{
                color: '#666',
                fontSize: '1.1rem',
                maxWidth: 600,
                mx: 'auto',
              }}
            >
              Discover the features that make IremeHub Academy the best choice for your learning journey
            </Typography>
          </Box>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    borderRadius: '16px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: '0 12px 40px rgba(253, 126, 20, 0.15)',
                    },
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box sx={{ mb: 3 }}>{feature.icon}</Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 700,
                        color: '#1A1A1A',
                        mb: 2,
                      }}
                    >
                      {feature.title}
                    </Typography>
                    <Typography
                      sx={{
                        color: '#666',
                        fontSize: '0.95rem',
                        lineHeight: 1.7,
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Become a Tutor Section */}
      <Box sx={{ bgcolor: 'white', py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                sx={{
                  color: '#FD7E14',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  mb: 2,
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                }}
              >
                Join Our Team
              </Typography>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: '#1A1A1A',
                  mb: 3,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}
              >
                Become a Tutor
              </Typography>
              <Typography
                sx={{
                  color: '#666',
                  fontSize: '1.05rem',
                  lineHeight: 1.8,
                  mb: 4,
                }}
              >
                Share your knowledge and expertise with students around the world. Join our community of passionate educators and make a difference in learners' lives while earning income doing what you love.
              </Typography>
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: 'rgba(253, 126, 20, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Verified sx={{ fontSize: 20, color: '#FD7E14' }} />
                  </Box>
                  <Typography sx={{ color: '#1A1A1A', fontSize: '1rem' }}>
                    Flexible schedule - teach on your own time
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: 'rgba(253, 126, 20, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <TrendingUp sx={{ fontSize: 20, color: '#FD7E14' }} />
                  </Box>
                  <Typography sx={{ color: '#1A1A1A', fontSize: '1rem' }}>
                    Earn competitive income
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      bgcolor: 'rgba(253, 126, 20, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Groups sx={{ fontSize: 20, color: '#FD7E14' }} />
                  </Box>
                  <Typography sx={{ color: '#1A1A1A', fontSize: '1rem' }}>
                    Join a supportive community of educators
                  </Typography>
                </Box>
              </Box>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: '#FD7E14',
                  color: 'white',
                  px: 5,
                  py: 1.5,
                  borderRadius: '50px',
                  fontSize: '1rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  boxShadow: '0 8px 20px rgba(253, 126, 20, 0.3)',
                  '&:hover': {
                    bgcolor: '#E56D0F',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 28px rgba(253, 126, 20, 0.4)',
                  },
                  transition: 'all 0.3s',
                }}
              >
                Apply to Teach
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  width: '100%',
                  height: 400,
                  borderRadius: '20px',
                  bgcolor: '#FAF1E6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <School sx={{ fontSize: 120, color: '#FD7E14', opacity: 0.3 }} />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            sx={{
              color: '#FD7E14',
              fontSize: '0.95rem',
              fontWeight: 600,
              mb: 2,
              textTransform: 'uppercase',
              letterSpacing: 1,
            }}
          >
            Got Questions?
          </Typography>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 800,
              color: '#1A1A1A',
              mb: 2,
              fontSize: { xs: '2rem', md: '2.5rem' },
            }}
          >
            Frequently Asked Questions
          </Typography>
          <Typography
            sx={{
              color: '#666',
              fontSize: '1.1rem',
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            Find answers to common questions about our platform
          </Typography>
        </Box>

        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          {[
            {
              id: 'panel1',
              question: 'How do I enroll in a course?',
              answer: 'Simply browse our course catalog, select the course you want, and click "Enroll Now". You can start learning immediately after enrollment.',
            },
            {
              id: 'panel2',
              question: 'Are the courses free?',
              answer: 'We offer both free and paid courses. Free courses give you access to basic content, while paid courses include certificates, assignments, and additional resources.',
            },
            {
              id: 'panel3',
              question: 'Will I receive a certificate?',
              answer: 'Yes! Upon successful completion of a course, you will receive a certificate that you can share on your resume and social media profiles.',
            },
            {
              id: 'panel4',
              question: 'Can I learn at my own pace?',
              answer: 'Absolutely! All our courses are self-paced, allowing you to learn whenever and wherever you want.',
            },
            {
              id: 'panel5',
              question: 'How do I become a tutor?',
              answer: 'Click on "Apply to Teach" in the Become a Tutor section, fill out the application form, and our team will review your credentials. We\'ll get back to you within 3-5 business days.',
            },
          ].map((faq) => (
            <Accordion
              key={faq.id}
              expanded={expanded === faq.id}
              onChange={handleAccordionChange(faq.id)}
              sx={{
                mb: 2,
                borderRadius: '12px !important',
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                '&:before': {
                  display: 'none',
                },
                '&.Mui-expanded': {
                  boxShadow: '0 4px 16px rgba(253, 126, 20, 0.15)',
                },
                transition: 'all 0.3s',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMore sx={{ color: '#FD7E14' }} />}
                sx={{
                  px: 3,
                  py: 1.5,
                  '&.Mui-expanded': {
                    borderBottom: '1px solid rgba(253, 126, 20, 0.1)',
                  },
                  '& .MuiAccordionSummary-content': {
                    my: 1.5,
                  },
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    color: expanded === faq.id ? '#FD7E14' : '#1A1A1A',
                    fontSize: '1.1rem',
                    transition: 'color 0.3s',
                  }}
                >
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  px: 3,
                  py: 2.5,
                  bgcolor: 'rgba(250, 241, 230, 0.3)',
                }}
              >
                <Typography
                  sx={{
                    color: '#666',
                    fontSize: '1rem',
                    lineHeight: 1.8,
                  }}
                >
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default About;
