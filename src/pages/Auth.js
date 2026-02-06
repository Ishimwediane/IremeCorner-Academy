import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
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
  const [showPassword, setShowPassword] = useState(false);
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

  const handleToggleTab = (newTab) => {
    setTab(newTab);
    navigate(newTab === 1 ? '/login' : '/register');
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
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else if (result.user.role === 'trainer') {
          navigate('/trainer/dashboard');
        } else {
          navigate('/learner/dashboard');
        }
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
        if (result.user.role === 'admin') {
          navigate('/admin');
        } else if (result.user.role === 'trainer') {
          navigate('/trainer/dashboard');
        } else {
          navigate('/learner/dashboard');
        }
      } else {
        setError(result.error || 'Registration failed');
        toast.error(result.error || 'Registration failed');
      }
    }
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const textFieldStyle = {
    '& .MuiOutlinedInput-root': {
      borderRadius: '12px',
      backgroundColor: '#F8F9FA',
      '& fieldset': {
        borderColor: '#E0E0E0',
      },
      '&:hover fieldset': {
        borderColor: '#FD7E14',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#FD7E14',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#9E9E9E',
      fontSize: '0.9rem',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#FD7E14',
    },
    mb: 1.5,
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#F5F5F5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="md">
        <Paper
          elevation={3}
          sx={{
            borderRadius: '24px',
            overflow: 'hidden',
            display: 'flex',
            maxWidth: '900px',
            margin: '0 auto',
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          }}
        >
          {/* Left Side - Image */}
          <Box
            sx={{
              flex: 1,
              position: 'relative',
              display: { xs: 'none', md: 'block' },
              minHeight: '600px',
            }}
          >
            <Box
              component="img"
              src="/test.jpg"
              alt="Student learning"
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            {/* Overlay Text */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                p: 4,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
              }}
            >
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                IremeCorner Academy
              </Typography>
              <Typography variant="body1" sx={{ color: 'white', opacity: 0.9 }}>
                Empower your future through learning.
              </Typography>
            </Box>
          </Box>

          {/* Right Side - Form */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 4, md: 5 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              bgcolor: 'white',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, color: '#1A1A1A', textAlign: 'center' }}>
              Welcome to IremeCorner!
            </Typography>

            {/* Toggle Switch */}
            <Box
              sx={{
                bgcolor: '#FD7E14',
                borderRadius: '30px',
                p: 0.5,
                display: 'flex',
                mb: 3,
                width: 'fit-content',
                margin: '0 auto 24px auto',
              }}
            >
              <Box
                onClick={() => handleToggleTab(1)}
                sx={{
                  px: 3,
                  py: 0.75,
                  borderRadius: '25px',
                  cursor: 'pointer',
                  bgcolor: tab === 1 ? 'white' : 'transparent',
                  color: tab === 1 ? '#FD7E14' : 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  boxShadow: tab === 1 ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                Login
              </Box>
              <Box
                onClick={() => handleToggleTab(0)}
                sx={{
                  px: 3,
                  py: 0.75,
                  borderRadius: '25px',
                  cursor: 'pointer',
                  bgcolor: tab === 0 ? 'white' : 'transparent',
                  color: tab === 0 ? '#FD7E14' : 'white',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  transition: 'all 0.3s ease',
                  boxShadow: tab === 0 ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                Register
              </Box>
            </Box>

            <Typography
              variant="body2"
              align="center"
              sx={{ color: '#666', mb: 3, fontSize: '0.875rem' }}
            >
              Join our community to access premium courses, quizzes, and connect with expert trainers.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2, borderRadius: '12px', fontSize: '0.875rem' }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
              {tab === 0 && (
                <>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    sx={textFieldStyle}
                    required
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    sx={textFieldStyle}
                    required
                    size="small"
                  />
                  <TextField
                    fullWidth
                    select
                    label="User Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    sx={textFieldStyle}
                    size="small"
                  >
                    <MenuItem value="student">Student</MenuItem>
                    <MenuItem value="trainer">Trainer</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    sx={textFieldStyle}
                    required
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={togglePasswordVisibility} edge="end" size="small">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    sx={textFieldStyle}
                    required
                    size="small"
                  />
                </>
              )}

              {tab === 1 && (
                <>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    sx={textFieldStyle}
                    required
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    sx={textFieldStyle}
                    required
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={togglePasswordVisibility} edge="end" size="small">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <FormControlLabel
                      control={<Checkbox size="small" sx={{ color: '#FD7E14', '&.Mui-checked': { color: '#FD7E14' } }} />}
                      label={<Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>Remember me</Typography>}
                    />
                    <Typography
                      component="span"
                      sx={{ color: '#666', fontSize: '0.875rem', cursor: 'pointer', '&:hover': { color: '#FD7E14' } }}
                    >
                      Forgot Password?
                    </Typography>
                  </Box>
                </>
              )}

              <Button
                type="submit"
                fullWidth
                disabled={loading}
                sx={{
                  bgcolor: '#FD7E14',
                  color: 'white',
                  py: 1.25,
                  borderRadius: '30px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(253, 126, 20, 0.4)',
                  '&:hover': {
                    bgcolor: '#E56D0F',
                    boxShadow: '0 6px 20px rgba(253, 126, 20, 0.6)',
                  },
                  mb: 0,
                }}
              >
                {loading ? 'Processing...' : tab === 1 ? 'Login' : 'Register'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Auth;
