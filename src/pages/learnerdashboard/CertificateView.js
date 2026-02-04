import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Button,
    CircularProgress,
    Container,
} from '@mui/material';
import { Download, ArrowBack } from '@mui/icons-material';
import { useQuery } from 'react-query';
import api from '../../utils/api';

const drawCertificate = (ctx, width, height, data, variant = 'award') => {
    ctx.clearRect(0, 0, width, height);

    // Common settings
    const x = 20, y0 = 20, w = width - 40, h = height - 40;
    ctx.textAlign = 'center';
    const centerX = width / 2;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#2b5cff';
    ctx.lineWidth = 10;
    ctx.strokeRect(x, y0, w, h);

    // Inner border
    ctx.strokeStyle = '#C39766';
    ctx.lineWidth = 2;
    ctx.strokeRect(x + 15, y0 + 15, w - 30, h - 30);

    // Logo (if available) - For now just text or placeholder
    // ctx.drawImage(...) 

    // Titles
    ctx.fillStyle = '#202F32';
    ctx.font = 'bold 24px "Times New Roman"';
    ctx.fillText('IREME CORNER ACADEMY', centerX, y0 + 100);

    ctx.fillStyle = '#C39766';
    ctx.font = 'bold 54px "Times New Roman"';
    ctx.fillText('Certificate', centerX, y0 + 180);
    ctx.font = 'bold 24px "Times New Roman"';
    ctx.fillText('OF COMPLETION', centerX, y0 + 220);

    // Recipient
    ctx.fillStyle = '#666';
    ctx.font = 'italic 20px "Times New Roman"';
    ctx.fillText('This is to certify that', centerX, y0 + 280);

    ctx.fillStyle = '#202F32';
    ctx.font = 'bold 42px "Times New Roman"';
    // Use data
    ctx.fillText(data.student?.name || 'Student Name', centerX, y0 + 340);

    // Description
    ctx.fillStyle = '#666';
    ctx.font = '18px "Times New Roman"';
    ctx.fillText('has successfully completed the course', centerX, y0 + 390);

    // Course Title
    ctx.fillStyle = '#2b5cff';
    ctx.font = 'bold 32px "Times New Roman"';
    ctx.fillText(data.course?.title || 'Course Title', centerX, y0 + 440);

    // Date and ID
    const dateX = x + w / 4;
    const signatureX = x + (w * 3) / 4;

    ctx.fillStyle = '#202F32';
    ctx.font = '16px "Times New Roman"';

    const dateStr = data.issuedAt ? new Date(data.issuedAt).toLocaleDateString() : new Date().toLocaleDateString();
    ctx.fillText(dateStr, dateX, y0 + h - 60);

    // Lines
    ctx.beginPath();
    ctx.moveTo(dateX - 100, y0 + h - 80);
    ctx.lineTo(dateX + 100, y0 + h - 80);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(signatureX - 100, y0 + h - 80);
    ctx.lineTo(signatureX + 100, y0 + h - 80);
    ctx.stroke();

    ctx.fillStyle = '#666';
    ctx.font = '14px "Times New Roman"';
    ctx.fillText('DATE', dateX, y0 + h - 40);
    ctx.fillText('INSTRUCTOR', signatureX, y0 + h - 40);

    // Certificate No
    ctx.textAlign = 'center';
    ctx.font = '12px Arial';
    ctx.fillText(`Certificate ID: ${data.certificateNumber || 'N/A'}`, centerX, y0 + h - 20);
};

const CertificateView = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    const { data: certificate, isLoading, error } = useQuery(
        ['certificate', id],
        async () => {
            const response = await api.get(`/certificates/${id}`);
            return response.data.data;
        },
        { enabled: !!id }
    );

    useEffect(() => {
        if (certificate && canvasRef.current) {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext('2d');
            drawCertificate(ctx, canvas.width, canvas.height, certificate);
        }
    }, [certificate]);

    const handleDownload = () => {
        if (!canvasRef.current) return;
        const url = canvasRef.current.toDataURL('image/png');
        const a = document.createElement('a');
        a.href = url;
        a.download = `certificate-${certificate?.certificateNumber || 'download'}.png`;
        a.click();
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error || !certificate) {
        return (
            <Container sx={{ py: 4, textAlign: 'center' }}>
                <Typography variant="h5" color="error">Certificate not found</Typography>
                <Button onClick={() => navigate(-1)} sx={{ mt: 2 }}>Go Back</Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate(-1)}
                sx={{ mb: 3 }}
            >
                Back
            </Button>

            <Paper sx={{ p: 4, borderRadius: 2, bgcolor: '#fafafa', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: 1000, mb: 3 }}>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Certificate of Completion</Typography>
                    <Button
                        variant="contained"
                        startIcon={<Download />}
                        onClick={handleDownload}
                        sx={{ bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' } }}
                    >
                        Download PNG
                    </Button>
                </Box>

                <Box sx={{
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    maxWidth: '100%',
                    overflow: 'auto',
                    bgcolor: 'white'
                }}>
                    <canvas
                        ref={canvasRef}
                        width={1000}
                        height={700}
                        style={{ width: '100%', maxWidth: '1000px', height: 'auto', display: 'block' }}
                    />
                </Box>
            </Paper>
        </Container>
    );
};

export default CertificateView;
