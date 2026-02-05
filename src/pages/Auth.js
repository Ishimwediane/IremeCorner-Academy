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
      borderRadius: '30px',
      backgroundColor: 'white',
      '& fieldset': {
        borderColor: '#E0E0E0',
      },
      '&:hover fieldset': {
        borderColor: '#4FD1C5',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#4FD1C5',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#9E9E9E',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#4FD1C5',
    },
    mb: 2,
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#f8f9fa',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={5}
          sx={{
            borderRadius: '40px',
            overflow: 'hidden',
            display: 'flex',
            minHeight: '650px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          }}
        >
          {/* Left Side - Image */}
          <Box
            sx={{
              flex: 1,
              position: 'relative',
              display: { xs: 'none', md: 'block' },
            }}
          >
            <Box
              component="img"
              src="https://images.unsplash.com/photo-1577896336936-43a97577916a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Student raising hand"
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
                p: 6,
                background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
              }}
            >
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 700, mb: 1 }}>
                IremeCorner Academy
              </Typography>
              <Typography variant="h6" sx={{ color: 'white', opacity: 0.9 }}>
                Empower your future through learning.
              </Typography>
            </Box>
          </Box>

          {/* Right Side - Form */}
          <Box
            sx={{
              flex: 1,
              p: { xs: 4, md: 8 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 4, color: '#333' }}>
              Welcome to IremeCorner!
            </Typography>

            {/* Toggle Switch */}
            <Box
              sx={{
                bgcolor: '#80CBC4',
                borderRadius: '30px',
                p: 0.5,
                display: 'flex',
                mb: 4,
                width: 'fit-content',
                position: 'relative',
              }}
            >
              <Box
                onClick={() => handleToggleTab(1)}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: '25px',
                  cursor: 'pointer',
                  bgcolor: tab === 1 ? 'white' : 'transparent',
                  color: tab === 1 ? '#4FD1C5' : 'white',
                  fontWeight: 600,
                  transition: 'all 0.3s ease',
                  boxShadow: tab === 1 ? '0 2px 5px rgba(0,0,0,0.1)' : 'none',
                }}
              >
                Login
              </Box>
              <Box
                onClick={() => handleToggleTab(0)}
                sx={{
                  px: 4,
                  py: 1,
                  borderRadius: '25px',
                  cursor: 'pointer',
                  bgcolor: tab === 0 ? 'white' : 'transparent',
                  color: tab === 0 ? '#4FD1C5' : 'white',
                  fontWeight: 600,
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
              sx={{ color: '#666', mb: 4, maxWidth: '400px' }}
            >
              Join our community to access premium courses, quizzes, and connect with expert trainers.
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3, width: '100%', borderRadius: '12px' }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', maxWidth: '400px' }}>
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
                  />
                  <TextField
                    fullWidth
                    select
                    label="User Role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    sx={textFieldStyle}
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
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={togglePasswordVisibility} edge="end">
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
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton onClick={togglePasswordVisibility} edge="end">
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <FormControlLabel
                      control={<Checkbox sx={{ color: '#4FD1C5', '&.Mui-checked': { color: '#4FD1C5' } }} />}
                      label={<Typography variant="body2" sx={{ color: '#666' }}>Remember me</Typography>}
                    />
                    <Typography
                      component="span"
                      sx={{ color: '#666', fontSize: '0.875rem', cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
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
                  bgcolor: '#4FD1C5',
                  color: 'white',
                  py: 1.5,
                  borderRadius: '30px',
                  fontWeight: 700,
                  fontSize: '1rem',
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(79, 209, 197, 0.4)',
                  '&:hover': {
                    bgcolor: '#38B2AC',
                    boxShadow: '0 6px 20px rgba(79, 209, 197, 0.6)',
                  },
                  mb: 2,
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
