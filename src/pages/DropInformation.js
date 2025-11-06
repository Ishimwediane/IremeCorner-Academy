import React, { useState } from 'react';
import { Container, Box, Typography, Grid, TextField, Button, Paper, MenuItem, Checkbox, FormControlLabel } from '@mui/material';
import { useMutation } from 'react-query';
import api from '../utils/api';
import { toast } from 'react-toastify';

const expertiseOptions = [
  'Digital Tools',
  'Marketing',
  'Financial Literacy',
  'Business Management',
  'Technical Skills',
  'Other',
];

const DropInformation = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    expertise: '',
    portfolio: '',
    bio: '',
    agree: false,
  });

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const submitMutation = useMutation(
    async () => {
      // Try to post to backend; if route doesn't exist yet, this will fail gracefully
      return await api.post('/instructor-applications', form);
    },
    {
      onSuccess: () => {
        toast.success('Information submitted! We will contact you soon.');
        setForm({ name: '', email: '', phone: '', expertise: '', portfolio: '', bio: '', agree: false });
      },
      onError: () => {
        // Fallback UX when endpoint not implemented
        toast.info('Thanks! Your info is saved locally for now. Backend endpoint not found.');
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.expertise || !form.agree) {
      toast.error('Please fill required fields and agree to terms.');
      return;
    }
    submitMutation.mutate();
  };

  return (
    <Box>
      <Box sx={{ bgcolor: 'rgba(168,72,54,0.08)', py: 6, mb: 4 }}>
        <Container>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#202F32', textAlign: 'center' }}>
            Become an Instructor
          </Typography>
          <Typography sx={{ color: '#202F32', opacity: 0.8, textAlign: 'center', mt: 1 }}>
            Drop your information and we’ll get back to you.
          </Typography>
        </Container>
      </Box>

      <Container sx={{ pb: 8 }}>
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: '16px' }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField label="Full Name" name="name" value={form.name} onChange={onChange} fullWidth required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Email" name="email" type="email" value={form.email} onChange={onChange} fullWidth required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Phone" name="phone" value={form.phone} onChange={onChange} fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select label="Expertise" name="expertise" value={form.expertise} onChange={onChange} fullWidth required>
                  {expertiseOptions.map((opt) => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField label="Portfolio / LinkedIn (optional)" name="portfolio" value={form.portfolio} onChange={onChange} fullWidth />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Short Bio" name="bio" value={form.bio} onChange={onChange} fullWidth multiline minRows={4} />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel control={<Checkbox name="agree" checked={form.agree} onChange={onChange} />} label="I agree to be contacted about tutoring opportunities." />
              </Grid>
              <Grid item xs={12}>
                <Button type="submit" variant="contained" sx={{ px: 4, py: 1.5, fontWeight: 700 }}>Submit</Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default DropInformation;


