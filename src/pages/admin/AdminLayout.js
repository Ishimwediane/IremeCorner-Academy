import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, Container } from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Help as HelpIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import AdminSidebar from './AdminSidebar'; // Corrected Path

const AdminLayout = ({ children, title = 'Admin Dashboard' }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('adminSidebarCollapsed') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const handler = (e) => {
      if (e?.detail?.collapsed !== undefined) {
        setSidebarCollapsed(!!e.detail.collapsed);
      }
    };
    window.addEventListener('admin-sidebar-toggle', handler);
    return () => window.removeEventListener('admin-sidebar-toggle', handler);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <AdminSidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />
      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          ml: { xs: 0, md: sidebarCollapsed ? '80px' : '280px' },
          width: { xs: '100%', md: sidebarCollapsed ? 'calc(100% - 80px)' : 'calc(100% - 280px)' },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Top Header Bar - Fixed */}
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: { xs: 0, md: sidebarCollapsed ? '80px' : '280px' },
            right: 0,
            height: 70,
            bgcolor: 'white',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: { xs: 2, md: 4 },
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            overflow: 'visible',
          }}
        >
          {/* Mobile Menu Button */}
          <IconButton
            sx={{
              display: { xs: 'block', md: 'none' },
              mr: 2,
              color: '#202F32',
            }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>

          {/* Page Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: '#202F32',
              fontSize: { xs: '1.5rem', md: '2rem' },
            }}
          >
            {title}
          </Typography>

          {/* Action Icons */}
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <IconButton
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'rgba(195,151,102,0.1)',
                color: '#202F32',
                '&:hover': { bgcolor: 'rgba(195,151,102,0.2)' },
              }}
              title="Notifications"
            >
              <NotificationsIcon />
            </IconButton>
            <IconButton
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'rgba(195,151,102,0.1)',
                color: '#202F32',
                '&:hover': { bgcolor: 'rgba(195,151,102,0.2)' },
              }}
              title="Help"
            >
              <HelpIcon />
            </IconButton>
            <IconButton
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'rgba(195,151,102,0.1)',
                color: '#202F32',
                '&:hover': { bgcolor: 'rgba(195,151,102,0.2)' },
              }}
              title="Settings"
            >
              <SettingsIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Main Content - Below Header */}
        <Box
          sx={{
            flex: 1,
            mt: '70px',
            p: { xs: 2, md: 3 },
            overflow: 'auto',
          }}
        >
          <Container sx={{ maxWidth: '1400px !important' }}>
            {children}
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;