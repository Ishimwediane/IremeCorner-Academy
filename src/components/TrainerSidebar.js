import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Button,
  Drawer,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Message as MessageIcon,
  School as SchoolIcon,
  Logout as LogoutIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const TrainerSidebar = ({ mobileOpen, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/trainer/dashboard' },
    { text: 'Create Course', icon: <SchoolIcon />, path: '/create-course' },
    { text: 'My Courses', icon: <SchoolIcon />, path: '/my-courses' },
    { text: 'Students', icon: <PeopleIcon />, path: '/trainer/dashboard' }, // Placeholder - will show students in dashboard
    { text: 'Messages', icon: <MessageIcon />, path: '/trainer/dashboard' }, // Placeholder
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarContent = (
    <Box
      sx={{
        width: 280,
        height: '100%',
        bgcolor: '#202F32',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Profile Section */}
      <Box
        sx={{
          p: 3,
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
          <Avatar
            sx={{
              width: 56,
              height: 56,
              bgcolor: '#C39766',
              fontSize: '1.5rem',
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'T'}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: 'white' }}>
              {user?.name || 'Teacher'}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.875rem' }}
            >
              Instructor
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box sx={{ flex: 1, overflow: 'auto', pt: 2 }}>
        <List sx={{ px: 2 }}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => {
                    if (isMobile) {
                      onMobileClose();
                    }
                  }}
                  sx={{
                    borderRadius: '12px',
                    bgcolor: isActive ? 'rgba(195,151,102,0.2)' : 'transparent',
                    '&:hover': {
                      bgcolor: isActive
                        ? 'rgba(195,151,102,0.3)'
                        : 'rgba(255,255,255,0.1)',
                    },
                    py: 1.5,
                    px: 2,
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? '#C39766' : 'rgba(255,255,255,0.7)',
                      minWidth: 40,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.95rem',
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'white' : 'rgba(255,255,255,0.9)',
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* Logout Button */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <Button
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            color: 'rgba(255,255,255,0.9)',
            textTransform: 'none',
            justifyContent: 'flex-start',
            px: 2,
            py: 1.5,
            borderRadius: '12px',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.1)',
            },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  return (
    <>
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onMobileClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: 280,
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Box
          sx={{
            width: 280,
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            zIndex: 1200,
            display: { xs: 'none', md: 'block' },
          }}
        >
          {sidebarContent}
        </Box>
      )}
    </>
  );
};

export default TrainerSidebar;

