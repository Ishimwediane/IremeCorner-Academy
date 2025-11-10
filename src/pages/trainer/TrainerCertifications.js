import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Card,
  CardContent,
} from '@mui/material';
import {
  Add as AddIcon,
  Download as DownloadIcon,
  Visibility as ViewIcon,
  CardMembership as CertificateIcon,
} from '@mui/icons-material';
import TrainerLayout from '../../components/TrainerLayout';

const TrainerCertifications = () => {
  // TODO: Fetch certificates from API
  const certificates = [];

  return (
    <TrainerLayout title="Certification Management">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#202F32' }}>
          Certificates Issued
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            bgcolor: '#C39766',
            '&:hover': { bgcolor: '#A67A52' },
            textTransform: 'none',
            px: 3,
          }}
        >
          Issue Certificate
        </Button>
      </Box>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Total Issued
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#202F32' }}>
                    {certificates.length}
                  </Typography>
                </Box>
                <CertificateIcon sx={{ fontSize: 40, color: '#C39766', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ borderRadius: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Student</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Course</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Issue Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32', textAlign: 'right' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {certificates.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      No certificates issued yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                certificates.map((certificate) => (
                  <TableRow key={certificate._id} hover>
                    <TableCell>{certificate.student}</TableCell>
                    <TableCell>{certificate.course}</TableCell>
                    <TableCell>{certificate.issueDate}</TableCell>
                    <TableCell>
                      <Chip label={certificate.status} size="small" color="success" />
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                        <IconButton size="small" sx={{ color: '#2196f3' }}>
                          <ViewIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" sx={{ color: '#C39766' }}>
                          <DownloadIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </TrainerLayout>
  );
};

export default TrainerCertifications;

