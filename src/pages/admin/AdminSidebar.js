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
  School as SchoolIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  Book as BookIcon,
  MenuBook as MenuBookIcon,
  PendingActions as PendingActionsIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  ExpandMore as ExpandMoreIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar = ({ mobileOpen, onMobileClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [collapsed, setCollapsed] = useState(() => {
    try {
      return localStorage.getItem('adminSidebarCollapsed') === 'true';
    } catch {
      return false;
    }
  });

  // Track if we're hovering over the collapsed sidebar to temporarily expand it
  const [hoverExpanded, setHoverExpanded] = useState(false);

  // The effective expanded state (true if not collapsed OR if hovering while collapsed)
  const isExpanded = !collapsed || hoverExpanded;

  useEffect(() => {
    try {
      localStorage.setItem('adminSidebarCollapsed', collapsed ? 'true' : 'false');
    } catch { }
    // Notify layout about change
    window.dispatchEvent(new CustomEvent('admin-sidebar-toggle', { detail: { collapsed } }));
  }, [collapsed]);

  const groups = useMemo(() => ([
    {
      header: { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
      children: [],
      key: 'dashboard',
    },
    {
      header: { text: 'User Management', icon: <PeopleIcon /> },
      children: [
        { text: 'All Users', icon: <GroupIcon />, path: '/admin/users' },
        { text: 'Trainers', icon: <SchoolIcon />, path: '/admin/trainers' },
        { text: 'Students', icon: <PersonIcon />, path: '/admin/students' },
      ],
      key: 'user-management',
    },
    {
      header: { text: 'Course Management', icon: <BookIcon /> },
      children: [
        { text: 'All Courses', icon: <MenuBookIcon />, path: '/admin/courses' },
        { text: 'Pending Courses', icon: <PendingActionsIcon />, path: '/admin/pending-courses' },
      ],
      key: 'course-management',
    },
    {
      header: { text: 'Reports', icon: <AssessmentIcon />, path: '/admin/reports' },
      children: [],
      key: 'reports',
    },
    {
      header: { text: 'Settings', icon: <SettingsIcon />, path: '/admin/settings' },
      children: [],
      key: 'settings',
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
        bgcolor: 'white',
        color: '#666',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid rgba(0,0,0,0.08)',
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1200,
      }}
      onMouseEnter={() => collapsed && setHoverExpanded(true)}
      onMouseLeave={() => collapsed && setHoverExpanded(false)}
    >
      {/* Brand Section */}
      <Box
        sx={{
          height: 70,
          minHeight: 70,
          display: 'flex',
          alignItems: 'center',
          px: isExpanded ? 3 : 2,
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          overflow: 'hidden',
          whiteSpace: 'nowrap',
          transition: 'all 0.3s ease',
        }}
      >
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: '#FD7E14',
            fontWeight: 700,
            fontSize: '1rem',
            mr: isExpanded ? 2 : 0,
            transition: 'margin 0.3s ease',
          }}
        >
          I
        </Avatar>
        <Box
          sx={{
            opacity: isExpanded ? 1 : 0,
            width: isExpanded ? 'auto' : 0,
            transform: isExpanded ? 'translateX(0)' : 'translateX(10px)',
            transition: 'all 0.3s ease',
            visibility: isExpanded ? 'visible' : 'hidden',
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: '#202F32', lineHeight: 1 }}>
            IremeHub
          </Typography>
          <Typography variant="caption" sx={{ color: '#999', display: 'block', mt: 0 }}>
            Admin Portal
          </Typography>
        </Box>
      </Box>

      {/* Navigation Menu */}
      <Box
        sx={{
          flex: 1,
          py: 2,
          overflowY: 'auto',
          overflowX: 'hidden',
          '&::-webkit-scrollbar': { width: '4px' },
          '&::-webkit-scrollbar-thumb': { bgcolor: 'rgba(0,0,0,0.1)', borderRadius: '4px' },
        }}
      >
        <Typography
          variant="caption"
          sx={{
            px: 3,
            mb: 1,
            display: isExpanded ? 'block' : 'none',
            fontWeight: 700,
            color: '#999',
            letterSpacing: '0.5px'
          }}
        >
          MENU
        </Typography>

        <List sx={{ px: 2 }}>
          {groups.map((group) => {
            const hasChildren = group.children.length > 0;
            // Check if active: either exact match on header path, or match on any child path
            const isGroupActive = group.header.path
              ? location.pathname === group.header.path
              : group.children.some(child => location.pathname.startsWith(child.path));

            const isOpen = openGroups[group.key];

            if (!hasChildren) {
              // Single item
              return (
                <ListItem key={group.key} disablePadding sx={{ mb: 0.5, display: 'block' }}>
                  <Tooltip title={!isExpanded ? group.header.text : ''} placement="right">
                    <ListItemButton
                      component={Link}
                      to={group.header.path}
                      onClick={() => isMobile && onMobileClose()}
                      sx={{
                        minHeight: 44,
                        justifyContent: isExpanded ? 'initial' : 'center',
                        px: 2.5,
                        borderRadius: '8px',
                        bgcolor: isGroupActive ? 'rgba(253, 126, 20, 0.08)' : 'transparent',
                        color: isGroupActive ? '#FD7E14' : '#666',
                        '&:hover': {
                          bgcolor: isGroupActive ? 'rgba(253, 126, 20, 0.12)' : 'rgba(0,0,0,0.04)',
                          color: isGroupActive ? '#FD7E14' : '#202F32',
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: 0,
                          mr: isExpanded ? 2 : 0,
                          justifyContent: 'center',
                          color: 'inherit',
                        }}
                      >
                        {group.header.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={group.header.text}
                        sx={{
                          opacity: isExpanded ? 1 : 0,
                          display: isExpanded ? 'block' : 'none',
                          m: 0,
                          '& .MuiTypography-root': { fontWeight: isGroupActive ? 600 : 500, fontSize: '0.9rem' }
                        }}
                      />
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              );
            }

            // Has children - Collapsible Group
            return (
              <Box key={group.key} sx={{ mb: 0.5 }}>
                <Tooltip title={!isExpanded ? group.header.text : ''} placement="right">
                  <ListItemButton
                    onClick={() => toggleGroup(group.key)}
                    sx={{
                      minHeight: 44,
                      justifyContent: isExpanded ? 'initial' : 'center',
                      px: 2.5,
                      borderRadius: '8px',
                      color: isGroupActive ? '#FD7E14' : '#666',
                      '&:hover': {
                        bgcolor: 'rgba(0,0,0,0.04)',
                        color: '#202F32',
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: isExpanded ? 2 : 0,
                        justifyContent: 'center',
                        color: 'inherit',
                      }}
                    >
                      {group.header.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={group.header.text}
                      sx={{
                        opacity: isExpanded ? 1 : 0,
                        display: isExpanded ? 'block' : 'none',
                        m: 0,
                        '& .MuiTypography-root': { fontWeight: 600, fontSize: '0.9rem' }
                      }}
                    />
                    {isExpanded && (
                      <ExpandMoreIcon
                        sx={{
                          fontSize: '1.2rem',
                          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s',
                          opacity: 0.5,
                          ml: 'auto'
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>

                <Collapse in={isOpen && isExpanded} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {group.children.map((child) => {
                      const isChildActive = location.pathname.startsWith(child.path);
                      return (
                        <ListItemButton
                          key={child.path}
                          component={Link}
                          to={child.path}
                          onClick={() => isMobile && onMobileClose()}
                          sx={{
                            pl: 6,
                            py: 1,
                            borderRadius: '8px',
                            bgcolor: isChildActive ? 'rgba(253, 126, 20, 0.08)' : 'transparent',
                            color: isChildActive ? '#FD7E14' : '#666',
                            '&:hover': {
                              bgcolor: isChildActive ? 'rgba(253, 126, 20, 0.12)' : 'rgba(0,0,0,0.04)',
                              color: isChildActive ? '#FD7E14' : '#202F32',
                            },
                            mb: 0.5,
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 24, color: 'inherit', mr: 1.5 }}>
                            {child.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={child.text}
                            primaryTypographyProps={{ fontSize: '0.85rem', fontWeight: isChildActive ? 600 : 500 }}
                          />
                        </ListItemButton>
                      );
                    })}
                  </List>
                </Collapse>
              </Box>
            );
          })}
        </List>
      </Box>

      {/* Footer / Toggle Section */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <Tooltip title={!isExpanded ? 'Logout' : ''} placement="right">
          <Button
            fullWidth
            onClick={handleLogout}
            sx={{
              minWidth: 0,
              justifyContent: isExpanded ? 'flex-start' : 'center',
              color: '#666',
              textTransform: 'none',
              px: isExpanded ? 2 : 0,
              py: 1,
              mb: 1,
              borderRadius: '8px',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.04)', color: '#d32f2f' },
            }}
          >
            <LogoutIcon sx={{ mr: isExpanded ? 2 : 0, fontSize: '1.2rem' }} />
            {isExpanded && <Typography variant="body2" sx={{ fontWeight: 500 }}>Logout</Typography>}
          </Button>
        </Tooltip>

        {!isMobile && (
          <Button
            fullWidth
            onClick={() => setCollapsed(!collapsed)}
            sx={{
              minWidth: 0,
              justifyContent: 'center',
              color: '#999',
              bgcolor: 'rgba(0,0,0,0.02)',
              py: 0.5,
              borderRadius: '8px',
              '&:hover': { bgcolor: 'rgba(0,0,0,0.05)', color: '#666' },
            }}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </Button>
        )}
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: isExpanded ? 280 : 80 },
        flexShrink: { md: 0 },
        transition: 'width 0.3s ease',
      }}
    >
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={onMobileClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
          }}
        >
          {sidebarContent}
        </Drawer>
      ) : (
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: isExpanded ? 280 : 80,
              borderRight: 'none',
              transition: 'width 0.3s ease',
              overflowX: 'hidden',
              backgroundColor: 'transparent',
            },
          }}
          open
        >
          {sidebarContent}
        </Drawer>
      )}
    </Box>
  );
};

export default AdminSidebar;