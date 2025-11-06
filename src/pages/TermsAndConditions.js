import React from 'react';
import { Container, Box, Typography, List, ListItem, ListItemText, Paper } from '@mui/material';

const TermsAndConditions = () => {
  return (
    <Box>
      <Box sx={{ bgcolor: 'rgba(168,72,54,0.08)', py: 6, mb: 4 }}>
        <Container>
          <Typography variant="h3" sx={{ fontWeight: 800, color: '#202F32', textAlign: 'center' }}>
            IremeCorner Tutor Terms & Conditions
          </Typography>
          <Typography sx={{ color: '#202F32', opacity: 0.8, textAlign: 'center', mt: 1 }}>
            Please read carefully before submitting your application.
          </Typography>
        </Container>
      </Box>

      <Container sx={{ pb: 8 }}>
        <Paper sx={{ p: { xs: 3, md: 5 }, borderRadius: '16px' }}>
          <Typography variant="h5" sx={{ fontWeight: 700, color: '#202F32', mb: 2 }}>
            Overview
          </Typography>
          <Typography sx={{ color: '#202F32', opacity: 0.9, mb: 3 }}>
            By applying to become a tutor on IremeCorner, you agree to the following terms and
            conditions. These ensure a safe, fair, and high‑quality learning environment for
            students and instructors.
          </Typography>

          <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32', mb: 1 }}>
            Key Terms
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Accuracy of Information" secondary="All details you submit must be truthful and current. You agree to update your profile if anything changes." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Content Ownership" secondary="You confirm you have the rights to any materials you upload (videos, documents, images) and grant IremeCorner permission to display them on the platform." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Professional Conduct" secondary="You will treat learners respectfully, respond in a timely manner, and deliver lessons as described." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Compliance" secondary="You agree to follow all applicable laws and IremeCorner policies regarding privacy, intellectual property, and payments." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Payments" secondary="Payout schedule and fees are determined by IremeCorner and may change with notice." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Removal" secondary="IremeCorner may suspend or remove accounts for policy violations, low quality, or misconduct." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Data Use" secondary="We collect and process your data to operate the service. See our Privacy Policy for details." />
            </ListItem>
          </List>

          <Typography sx={{ color: '#202F32', opacity: 0.9, mt: 2 }}>
            By proceeding to submit the application, you acknowledge that you have read and agree
            to these terms.
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default TermsAndConditions;


