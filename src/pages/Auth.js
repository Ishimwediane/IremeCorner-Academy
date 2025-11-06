import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import { School, Phone, Email } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Auth = () => {
  const location = useLocation();
  const [tab, setTab] = useState(location.pathname === '/login' ? 1 : 0); // 0 = Sign Up, 1 = Sign In
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    setTab(location.pathname === '/login' ? 1 : 0);
  }, [location.pathname]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (tab === 1) {
      // Login
      const result = await login(formData.email, formData.password);
      if (result.success) {
        toast.success('Login successful!');
        navigate('/dashboard');
      } else {
        setError(result.error || 'Login failed');
        toast.error(result.error || 'Login failed');
      }
    } else {
      // Register
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
      if (result.success) {
        toast.success('Registration successful!');
        navigate('/dashboard');
      } else {
        setError(result.error || 'Registration failed');
        toast.error(result.error || 'Registration failed');
      }
    }
    setLoading(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#202F32', display: 'flex', alignItems: 'center', py: 4 }}>
      <Container maxWidth="lg">
        <Paper
          elevation={0}
          sx={{
            borderRadius: '24px',
            overflow: 'hidden',
            display: 'flex',
            minHeight: 600,
          }}
        >
          {/* Left Panel - Visual */}
          <Box
            sx={{
              flex: 1,
              background: 'linear-gradient(180deg, rgba(168,72,54,0.3) 0%, rgba(32,47,50,0.5) 100%)',
              position: 'relative',
              display: { xs: 'none', md: 'flex' },
              flexDirection: 'column',
              justifyContent: 'space-between',
              p: 4,
              overflow: 'hidden',
            }}
          >
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, zIndex: 2 }}>
              <School sx={{ color: 'white', fontSize: 32 }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 700 }}>
                IremeCorner Academy
              </Typography>
            </Box>

            {/* Central Image */}
            <Box sx={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
              <Box
                component="img"
                src="/hero.gif"
                alt="Learning"
                sx={{
                  width: '80%',
                  maxWidth: 400,
                  height: 'auto',
                  borderRadius: '16px',
                  objectFit: 'cover',
                }}
              />
            </Box>

            {/* Abstract Shapes */}
            <Box sx={{ position: 'absolute', top: 60, right: 40, width: 80, height: 80, bgcolor: '#A84836', borderRadius: '50%', opacity: 0.3 }} />
            <Box sx={{ position: 'absolute', top: 120, left: 20, width: 120, height: 40, bgcolor: '#2E7D32', borderRadius: '20px', opacity: 0.25, transform: 'rotate(-15deg)' }} />
            <Box sx={{ position: 'absolute', bottom: 100, right: 60, width: 100, height: 100, bgcolor: '#A84836', borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', opacity: 0.2 }} />

            {/* Copyright */}
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', zIndex: 2 }}>
              Copyright © {new Date().getFullYear()}, IremeCorner Academy. All rights reserved.
            </Typography>
          </Box>

          {/* Right Panel - Form */}
          <Box
            sx={{
              flex: 1,
              bgcolor: 'white',
              p: { xs: 3, md: 5 },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Tabs */}
            <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)} sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="Sign Up" sx={{ flex: 1, fontWeight: tab === 0 ? 700 : 400, color: tab === 0 ? '#202F32' : 'rgba(32,47,50,0.5)' }} />
              <Tab label="Sign In" sx={{ flex: 1, fontWeight: tab === 1 ? 700 : 400, color: tab === 1 ? '#202F32' : 'rgba(32,47,50,0.5)' }} />
            </Tabs>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              {tab === 0 && (
                <>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    margin="normal"
                    required
                    sx={{ '& .MuiInput-underline:before': { borderBottomColor: '#e0e0e0' } }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    select
                    label="Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    margin="normal"
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="trainer">Trainer</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                </>
              )}
              {tab === 1 && (
                <>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    required
                  />
                </>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  py: 1.5,
                  borderRadius: '8px',
                  bgcolor: '#A84836',
                  '&:hover': { bgcolor: '#8f3b2d' },
                  fontWeight: 700,
                }}
                disabled={loading}
              >
                {loading ? (tab === 0 ? 'Registering...' : 'Logging in...') : tab === 0 ? 'Sign Up' : 'Sign In'}
              </Button>

              {tab === 1 && (
                <Box textAlign="center" sx={{ mb: 3 }}>
                  <Typography variant="body2" component={Link} to="/register" onClick={() => setTab(0)} sx={{ color: '#A84836', textDecoration: 'none' }}>
                    I have an Account?
                  </Typography>
                </Box>
              )}
            </form>

            {/* Contact Info */}
            <Box sx={{ mt: 'auto', pt: 3, borderTop: 1, borderColor: 'divider' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Phone sx={{ fontSize: 18, color: 'rgba(32,47,50,0.6)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(32,47,50,0.6)' }}>
                  Contact us for support
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ fontSize: 18, color: 'rgba(32,47,50,0.6)' }} />
                <Typography variant="body2" sx={{ color: 'rgba(32,47,50,0.6)' }}>
                  info@iremecorner.com
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Auth;

