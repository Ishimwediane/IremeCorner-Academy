import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  useMediaQuery,
  useTheme,
  Tooltip,
  IconButton,
  Divider,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Message as MessageIcon,
  School as SchoolIcon,
  Logout as LogoutIcon,
  Assignment as AssignmentIcon,
  Quiz as QuizIcon,
  AttachMoney as EarningsIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  CardMembership as CertificateIcon,
  VideoCall as LiveSessionIcon,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 280;
const collapsedDrawerWidth = 80;

const TrainerSidebar = ({ mobileOpen, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('trainerSidebarCollapsed') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('trainerSidebarCollapsed', collapsed ? 'true' : 'false');
    } catch { }
    // Notify layout about change
    window.dispatchEvent(new CustomEvent('trainer-sidebar-toggle', { detail: { collapsed } }));
  }, [collapsed]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/trainer/dashboard' },
    { text: 'Courses', icon: <SchoolIcon />, path: '/trainer/courses' },
    { text: 'Students', icon: <PeopleIcon />, path: '/trainer/students' },
    { text: 'Messages', icon: <MessageIcon />, path: '/trainer/messages' },
    { text: 'Assignments', icon: <AssignmentIcon />, path: '/trainer/assignments' },
    { text: 'Quizzes', icon: <QuizIcon />, path: '/trainer/quizzes' },
    { text: 'Live Sessions', icon: <LiveSessionIcon />, path: '/trainer/live-sessions' },
    { text: 'Certifications', icon: <CertificateIcon />, path: '/trainer/certifications' },
    { text: 'Earnings', icon: <EarningsIcon />, path: '/trainer/earnings' },
    { text: 'Reports', icon: <ReportsIcon />, path: '/trainer/reports' },
  ];

  const settingsItems = [
    { text: 'Settings', icon: <SettingsIcon />, path: '/trainer/settings' },
    { text: 'Logout', icon: <LogoutIcon />, action: handleLogout },
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'white' }}>
      {/* Logo */}
      <Box sx={{ p: collapsed ? 1.5 : 3, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 1 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            bgcolor: '#FD7E14',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography sx={{ color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>I</Typography>
        </Box>
        {!collapsed && (
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#FD7E14' }}>
            IremeCorner
          </Typography>
        )}
      </Box>

      {/* Toggle Button */}
      <Box sx={{ px: 2, mb: 2, display: { xs: 'none', md: 'flex' }, justifyContent: collapsed ? 'center' : 'flex-end' }}>
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          size="small"
          sx={{
            bgcolor: 'rgba(253, 126, 20, 0.08)',
            '&:hover': { bgcolor: 'rgba(253, 126, 20, 0.15)' },
          }}
        >
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      {/* Menu Section */}
      {!collapsed && (
        <Box sx={{ px: 2, mb: 1 }}>
          <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>
            MENU
          </Typography>
        </Box>
      )}

      <List sx={{ px: 2, flex: 1, overflowY: 'auto' }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
          return (
            <Tooltip key={item.text} title={collapsed ? item.text : ''} placement="right">
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  to={item.path}
                  onClick={() => isMobile && onMobileClose()}
                  sx={{
                    borderRadius: '8px',
                    py: 1,
                    px: collapsed ? 1 : 2,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    bgcolor: isActive ? 'rgba(253, 126, 20, 0.08)' : 'transparent',
                    color: isActive ? '#FD7E14' : '#666',
                    '&:hover': {
                      bgcolor: 'rgba(253, 126, 20, 0.05)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : 36, color: 'inherit', justifyContent: 'center' }}>
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '0.9rem',
                        fontWeight: isActive ? 600 : 500,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          );
        })}
      </List>

      {/* Settings Section */}
      <Divider sx={{ mx: 2 }} />
      {!collapsed && (
        <Box sx={{ px: 2, mt: 2, mb: 1 }}>
          <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>
            SETTINGS
          </Typography>
        </Box>
      )}
      <List sx={{ px: 2, pb: 2 }}>
        {settingsItems.map((item) => {
          const isActive = item.path && location.pathname === item.path;
          return (
            <Tooltip key={item.text} title={collapsed ? item.text : ''} placement="right">
              <ListItem disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={item.path ? Link : 'div'}
                  to={item.path}
                  onClick={() => {
                    if (item.action) item.action();
                    if (isMobile) onMobileClose();
                  }}
                  sx={{
                    borderRadius: '8px',
                    py: 1,
                    px: collapsed ? 1 : 2,
                    justifyContent: collapsed ? 'center' : 'flex-start',
                    bgcolor: isActive ? 'rgba(253, 126, 20, 0.08)' : 'transparent',
                    color: isActive ? '#FD7E14' : '#666',
                    '&:hover': {
                      bgcolor: 'rgba(253, 126, 20, 0.05)',
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: collapsed ? 'auto' : 36, color: 'inherit', justifyContent: 'center' }}>
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '0.9rem',
                        fontWeight: isActive ? 600 : 500,
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            </Tooltip>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            border: 'none',
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: collapsed ? collapsedDrawerWidth : drawerWidth,
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            border: 'none',
            borderRight: '1px solid rgba(0,0,0,0.08)',
          },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default TrainerSidebar;
