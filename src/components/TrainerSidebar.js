import React, { useEffect, useMemo, useState } from 'react';
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
  Collapse,
  Tooltip,
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
  Book as CoursesIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';

const TrainerSidebar = ({ mobileOpen, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('trainerSidebarCollapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [hoverExpanded, setHoverExpanded] = useState(false);
  const isExpanded = !collapsed || hoverExpanded;

  useEffect(() => {
    try {
      localStorage.setItem('trainerSidebarCollapsed', collapsed ? 'true' : 'false');
    } catch {}
    // Notify layout about change
    window.dispatchEvent(new CustomEvent('trainer-sidebar-toggle', { detail: { collapsed } }));
  }, [collapsed]);

  const groups = useMemo(() => ([
    {
      header: { text: 'Dashboard', icon: <DashboardIcon />, path: '/trainer/dashboard' },
      children: [],
      key: 'dashboard',
    },
    {
      header: { text: 'Courses', icon: <CoursesIcon />, path: '/trainer/courses' },
      children: [
        { text: 'Courses', icon: <CoursesIcon />, path: '/trainer/courses' },
        { text: 'Assignments', icon: <AssignmentIcon />, path: '/trainer/assignments' },
        { text: 'Quizzes', icon: <QuizIcon />, path: '/trainer/quizzes' },
        { text: 'Live Sessions', icon: <LiveSessionIcon />, path: '/trainer/live-sessions' },
        { text: 'Certifications', icon: <CertificateIcon />, path: '/trainer/certifications' },
      ],
      key: 'courses',
    },
    {
      header: { text: 'Students', icon: <PeopleIcon />, path: '/trainer/students' },
      children: [
        { text: 'Students', icon: <PeopleIcon />, path: '/trainer/students' },
        { text: 'Messages', icon: <MessageIcon />, path: '/trainer/messages' },
      ],
      key: 'students',
    },
    {
      header: { text: 'Earnings', icon: <EarningsIcon />, path: '/trainer/earnings' },
      children: [], key: 'earnings',
    },
    {
      header: { text: 'Reports', icon: <ReportsIcon />, path: '/trainer/reports' },
      children: [], key: 'reports',
    },
    {
      header: { text: 'Settings', icon: <SettingsIcon />, path: '/trainer/settings' },
      children: [], key: 'settings',
    },
  ]), []);

  const [openGroups, setOpenGroups] = useState(() => {
    const initial = {};
    groups.forEach(g => { initial[g.key] = true; });
    return initial;
  });

  const toggleGroup = (key) => {
    setOpenGroups(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarContent = (
    <Box
      sx={{
        width: isExpanded ? 280 : 80,
        height: '100%',
        bgcolor: '#202F32',
        color: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setHoverExpanded(true)}
      onMouseLeave={() => setHoverExpanded(false)}
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
          {isExpanded && (
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
          )}
          <Button
            onClick={() => setCollapsed(!collapsed)}
            sx={{
              ml: 'auto',
              minWidth: 0,
              color: 'white',
              display: { xs: 'none', md: 'inline-flex' },
              bgcolor: 'rgba(255,255,255,0.1)',
              px: 1,
              borderRadius: '8px',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
            }}
          >
            {collapsed ? '>' : '<'}
          </Button>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box 
        sx={{ 
          flex: 1, 
          pt: 2, 
          position: 'relative',
          overflowY: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '3px',
          },
        }}
      >
        <List sx={{ px: isExpanded ? 2 : 1, position: 'relative' }}>
          {groups.map((group) => {
            const groupActive = location.pathname.startsWith(group.header.path);
            const showChildren = isExpanded && openGroups[group.key] && group.children.length > 0;
            const headerButton = (
              <ListItemButton
                component={Link}
                to={group.header.path}
                onClick={(e) => {
                  if (group.children.length > 0 && isExpanded) {
                    // Navigate on single click; toggle via secondary action handled below
                  }
                  if (isMobile) onMobileClose();
                }}
                sx={{
                  borderRadius: '12px',
                  bgcolor: groupActive ? 'white' : 'transparent',
                  color: groupActive ? '#202F32' : 'rgba(255,255,255,0.9)',
                  '&:hover': { bgcolor: groupActive ? 'white' : 'rgba(255,255,255,0.1)' },
                  py: 1.5,
                  px: isExpanded ? 2.5 : 1.5,
                }}
              >
                <ListItemIcon sx={{ color: groupActive ? '#202F32' : 'rgba(255,255,255,0.9)', minWidth: 40 }}>
                  {group.header.icon}
                </ListItemIcon>
                {isExpanded && (
                  <ListItemText primary={group.header.text} primaryTypographyProps={{ fontSize: '0.95rem', fontWeight: groupActive ? 600 : 400, color: groupActive ? '#202F32' : 'rgba(255,255,255,0.9)' }} />
                )}
              </ListItemButton>
            );

            return (
              <Box key={group.key} sx={{ mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  {isExpanded ? (
                    <Box sx={{ flex: 1 }}>{headerButton}</Box>
                  ) : (
                    <Tooltip title={group.header.text} placement="right">{headerButton}</Tooltip>
                  )}
                  {isExpanded && group.children.length > 0 && (
                    <Button onClick={() => toggleGroup(group.key)} sx={{ ml: 1, minWidth: 0, color: 'white' }}>{openGroups[group.key] ? '−' : '+'}</Button>
                  )}
                </Box>
                <Collapse in={showChildren} timeout="auto" unmountOnExit>
                  <List sx={{ pl: 4 }}>
                    {group.children.map((child) => {
                      const isActive = location.pathname === child.path || location.pathname.startsWith(child.path + '/');
                      return (
                        <ListItem key={child.path} disablePadding>
                          <ListItemButton component={Link} to={child.path} onClick={() => isMobile && onMobileClose()} sx={{
                            borderRadius: '12px',
                            bgcolor: isActive ? 'rgba(255,255,255,1)' : 'transparent',
                            color: isActive ? '#202F32' : 'rgba(255,255,255,0.9)',
                            '&:hover': { bgcolor: isActive ? 'white' : 'rgba(255,255,255,0.1)' },
                            py: 1,
                            px: 2,
                          }}>
                            <ListItemIcon sx={{ minWidth: 32, color: isActive ? '#202F32' : 'rgba(255,255,255,0.9)' }}>
                              {child.icon}
                            </ListItemIcon>
                            <ListItemText primary={child.text} primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: isActive ? 600 : 400, color: isActive ? '#202F32' : 'rgba(255,255,255,0.9)' }} />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
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
              overflow: 'visible',
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Box sx={{ width: isExpanded ? 280 : 80, height: '100vh', position: 'fixed', left: 0, top: 0, zIndex: 1200, display: { xs: 'none', md: 'block' }, overflow: 'hidden' }}>
          {sidebarContent}
        </Box>
      )}
    </>
  );
};

export default TrainerSidebar;

