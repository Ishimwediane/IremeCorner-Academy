import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Grid,
  TextField,
  Button,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  Palette as PaletteIcon,
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const AdminSettings = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [settings, setSettings] = useState({
    siteName: 'IremeCorner Academy',
    siteEmail: 'contact@iremecorner.com',
    allowRegistration: true,
  });

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleSettingChange = (event) => {
    const { name, value, type, checked } = event.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSave = () => {
    // In a real app, you would make an API call here to save the settings
    alert('Settings saved! (This is a demo)');
  };

  return (
    <Paper sx={{ display: 'flex', minHeight: '70vh', borderRadius: 0 }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={tab}
        onChange={handleTabChange}
        sx={{
          borderRight: 1,
          borderColor: 'divider',
          minWidth: 200,
          '& .MuiTabs-indicator': { backgroundColor: '#FD7E14' },
          '& .Mui-selected': { color: '#FD7E14 !important' }
        }}
      >
        <Tab icon={<SettingsIcon />} iconPosition="start" label="General" />
        <Tab icon={<PaletteIcon />} iconPosition="start" label="Appearance" />
        <Tab icon={<PersonAddIcon />} iconPosition="start" label="Users" />
        <Tab icon={<EmailIcon />} iconPosition="start" label="Email" />
        <Tab icon={<AccountCircleIcon />} iconPosition="start" label="My Profile" />
      </Tabs>

      <Box sx={{ flex: 1 }}>
        <TabPanel value={tab} index={0}>
          <Typography variant="h6" gutterBottom>General Settings</Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Site Name"
                name="siteName"
                value={settings.siteName}
                onChange={handleSettingChange}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Site Contact Email"
                name="siteEmail"
                value={settings.siteEmail}
                onChange={handleSettingChange}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <Typography variant="h6" gutterBottom>Appearance Settings</Typography>
          <Typography color="text.secondary">Logo and theme color settings will be available here.</Typography>
        </TabPanel>

        <TabPanel value={tab} index={2}>
          <Typography variant="h6" gutterBottom>User & Registration Settings</Typography>
          <FormControlLabel
            control={
              <Switch
                checked={settings.allowRegistration}
                onChange={handleSettingChange}
                name="allowRegistration"
              />
            }
            label="Allow Public User Registration"
          />
        </TabPanel>

        <TabPanel value={tab} index={3}>
          <Typography variant="h6" gutterBottom>Email Settings</Typography>
          <Typography color="text.secondary">SMTP server configuration will be available here.</Typography>
        </TabPanel>

        <TabPanel value={tab} index={4}>
          <Typography variant="h6" gutterBottom>My Profile</Typography>
          <Typography>Hello, {user?.name}. Your profile settings will be available here.</Typography>
        </TabPanel>

        <Box sx={{ p: 3, borderTop: 1, borderColor: 'divider', textAlign: 'right' }}>
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              bgcolor: '#FD7E14',
              borderRadius: 0,
              textTransform: 'none',
              '&:hover': { bgcolor: '#E56D0F' }
            }}
          >
            Save Settings
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default AdminSettings;