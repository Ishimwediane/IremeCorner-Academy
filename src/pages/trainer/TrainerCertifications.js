import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
  MenuItem,
} from '@mui/material';
import {
  Download as DownloadIcon,
  UploadFile as UploadIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import TrainerLayout from '../../components/TrainerLayout';
import api from '../../utils/api';

const drawTemplate = (ctx, width, height, data, variant) => {
  ctx.clearRect(0, 0, width, height);

  // Common settings for both templates
  const x = 20, y0 = 20, w = width - 40, h = height - 40;
  ctx.textAlign = 'center';
  const centerX = width / 2;

  if (variant === 'award') {
    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#2b5cff';
    ctx.lineWidth = 8;
    ctx.strokeRect(x, y0, w, h);

    // Inner border
    ctx.strokeStyle = '#2b5cff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 15, y0 + 15, w - 30, h - 30);

    // Logo and Company name
    if (data.logoImg) {
      ctx.drawImage(data.logoImg, centerX - 30, y0 + 40, 60, 60);
    }
    ctx.fillStyle = '#202F32';
    ctx.font = 'bold 24px "Times New Roman"';
    ctx.fillText(data.companyName || 'COMPANY NAME', centerX, y0 + 130);

    // Certificate Title
    ctx.fillStyle = '#2b5cff';
    ctx.font = 'bold 48px "Times New Roman"';
    ctx.fillText('Certificate', centerX, y0 + 200);
    ctx.font = 'bold 24px "Times New Roman"';
    ctx.fillText('OF ACHIEVEMENT', centerX, y0 + 235);

    // Recipient
    ctx.fillStyle = '#666';
    ctx.font = '18px "Times New Roman"';
    ctx.fillText('THIS IS TO CERTIFY THAT', centerX, y0 + 290);
    ctx.fillStyle = '#202F32';
    ctx.font = 'bold 36px "Times New Roman"';
    ctx.fillText(data.recipientName || 'Name Surname', centerX, y0 + 340);

    // Description
    ctx.fillStyle = '#666';
    ctx.font = '18px "Times New Roman"';
    const text = data.description || 'has successfully completed the course requirements';
    ctx.fillText(text, centerX, y0 + 390);

    // Course Title
    ctx.fillStyle = '#2b5cff';
    ctx.font = 'bold 28px "Times New Roman"';
    ctx.fillText(data.courseTitle || 'Course Title', centerX, y0 + 440);

    // Date and Signature
    const dateX = x + w / 4;
    const signatureX = x + (w * 3) / 4;

    ctx.fillStyle = '#202F32';
    ctx.font = '16px "Times New Roman"';

    // Date
    ctx.fillText(data.issueDate ? new Date(data.issueDate).toDateString() : 'Date of Issue', dateX, y0 + h - 60);
    ctx.beginPath();
    ctx.moveTo(dateX - 100, y0 + h - 80);
    ctx.lineTo(dateX + 100, y0 + h - 80);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Signature
    if (data.signatureImg) {
      ctx.drawImage(data.signatureImg, signatureX - 80, y0 + h - 140, 160, 60);
    }
    ctx.beginPath();
    ctx.moveTo(signatureX - 100, y0 + h - 80);
    ctx.lineTo(signatureX + 100, y0 + h - 80);
    ctx.stroke();

    ctx.fillStyle = '#666';
    ctx.font = '14px "Times New Roman"';
    ctx.fillText('DATE', dateX, y0 + h - 40);
    ctx.fillText('SIGNATURE', signatureX, y0 + h - 40);

    return;
  }

  // Default existing templates
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
  const [variant, setVariant] = useState('award');
  const [form, setForm] = useState({ companyName: '', recipientName: '', courseTitle: '', issueDate: '', trainerName: '', certificateNumber: '', description: '' });
  const [logoPreview, setLogoPreview] = useState(null);
  const [signaturePreview, setSignaturePreview] = useState(null);

  useEffect(() => {
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
    <Paper sx={{ p: 3, borderRadius: 0, mb: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32', mb: 2 }}>Template Designer</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth select label="Template Variant" value={variant} onChange={(e) => setVariant(e.target.value)}>
                <MenuItem value="classic">Classic (gold)</MenuItem>
                <MenuItem value="modern">Modern (purple)</MenuItem>
                <MenuItem value="award">Award (blue)</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField fullWidth label="Company Name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} />
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
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button component="label" startIcon={<UploadIcon />} variant="outlined" size="small" sx={{ textTransform: 'none', width: '100%', borderRadius: 0, borderColor: '#FD7E14', color: '#FD7E14', '&:hover': { borderColor: '#E56D0F', color: '#E56D0F' }, py: 0.5, px: 1.5, fontSize: '0.8rem' }}>Upload Logo<input type="file" hidden accept="image/*" onChange={(e) => onFile(e, setLogoPreview)} /></Button>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button component="label" startIcon={<UploadIcon />} variant="outlined" size="small" sx={{ textTransform: 'none', width: '100%', borderRadius: 0, borderColor: '#FD7E14', color: '#FD7E14', '&:hover': { borderColor: '#E56D0F', color: '#E56D0F' }, py: 0.5, px: 1.5, fontSize: '0.8rem' }}>Upload Signature<input type="file" hidden accept="image/*" onChange={(e) => onFile(e, setSignaturePreview)} /></Button>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button onClick={saveTemplate} variant="outlined" size="small" sx={{ borderRadius: 0, borderColor: '#FD7E14', color: '#FD7E14', textTransform: 'none', '&:hover': { borderColor: '#E56D0F', color: '#E56D0F' }, py: 0.5, px: 1.5, fontSize: '0.8rem' }}>Save Template</Button>
                <Button onClick={loadTemplate} variant="outlined" size="small" sx={{ borderRadius: 0, textTransform: 'none', borderColor: '#FD7E14', color: '#FD7E14', '&:hover': { borderColor: '#E56D0F', color: '#E56D0F' }, py: 0.5, px: 1.5, fontSize: '0.8rem' }}>Load Template</Button>
                <Button onClick={downloadPNG} variant="contained" startIcon={<DownloadIcon />} size="small" sx={{ bgcolor: '#FD7E14', '&:hover': { bgcolor: '#E56D0F' }, textTransform: 'none', borderRadius: 0, py: 0.5, px: 1.5, fontSize: '0.8rem' }}>Download PNG</Button>
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
    <Paper sx={{ p: 3, borderRadius: 0, mb: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32', mb: 2 }}>Verify Certificate</Typography>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField value={number} onChange={(e) => setNumber(e.target.value)} placeholder="Enter certificate number" size="small" sx={{ flex: 1 }} />
        <Button onClick={verify} startIcon={<SearchIcon />} variant="contained" size="small" sx={{ bgcolor: '#FD7E14', borderRadius: 0, '&:hover': { bgcolor: '#E56D0F' } }}>Verify</Button>
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
      <Card sx={{ borderRadius: 0 }}>
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


