import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Help as HelpIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import TrainerSidebar from './TrainerSidebar';
import { useTranslation } from 'react-i18next';

const TrainerLayout = ({ children, title = 'Dashboard' }) => {
  const { i18n } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('trainerSidebarCollapsed') === 'true';
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
    window.addEventListener('trainer-sidebar-toggle', handler);
    return () => window.removeEventListener('trainer-sidebar-toggle', handler);
  }, []);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f7fa' }}>
      <TrainerSidebar mobileOpen={mobileOpen} onMobileClose={handleDrawerToggle} />
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
            {/* Language Selector */}
            <Box sx={{ display: 'flex', gap: 0.5, bgcolor: '#F3F4F6', borderRadius: '6px', p: 0.5, mr: 1 }}>
              <Box
                onClick={() => i18n.changeLanguage('en')}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  bgcolor: i18n.language === 'en' ? '#FD7E14' : 'transparent',
                  color: i18n.language === 'en' ? 'white' : '#666',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: i18n.language === 'en' ? '#E56D0F' : 'rgba(253, 126, 20, 0.1)',
                  },
                }}
              >
                EN
              </Box>
              <Box
                onClick={() => i18n.changeLanguage('rw')}
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  bgcolor: i18n.language === 'rw' ? '#FD7E14' : 'transparent',
                  color: i18n.language === 'rw' ? 'white' : '#666',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: i18n.language === 'rw' ? '#E56D0F' : 'rgba(253, 126, 20, 0.1)',
                  },
                }}
              >
                RW
              </Box>
            </Box>

            <IconButton
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'rgba(253, 126, 20, 0.1)',
                color: '#202F32',
                '&:hover': { bgcolor: 'rgba(253, 126, 20, 0.2)' },
              }}
              title="Notifications"
            >
              <NotificationsIcon />
            </IconButton>
            <IconButton
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'rgba(253, 126, 20, 0.1)',
                color: '#202F32',
                '&:hover': { bgcolor: 'rgba(253, 126, 20, 0.2)' },
              }}
              title="Help"
            >
              <HelpIcon />
            </IconButton>
            <IconButton
              sx={{
                width: 40,
                height: 40,
                bgcolor: 'rgba(253, 126, 20, 0.1)',
                color: '#202F32',
                '&:hover': { bgcolor: 'rgba(253, 126, 20, 0.2)' },
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
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default TrainerLayout;


