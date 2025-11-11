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
  ListSubheader,
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
  ExpandMore as ExpandMoreIcon,
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
      // No children; we will render a single child item that links to dashboard
      children: [],
      key: 'dashboard',
    },
    {
      header: { text: 'Course Management', icon: <CoursesIcon />, path: '/trainer/courses' }, children: [ ],
      key: 'courses',
    },
    {
      header: { text: 'Student Management', icon: <PeopleIcon /> },
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
        <List sx={{ pl: isExpanded ? 2 : 1, pr: 0, position: 'relative' }}>
          {groups.map((group) => {
            const groupActive = group.children.some(c => location.pathname.startsWith(c.path)) || (group.header.path ? location.pathname.startsWith(group.header.path) : false);
            const showChildren = isExpanded && openGroups[group.key] && group.children.length > 0;
            const tintedHeader = (group.key === 'courses' || group.key === 'students') && groupActive;
            const isLinkHeader = group.children.length === 0 && !!group.header.path;

            return (
              <Box key={group.key} sx={{ mb: 0.5 }}>
                {/* Header (toggle only, not a link) */}
                <ListItem
                  disablePadding
                  sx={{
                    mb: 0.5,
                  }}
                >
                  <ListItemButton
                    onClick={() => group.children.length > 0 ? toggleGroup(group.key) : (group.header.path && navigate(group.header.path))}
                    sx={{
                      borderRadius: '999px',
                      // Link headers (Dashboard/Earnings/Reports/Settings) use white pill when active/hover
                      bgcolor: isLinkHeader ? (groupActive ? 'white' : 'transparent') : (tintedHeader ? 'rgba(195,151,102,0.15)' : 'transparent'),
                      color: isLinkHeader ? (groupActive ? '#202F32' : 'rgba(255,255,255,0.95)') : 'rgba(255,255,255,0.95)',
                      '&:hover': isLinkHeader
                        ? { bgcolor: 'white', color: '#202F32', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }
                        : { bgcolor: tintedHeader ? 'rgba(195,151,102,0.22)' : 'rgba(255,255,255,0.08)' },
                      py: 1.25,
                      px: isExpanded ? 2 : 1.25,
                      width: '100%',
                      position: 'relative',
                      mr: isLinkHeader && (groupActive) ? '-16px' : 0,
                      '&::after': isLinkHeader && (groupActive) ? {
                        content: '""',
                        position: 'absolute',
                        right: '-16px',
                        top: 0,
                        bottom: 0,
                        width: '16px',
                        background: 'white',
                        borderTopRightRadius: '999px',
                        borderBottomRightRadius: '999px',
                      } : {},
                    }}
                  >
                    <ListItemIcon sx={{ color: isLinkHeader && groupActive ? '#202F32' : 'rgba(255,255,255,0.9)', minWidth: 36 }}>
                      {group.header.icon}
                    </ListItemIcon>
                    {isExpanded && (
                      <ListItemText
                        primary={group.header.text}
                        primaryTypographyProps={{
                          fontSize: '0.9rem',
                          fontWeight: groupActive ? 700 : 600,
                          noWrap: true,
                        }}
                      />
                    )}
                    {isExpanded && group.children.length > 0 && (
                      <ExpandMoreIcon sx={{ ml: 'auto', transform: openGroups[group.key] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
                    )}
                  </ListItemButton>
                </ListItem>

                {/* Children */}
                <Collapse in={showChildren} timeout="auto" unmountOnExit>
                  <List sx={{ pl: isExpanded ? 4 : 2 }}>
                    {(group.key === 'dashboard'
                      ? [{ text: 'Dashboard', icon: <DashboardIcon />, path: '/trainer/dashboard' }]
                      : group.children
                    ).map((child) => {
                      const isActive = location.pathname === child.path || location.pathname.startsWith(child.path + '/');
                      return (
                        <ListItem key={child.path} disablePadding>
                          <ListItemButton component={Link} to={child.path} onClick={() => isMobile && onMobileClose()} sx={{
                            borderRadius: '999px',
                            bgcolor: isActive ? 'white' : 'transparent',
                            color: isActive ? '#202F32' : 'rgba(255,255,255,0.9)',
                            '&:hover': { bgcolor: 'white', color: '#202F32', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' },
                            py: 1,
                            px: isExpanded ? 2 : 1.25,
                            width: '100%',
                            position: 'relative',
                            // Extend white pill to the right edge with a rounded end similar to the reference
                            mr: isActive ? '-16px' : 0,
                            '&::after': isActive ? {
                              content: '""',
                              position: 'absolute',
                              right: '-16px',
                              top: 0,
                              bottom: 0,
                              width: '16px',
                              background: 'white',
                              borderTopRightRadius: '999px',
                              borderBottomRightRadius: '999px',
                            } : {},
                          }}>
                            <ListItemIcon sx={{ minWidth: 30, color: isActive ? '#202F32' : 'rgba(255,255,255,0.9)' }}>
                              {child.icon}
                            </ListItemIcon>
                            {isExpanded && (
                              <ListItemText
                                primary={child.text}
                                primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: isActive ? 600 : 500, noWrap: true }}
                              />
                            )}
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
