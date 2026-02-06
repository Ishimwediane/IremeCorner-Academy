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
        bgcolor: '#FAF1E6', // Cream Background (Our Color)
        pt: 8,
        pb: 4,
        mt: 0, // Removed margin as it usually follows a dark section or should sit flush
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Brand Section */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              {/* Optional Logo Icon if needed, or just text */}
              <Typography
                variant="h5"
                sx={{
                  color: '#1A1A1A', // Dark Grey
                  fontWeight: 800,
                  letterSpacing: 1,
                }}
              >
                IREMECORNER
              </Typography>
            </Box>

            <Typography
              sx={{
                color: '#FD7E14',
                fontWeight: 700,
                fontSize: '0.9rem',
                mb: 3,
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}
            >
              Online Academy
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
                    bgcolor: 'rgba(253, 126, 20, 0.1)', // Light Orange bg
                    color: '#FD7E14', // Orange Icon
                    width: 40,
                    height: 40,
                    '&:hover': {
                      bgcolor: '#FD7E14',
                      color: 'white',
                    },
                  }}
                >
                  <Icon fontSize="small" />
                </IconButton>
              ))}
            </Box>
          </Grid>

          {/* Navigation Links */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ color: '#1A1A1A', fontWeight: 700, mb: 3 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {/* Reorganized to vertical for better footer layout, or keep horizontal if preferred. Vertical is more standard for light footers. */}
              {['Home', 'Courses', 'About Us', 'Contact Us'].map((text) => (
                <Typography
                  key={text}
                  component={Link}
                  to={text === 'Home' ? '/' : `/${text.toLowerCase().replace(' ', '-')}`}
                  sx={{
                    color: '#666',
                    textDecoration: 'none',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    width: 'fit-content',
                    '&:hover': { color: '#FD7E14' },
                  }}
                >
                  {text}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Contact Information */}
          <Grid item xs={12} md={5}>
            <Typography variant="h6" sx={{ color: '#1A1A1A', fontWeight: 700, mb: 3 }}>
              Contact
            </Typography>
            <Typography
              sx={{
                color: '#666',
                fontSize: '0.95rem',
                lineHeight: 1.8,
                mb: 2,
              }}
            >
              IremeCorner Academy, 123 Education Street
              <br />
              Learning City, LC 12345
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>
                <Box component="span" sx={{ color: '#1A1A1A', fontWeight: 600 }}>Email:</Box> info@iremecorner.com
              </Typography>
              <Typography sx={{ color: '#666', fontSize: '0.95rem' }}>
                <Box component="span" sx={{ color: '#1A1A1A', fontWeight: 600 }}>Phone:</Box> +1 (234) 567-8900
              </Typography>
            </Box>
          </Grid>
        </Grid>

        {/* Bottom Section */}
        <Box
          sx={{
            mt: 6,
            pt: 3,
            borderTop: '1px solid rgba(0,0,0,0.05)',
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
              color: '#888',
              fontSize: '0.85rem',
              textAlign: { xs: 'center', md: 'left' },
            }}
          >
            Powered by IremeCorner Academy © {new Date().getFullYear()} All Rights Reserved.
          </Typography>

          {/* Payment Methods */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography
              sx={{
                color: '#888',
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
                  bgcolor: 'white',
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '4px',
                  color: '#666',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  border: '1px solid #eee',
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

