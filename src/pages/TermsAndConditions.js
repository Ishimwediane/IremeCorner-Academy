import React, { useState } from 'react';
import { Container, Box, Typography, Grid, Paper } from '@mui/material';

const sections = [
  { id: 'welcome', title: 'Welcome to IremeCorner', content: 'Welcome to IremeCorner Academy. By accessing or using our platform, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.' },
  { id: 'account', title: 'Account Terms', content: 'To use certain features of IremeCorner, you must create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.' },
  { id: 'company', title: 'Company Terms', content: 'IremeCorner Academy reserves the right to modify, suspend, or discontinue any aspect of the platform at any time. We may also impose limits on certain features or restrict your access to parts or all of the platform without notice or liability.' },
  { id: 'activation', title: 'Account Activation', content: 'Your account will be activated upon successful registration. For trainer accounts, additional verification may be required. We reserve the right to refuse service, terminate accounts, or remove content at our sole discretion.' },
];

const TermsAndConditions = () => {
  const [activeSection, setActiveSection] = useState('welcome');

  const activeContent = sections.find(s => s.id === activeSection) || sections[0];

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #202F32 0%, rgba(32,47,50,0.95) 50%, rgba(168,72,54,0.1) 100%)',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              mb: 1,
            }}
          >
            <Box component="span" sx={{ color: 'rgba(255,255,255,0.95)' }}>
              Terms of{' '}
            </Box>
            <Box component="span" sx={{ color: '#A84836' }}>
              Service
            </Box>
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
            Last Updated {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </Typography>
        </Box>

        {/* Two Column Layout */}
        <Grid container spacing={4}>
          {/* Left Sidebar Navigation */}
          <Grid item xs={12} md={3}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                p: 2,
                position: 'sticky',
                top: 20,
              }}
            >
              {sections.map((section) => (
                <Box
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  sx={{
                    position: 'relative',
                    py: 1.5,
                    px: 2,
                    mb: 1,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    bgcolor: activeSection === section.id ? 'rgba(168,72,54,0.2)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(255,255,255,0.05)',
                    },
                  }}
                >
                  {activeSection === section.id && (
                    <Box
                      sx={{
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 4,
                        height: '60%',
                        bgcolor: '#A84836',
                        borderRadius: '0 4px 4px 0',
                      }}
                    />
                  )}
                  <Typography
                    sx={{
                      color: activeSection === section.id ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.6)',
                      fontWeight: activeSection === section.id ? 600 : 400,
                      fontSize: '0.95rem',
                      pl: activeSection === section.id ? 1.5 : 0,
                      transition: 'all 0.2s',
                    }}
                  >
                    {section.title}
                  </Typography>
                </Box>
              ))}
            </Paper>
          </Grid>

          {/* Right Content Area */}
          <Grid item xs={12} md={9}>
            <Paper
              elevation={0}
              sx={{
                bgcolor: 'rgba(255,255,255,0.05)',
                borderRadius: '12px',
                p: { xs: 3, md: 5 },
                minHeight: 500,
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  color: 'rgba(255,255,255,0.95)',
                  fontWeight: 700,
                  mb: 3,
                }}
              >
                {activeContent.title}
              </Typography>

              <Typography
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: 1.8,
                  fontSize: '1rem',
                  mb: 3,
                }}
              >
                {activeContent.content}
              </Typography>

              {/* Additional detailed content based on section */}
              {activeSection === 'welcome' && (
                <Box>
                  <Typography
                    sx={{
                      color: '#ffffff',
                      fontWeight: 600,
                      mb: 1.5,
                      mt: 3,
                    }}
                  >
                    IremeCorner Services Agreement
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      lineHeight: 1.8,
                      mb: 2,
                    }}
                  >
                    This agreement governs your use of IremeCorner Academy's online learning platform. By using our services, you acknowledge that you have read, understood, and agree to be bound by these terms.
                  </Typography>
                </Box>
              )}

              {activeSection === 'account' && (
                <Box>
                  <Typography
                    sx={{
                      color: '#ffffff',
                      fontWeight: 600,
                      mb: 1.5,
                      mt: 3,
                    }}
                  >
                    Account Responsibilities
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      lineHeight: 1.8,
                      mb: 2,
                    }}
                  >
                    You are responsible for all activities that occur under your account. You must immediately notify us of any unauthorized use of your account or any other breach of security. We are not liable for any loss or damage arising from your failure to comply with this section.
                  </Typography>
                  <Typography
                    sx={{
                      color: '#ffffff',
                      fontWeight: 600,
                      mb: 1.5,
                      mt: 2,
                    }}
                  >
                    Primary Email Address
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      lineHeight: 1.8,
                    }}
                  >
                    Your primary email address is used for account verification and important communications. Ensure it remains active and accessible.
                  </Typography>
                </Box>
              )}

              {activeSection === 'company' && (
                <Box>
                  <Typography
                    sx={{
                      color: '#ffffff',
                      fontWeight: 600,
                      mb: 1.5,
                      mt: 3,
                    }}
                  >
                    Platform Modifications
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      lineHeight: 1.8,
                      mb: 2,
                    }}
                  >
                    IremeCorner Academy reserves the right to modify, update, or discontinue any feature of the platform at any time. We will make reasonable efforts to notify users of significant changes, but are not obligated to do so.
                  </Typography>
                </Box>
              )}

              {activeSection === 'activation' && (
                <Box>
                  <Typography
                    sx={{
                      color: '#ffffff',
                      fontWeight: 600,
                      mb: 1.5,
                      mt: 3,
                    }}
                  >
                    Verification Process
                  </Typography>
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.8)',
                      lineHeight: 1.8,
                      mb: 2,
                    }}
                  >
                    Trainer accounts may require additional verification including identity confirmation, qualifications review, and background checks. This process helps maintain the quality and integrity of our platform.
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default TermsAndConditions;
