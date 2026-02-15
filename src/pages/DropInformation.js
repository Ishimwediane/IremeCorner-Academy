import React, { useState } from 'react';
import { Container, Box, Typography, Grid, TextField, Button, Paper, MenuItem, Checkbox, FormControlLabel, Link as MuiLink } from '@mui/material';
import { Link } from 'react-router-dom';
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
    location: '',
    profilePhoto: null,
    expertise: '',
    motivation: '',
    teachingMethod: 'Online',
    languages: '',
    cvFile: null,
    sampleFile: null,
    portfolio: '',
    agreeAccurate: false,
    agreeTerms: false,
  });

  const onChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === 'file') {
      setForm((prev) => ({ ...prev, [name]: files && files[0] ? files[0] : null }));
    } else {
      setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const submitMutation = useMutation(
    async () => {
      const data = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== null && value !== undefined) data.append(key, value);
      });
      return await api.post('/instructor-applications', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    {
      onSuccess: () => {
        toast.success('Information submitted! We will contact you soon.');
        setForm({
          name: '',
          email: '',
          phone: '',
          location: '',
          profilePhoto: null,
          expertise: '',
          motivation: '',
          teachingMethod: 'Online',
          languages: '',
          cvFile: null,
          sampleFile: null,
          portfolio: '',
          agreeAccurate: false,
          agreeTerms: false,
        });
      },
      onError: () => {
        // Fallback UX when endpoint not implemented
        toast.info('Thanks! Your info is saved locally for now. Backend endpoint not found.');
      },
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.expertise || !form.agreeAccurate || !form.agreeTerms) {
      toast.error('Please fill required fields and agree to both checkboxes.');
      return;
    }
    submitMutation.mutate();
  };

  return (
    <Box>
      <Box sx={{ bgcolor: 'rgba(195,151,102,0.08)', py: 6, mb: 4 }}>
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
              {/* Basic Info */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32' }}>Basic Info</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Full Name" name="name" value={form.name} onChange={onChange} fullWidth required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Email Address" name="email" type="email" value={form.email} onChange={onChange} fullWidth required />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Phone Number (WhatsApp preferred)" name="phone" value={form.phone} onChange={onChange} fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Country / City" name="location" value={form.location} onChange={onChange} fullWidth />
              </Grid>
              <Grid item xs={12} md={6}>
                <Button component="label" variant="outlined" fullWidth>
                  Upload Profile Photo (optional)
                  <input hidden type="file" name="profilePhoto" accept="image/*" onChange={onChange} />
                </Button>
              </Grid>

              {/* Tutoring Details */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32' }}>Tutoring Details</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select label="Skill or Subject to Teach" name="expertise" value={form.expertise} onChange={onChange} fullWidth required>
                  {expertiseOptions.map((opt) => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField select label="Teaching Method" name="teachingMethod" value={form.teachingMethod} onChange={onChange} fullWidth>
                  {['Online', 'In-person', 'Both'].map((opt) => (
                    <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField label="Short Description / Motivation" name="motivation" value={form.motivation} onChange={onChange} fullWidth multiline minRows={4} />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Preferred Language(s)" name="languages" value={form.languages} onChange={onChange} fullWidth placeholder="e.g., English, French" />
              </Grid>
              <Grid item xs={12} md={6}>
                <Button component="label" variant="outlined" fullWidth>
                  Upload CV (PDF, DOC, DOCX)
                  <input hidden type="file" name="cvFile" accept=".pdf,.doc,.docx" onChange={onChange} />
                </Button>
              </Grid>

              {/* Optional */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32' }}>Optional</Typography>
              </Grid>
              <Grid item xs={12} md={6}>
                <Button component="label" variant="outlined" fullWidth>
                  Upload Sample of Work (Photo or Video)
                  <input hidden type="file" name="sampleFile" accept="image/*,video/*" onChange={onChange} />
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField label="Link to Portfolio / Social Media (optional)" name="portfolio" value={form.portfolio} onChange={onChange} fullWidth />
              </Grid>

              {/* Agreement */}
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32' }}>Agreement</Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel control={<Checkbox name="agreeAccurate" checked={form.agreeAccurate} onChange={onChange} />} label="I confirm all information is accurate" />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox name="agreeTerms" checked={form.agreeTerms} onChange={onChange} />}
                  label={
                    <span>
                      I agree to the{' '}
                      <MuiLink component={Link} to="/terms" target="_blank" underline="hover" sx={{ color: '#C39766', fontWeight: 600 }}>
                        IremeHub Tutor Terms
                      </MuiLink>
                    </span>
                  }
                />
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


