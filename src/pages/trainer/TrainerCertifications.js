import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Tabs,
  Tab,
  Card,
  CardContent,
  MenuItem,
} from '@mui/material';
import {
  Download as DownloadIcon,
  CardMembership as CertificateIcon,
  UploadFile as UploadIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import TrainerLayout from '../../components/TrainerLayout';
import api from '../../utils/api';

const drawTemplate = (ctx, width, height, data, variant) => {
  ctx.clearRect(0, 0, width, height);
  // Background
  const bgColor = variant === 'classic' ? '#ffffff' : '#f8f5f0';
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  // Border
  ctx.strokeStyle = variant === 'classic' ? '#C39766' : '#7b68ee';
  ctx.lineWidth = 6;
  ctx.strokeRect(12, 12, width - 24, height - 24);
  // Title
  ctx.fillStyle = '#202F32';
  ctx.font = 'bold 32px Arial';
  ctx.fillText('Certificate of Completion', 40, 90);
  // Recipient
  ctx.font = '24px Arial';
  ctx.fillStyle = '#666';
  ctx.fillText('This certifies that', 40, 140);
  ctx.fillStyle = '#202F32';
  ctx.font = 'bold 36px Arial';
  ctx.fillText(data.recipientName || 'Recipient Name', 40, 190);
  // Course
  ctx.fillStyle = '#666';
  ctx.font = '20px Arial';
  ctx.fillText('has successfully completed the course', 40, 230);
  ctx.fillStyle = '#202F32';
  ctx.font = 'bold 26px Arial';
  ctx.fillText(data.courseTitle || 'Course Title', 40, 270);
  // Dates and number
  ctx.fillStyle = '#666';
  ctx.font = '16px Arial';
  ctx.fillText(`Date: ${data.issueDate || 'YYYY-MM-DD'}`, 40, 320);
  if (data.certificateNumber) ctx.fillText(`No: ${data.certificateNumber}`, 40, 345);
  // Trainer
  ctx.fillStyle = '#202F32';
  ctx.font = 'bold 18px Arial';
  ctx.fillText(data.trainerName || 'Trainer Name', 40, height - 80);
  ctx.font = '14px Arial';
  ctx.fillStyle = '#666';
  ctx.fillText('Instructor', 40, height - 60);
  // Signature
  if (data.signatureImg) {
    ctx.drawImage(data.signatureImg, width - 260, height - 120, 200, 60);
  }
  // Logo
  if (data.logoImg) {
    ctx.drawImage(data.logoImg, width - 140, 30, 100, 100);
  }
};

const TemplateDesigner = () => {
  const canvasRef = useRef(null);
  const [variant, setVariant] = useState('classic');
  const [form, setForm] = useState({ recipientName: '', courseTitle: '', issueDate: '', trainerName: '', certificateNumber: '' });
  const [logoPreview, setLogoPreview] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);

  const getImages = async () => {
    const data = { ...form };
    if (logoPreview) {
      const img = new Image();
      img.src = logoPreview;
      await new Promise((r) => (img.onload = r));
      data.logoImg = img;
    }
    if (signaturePreview) {
      const img = new Image();
      img.src = signaturePreview;
      await new Promise((r) => (img.onload = r));
      data.signatureImg = img;
    }
    return data;
  };

  useEffect(() => {
    const render = async () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const dataWithImages = await getImages();
      drawTemplate(ctx, canvas.width, canvas.height, dataWithImages, variant);
    };
    render();
  }, [variant, form, logoPreview, signaturePreview]);

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${Date.now()}.png`;
    a.click();
  };

  const onFile = (e, setter) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setter(reader.result);
    reader.readAsDataURL(file);
  };

  const saveTemplate = () => {
    const key = `trainer-cert-template-${variant}`;
    localStorage.setItem(key, JSON.stringify(form));
  };

  const loadTemplate = () => {
    const key = `trainer-cert-template-${variant}`;
    const saved = localStorage.getItem(key);
    if (saved) setForm(JSON.parse(saved));
  };

  return (
    <Paper sx={{ p: 3, borderRadius: '16px', mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32', mb: 2 }}>Template Designer</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Template Variant" value={variant} onChange={(e) => setVariant(e.target.value)}>
                <MenuItem value="classic">Classic (gold)
                </MenuItem>
                <MenuItem value="modern">Modern (purple)
                </MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Certificate Number" value={form.certificateNumber} onChange={(e) => setForm({ ...form, certificateNumber: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Recipient Name" value={form.recipientName} onChange={(e) => setForm({ ...form, recipientName: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Course Title" value={form.courseTitle} onChange={(e) => setForm({ ...form, courseTitle: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth type="date" label="Issue Date" InputLabelProps={{ shrink: true }} value={form.issueDate} onChange={(e) => setForm({ ...form, issueDate: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Trainer Name" value={form.trainerName} onChange={(e) => setForm({ ...form, trainerName: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button component="label" startIcon={<UploadIcon />} variant="outlined" sx={{ textTransform: 'none', width: '100%' }}>Upload Logo<input type="file" hidden accept="image/*" onChange={(e) => onFile(e, setLogoPreview)} /></Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button component="label" startIcon={<UploadIcon />} variant="outlined" sx={{ textTransform: 'none', width: '100%' }}>Upload Signature<input type="file" hidden accept="image/*" onChange={(e) => onFile(e, setSignaturePreview)} /></Button>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button onClick={saveTemplate} variant="outlined" sx={{ borderColor: '#C39766', color: '#C39766', textTransform: 'none' }}>Save Template</Button>
                <Button onClick={loadTemplate} variant="outlined" sx={{ textTransform: 'none' }}>Load Template</Button>
                <Button onClick={downloadPNG} variant="contained" startIcon={<DownloadIcon />} sx={{ bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' }, textTransform: 'none' }}>Download PNG</Button>
              </Box>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', bgcolor: 'white' }}>
            <canvas ref={canvasRef} width={1000} height={700} style={{ width: '100%', display: 'block' }} />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

const VerifyCertificate = () => {
  const [number, setNumber] = useState('');
  const [result, setResult] = useState(null);
  const verify = async () => {
    try {
      const res = await api.get(`/certificates/verify/${encodeURIComponent(number)}`);
      setResult(res.data?.data || null);
    } catch (e) {
      setResult({ error: 'Not found' });
    }
  };
  return (
    <Paper sx={{ p: 3, borderRadius: '16px', mb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32', mb: 2 }}>Verify Certificate</Typography>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Enter certificate number" size="small" sx={{ flex: 1 }} />
        <Button onClick={verify} startIcon={<SearchIcon />} variant="contained" sx={{ bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' } }}>Verify</Button>
      </Box>
      {result && (
        <Box sx={{ mt: 2 }}>
          {'error' in result ? (
            <Typography variant="body2" sx={{ color: '#f44336' }}>Certificate not found</Typography>
          ) : (
            <>
              <Typography variant="body2" sx={{ color: '#202F32' }}>
                {result.student?.name} — {result.course?.title} — {new Date(result.createdAt).toLocaleDateString()}
              </Typography>
            </>
          )}
        </Box>
      )}
    </Paper>
  );
};

const TrainerCertifications = () => {
  return (
    <TrainerLayout title="Certification Management">
      <TemplateDesigner />
      <VerifyCertificate />
      <Card>
        <CardContent>
          <Typography variant="body2" sx={{ color: '#666' }}>
            Issued certificates list will appear here when wired to trainer-specific endpoint. You can verify any certificate above by number.
          </Typography>
        </CardContent>
      </Card>
    </TrainerLayout>
  );
};

export default TrainerCertifications;


