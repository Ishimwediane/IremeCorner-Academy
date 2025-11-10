import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

 const handleSubmit = async (e) => {
  e.preventDefault();
  console.log('Form submit clicked. Current state:', { email, password });
  
  if (!email || !password) {
    setError('Please enter both email and password');
    return;
  }

  setError('');
  setLoading(true);

  try {
    const loginData = { email: email.trim(), password };
    console.log('Calling login with:', loginData);
    const user = await login(loginData);
    toast.success(`Welcome back, ${user.name}!`);
  } catch (err) {
    console.error('Login error in handleSubmit:', err);
    setError(err.message);
    toast.error(err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            margin="normal"
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>

        <Box textAlign="center" sx={{ mt: 2 }}>
          <Typography variant="body2">
            Don't have an account? <Link to="/register">Register here</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;












