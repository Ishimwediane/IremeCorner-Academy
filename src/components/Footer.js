import React from 'react';
import { Link } from 'react-router-dom';
import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  YouTube,
} from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      sx={{
        bgcolor: '#202F32',
        borderTop: '4px solid #A84836',
        borderBottom: '4px solid #A84836',
        py: 5,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                fontWeight: 800,
                mb: 1,
                letterSpacing: 1,
              }}
            >
              IREMECORNER
            </Typography>
            <Typography
              sx={{
                color: '#A84836',
                fontWeight: 600,
                fontSize: '0.9rem',
                mb: 3,
              }}
            >
              ONLINE ACADEMY
            </Typography>

            {/* Social Media Icons */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              {[
                { icon: Facebook, name: 'Facebook' },
                { icon: Twitter, name: 'Twitter' },
                { icon: Instagram, name: 'Instagram' },
                { icon: LinkedIn, name: 'LinkedIn' },
                { icon: YouTube, name: 'YouTube' },
              ].map(({ icon: Icon, name }) => (
                <IconButton
                  key={name}
                  sx={{
                    bgcolor: 'rgba(255,255,255,0.1)',
                    color: 'white',
                    width: 40,
                    height: 40,
                    '&:hover': {
                      bgcolor: '#A84836',
                    },
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Navigation Links - Horizontal (matching navbar) */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', alignItems: 'center' }}>
              <Typography
                component={Link}
                to="/"
                sx={{
                  color: '#A84836',
                  fontWeight: 600,
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { color: '#b86d5a' },
                }}
              >
                Home
              </Typography>
              <Typography
                component={Link}
                to="/courses"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { color: 'white' },
                }}
              >
                Courses
              </Typography>
              <Typography
                component={Link}
                to="/#about"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { color: 'white' },
                }}
              >
                About Us
              </Typography>
              <Typography
                component={Link}
                to="/#contact"
                sx={{
                  color: 'rgba(255,255,255,0.8)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  '&:hover': { color: 'white' },
                }}
              >
                Contact Us
              </Typography>
            </Box>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.9rem',
                lineHeight: 1.8,
                mb: 2,
              }}
            >
              IremeCorner Academy, 123 Education Street
              <br />
              Learning City, LC 12345
              <br />
              Email: info@iremecorner.com
              <br />
              Call Us: +1 (234) 567-8900
            </Typography>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Box
          sx={{
            mt: 4,
            pt: 3,
            borderTop: '1px solid rgba(255,255,255,0.1)',
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Copyright */}
          <Typography
            sx={{
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.85rem',
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            Powered by IremeCorner Academy © {new Date().getFullYear()} All Rights Reserved.
          </Typography>

          {/* Payment Methods (Placeholder icons) */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.7)',
                fontSize: '0.85rem',
                mr: 1,
              }}
            >
              We Accept:
            </Typography>
            {['Visa', 'Mastercard', 'PayPal'].map((method) => (
              <Box
                key={method}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '4px',
                  color: 'rgba(255,255,255,0.8)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {method}
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;

