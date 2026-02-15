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
  MenuItem,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Download as DownloadIcon,
  UploadFile as UploadIcon,
  CardMembership as CertificateIcon,
} from '@mui/icons-material';

const drawTemplate = (ctx, width, height, data, variant) => {
  ctx.clearRect(0, 0, width, height);

  const x = 20, y0 = 20, w = width - 40, h = height - 40;
  ctx.textAlign = 'center';
  const centerX = width / 2;

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
  ctx.fillText(data.recipientName || 'Student Name', centerX, y0 + 340);

  // Description
  ctx.fillStyle = '#666';
  ctx.font = '18px "Times New Roman"';
  const text = data.description || `has successfully completed the course requirements for`;
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

  ctx.fillText(data.issueDate ? new Date(data.issueDate).toDateString() : 'Date of Issue', dateX, y0 + h - 60);
  ctx.beginPath();
  ctx.moveTo(dateX - 100, y0 + h - 80);
  ctx.lineTo(dateX + 100, y0 + h - 80);
  ctx.strokeStyle = '#666';
  ctx.lineWidth = 1;
  ctx.stroke();

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
};

const TemplateDesigner = ({ course }) => {
  const canvasRef = useRef(null);
  const [form, setForm] = useState({ companyName: 'IremeHub Academy', courseTitle: course?.title || '', description: `has successfully completed all requirements for the course:` });
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
      drawTemplate(ctx, canvas.width, canvas.height, dataWithImages, 'award');
    };
    render();
  }, [form, logoPreview, signaturePreview]);

  const downloadPNG = () => {
    const canvas = canvasRef.current;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-template-${course?._id}.png`;
    a.click();
  };

  const onFile = (e, setter) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setter(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={5}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32', mb: 2 }}>Template Designer</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12}><TextField fullWidth label="Company Name" value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></Grid>
          <Grid item xs={12}><TextField fullWidth label="Course Title" value={form.courseTitle} onChange={(e) => setForm({ ...form, courseTitle: e.target.value })} /></Grid>
          <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><Button component="label" size="small" startIcon={<UploadIcon />} variant="outlined" sx={{ textTransform: 'none', width: '100%', borderRadius: 0, py: 0.5, px: 1.5, fontSize: '0.8rem' }}>Upload Logo<input type="file" hidden accept="image/*" onChange={(e) => onFile(e, setLogoPreview)} /></Button></Grid>
          <Grid item xs={12} sm={6}><Button component="label" size="small" startIcon={<UploadIcon />} variant="outlined" sx={{ textTransform: 'none', width: '100%', borderRadius: 0, py: 0.5, px: 1.5, fontSize: '0.8rem' }}>Upload Signature<input type="file" hidden accept="image/*" onChange={(e) => onFile(e, setSignaturePreview)} /></Button></Grid>
          <Grid item xs={12}><Button onClick={downloadPNG} variant="contained" size="small" startIcon={<DownloadIcon />} sx={{ bgcolor: '#FD7E14', borderRadius: 0, py: 0.5, px: 1.5, fontSize: '0.8rem', '&:hover': { bgcolor: '#E56D0F' } }}>Download Template</Button></Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} md={7}>
        <Box sx={{ borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', bgcolor: 'white' }}>
          <canvas ref={canvasRef} width={1000} height={700} style={{ width: '100%', display: 'block' }} />
        </Box>
      </Grid>
    </Grid>
  );
};

const CertificateTab = ({ courseId, certificates, course }) => {
  const [tab, setTab] = useState(0);

  return (
    <Box>
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
        <Tab label="Issued Certificates" />
        <Tab label="Template Designer" />
      </Tabs>

      {tab === 0 && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32', mb: 2 }}>Issued Certificates ({certificates.length})</Typography>
          {certificates.length === 0 ? (
            <Typography>No certificates have been issued for this course yet.</Typography>
          ) : (
            <Paper variant="outlined">
              <List>
                {certificates.map((cert) => (
                  <ListItem key={cert._id} divider>
                    <ListItemIcon><CertificateIcon color="primary" /></ListItemIcon>
                    <ListItemText
                      primary={cert.student?.name || 'Unknown Student'}
                      secondary={`Issued on: ${new Date(cert.issuedAt).toLocaleDateString()} - No: ${cert.certificateNumber}`}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          )}
        </Box>
      )}

      {tab === 1 && <TemplateDesigner course={course} />}
    </Box>
  );
};

export default CertificateTab;