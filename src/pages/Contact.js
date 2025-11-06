import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
} from '@mui/material';
import {
  LocationOn,
  Email,
  Phone,
  Print,
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../utils/api';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // You can replace this with your actual API endpoint
      await api.post('/contact', formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 70px)',
        bgcolor: 'rgba(255, 240, 235, 0.3)',
        py: 8,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={8}
          sx={{
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}
        >
          <Grid container>
            {/* Left Column - Contact Information (Red/Chocolate) */}
            <Grid
              item
              xs={12}
              md={5}
              sx={{
                bgcolor: '#A84836',
                color: 'white',
                p: { xs: 4, md: 6 },
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  mb: 4,
                  color: 'white',
                }}
              >
                Contact Us
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Address */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <LocationOn sx={{ fontSize: 24, mt: 0.5, flexShrink: 0 }} />
                  <Box>
                    <Typography sx={{ fontSize: '1rem', lineHeight: 1.6 }}>
                      IremeCorner Academy
                      <br />
                      123 Education Street
                      <br />
                      Learning City, LC 12345
                    </Typography>
                  </Box>
                </Box>

                {/* Email */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Email sx={{ fontSize: 24, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '1rem' }}>
                    info@iremecorner.com
                  </Typography>
                </Box>

                {/* Phone */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Phone sx={{ fontSize: 24, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '1rem' }}>
                    +1 (234) 567-8900
                  </Typography>
                </Box>

                {/* Fax */}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Print sx={{ fontSize: 24, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '1rem' }}>
                    +1 (234) 567-8901
                  </Typography>
                </Box>
              </Box>
            </Grid>

            {/* Right Column - Contact Form (White) */}
            <Grid
              item
              xs={12}
              md={7}
              sx={{
                bgcolor: 'white',
                p: { xs: 4, md: 6 },
              }}
            >
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  color: '#202F32',
                  mb: 1,
                }}
              >
                Get in Touch
              </Typography>
              <Typography
                sx={{
                  color: 'rgba(32,47,50,0.7)',
                  mb: 4,
                  fontSize: '1rem',
                }}
              >
                Feel free to drop us a line below!
              </Typography>

              <Box component="form" onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                  {/* Name Field */}
                  <TextField
                    fullWidth
                    name="name"
                    label="Your Name"
                    placeholder="Your Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: 'rgba(32,47,50,0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#A84836',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#A84836',
                        },
                      },
                    }}
                  />

                  {/* Email Field */}
                  <TextField
                    fullWidth
                    name="email"
                    type="email"
                    label="Your Email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: 'rgba(32,47,50,0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#A84836',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#A84836',
                        },
                      },
                    }}
                  />

                  {/* Message Field */}
                  <TextField
                    fullWidth
                    name="message"
                    label="Your Message"
                    placeholder="Typing your message here....."
                    value={formData.message}
                    onChange={handleChange}
                    required
                    multiline
                    rows={6}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        '& fieldset': {
                          borderColor: 'rgba(32,47,50,0.2)',
                        },
                        '&:hover fieldset': {
                          borderColor: '#A84836',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#A84836',
                        },
                      },
                    }}
                  />
                </Box>

                {/* Submit Button */}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    bgcolor: '#A84836',
                    color: 'white',
                    px: 5,
                    py: 1.5,
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '1rem',
                    textTransform: 'uppercase',
                    '&:hover': {
                      bgcolor: '#8f3b2d',
                    },
                    '&:disabled': {
                      bgcolor: 'rgba(168,72,54,0.5)',
                    },
                  }}
                >
                  {isSubmitting ? 'Sending...' : 'Send'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
};

export default Contact;

