import React, { useState } from 'react';
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, Avatar, Divider, IconButton, AppBar, Toolbar, InputBase, Badge, Tooltip } from '@mui/material';
import {
    Dashboard as DashboardIcon,
    Inbox,
    MenuBook,
    Assignment,
    Groups,
    Settings,
    Logout,
    Search,
    Notifications,
    FilterList,
    Menu as MenuIcon,
    ChevronLeft,
    ChevronRight,
    Psychology,

} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const DRAWER_WIDTH = 240;
const COLLAPSED_DRAWER_WIDTH = 70;

const LearnerDashboardLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { i18n } = useTranslation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/learner/dashboard', section: 'overview' },
        { text: 'Inbox', icon: <Inbox />, path: '/learner/messages', section: 'overview' },
        { text: 'Lesson', icon: <MenuBook />, path: '/learner/courses', section: 'overview' },
        { text: 'Task', icon: <Assignment />, path: '/learner/my-learning', section: 'overview' },
        { text: 'Group', icon: <Groups />, path: '/learner/groups', section: 'overview' },
        { text: 'Career Guidance', icon: <Psychology />, path: '/learner/career-guidance', section: 'overview' },
    ];

    const settingsItems = [
        { text: 'Settings', icon: <Settings />, path: '/learner/settings' },
        { text: 'Logout', icon: <Logout />, action: handleLogout },
    ];

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                        IremeHub
                    </Typography>
                )}
            </Box>

            {/* Toggle Button */}
            <Box sx={{ px: 2, mb: 2, display: 'flex', justifyContent: collapsed ? 'center' : 'flex-end' }}>
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

            {/* Overview Section */}
            {!collapsed && (
                <Box sx={{ px: 2, mb: 1 }}>
                    <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                        OVERVIEW
                    </Typography>
                </Box>
            )}

            <List sx={{ px: 2, flex: 1 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Tooltip key={item.text} title={collapsed ? item.text : ''} placement="right">
                            <ListItem disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton
                                    component={Link}
                                    to={item.path}
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

            {/* Friends Section - Hidden when collapsed */}
            {!collapsed && (
                <>
                    <Box sx={{ px: 2, mb: 1 }}>
                        <Typography variant="caption" sx={{ color: '#666', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                            FRIENDS
                        </Typography>
                    </Box>
                    <List sx={{ px: 2, mb: 2 }}>
                        {[1, 2, 3].map((i) => (
                            <ListItem key={i} disablePadding sx={{ mb: 0.5 }}>
                                <ListItemButton sx={{ borderRadius: '8px', py: 0.5, px: 2 }}>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                        <Avatar sx={{ width: 28, height: 28, fontSize: '0.75rem', bgcolor: '#E0E0E0' }}>P</Avatar>
                                    </ListItemIcon>
                                    <Box>
                                        <Typography variant="caption" sx={{ fontSize: '0.8rem', fontWeight: 600, color: '#1A1A1A', display: 'block' }}>
                                            Prashant
                                        </Typography>
                                        <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#999' }}>
                                            Software Developer
                                        </Typography>
                                    </Box>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </>
            )}

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
                {settingsItems.map((item) => (
                    <Tooltip key={item.text} title={collapsed ? item.text : ''} placement="right">
                        <ListItem disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                component={item.path ? Link : 'div'}
                                to={item.path}
                                onClick={item.action}
                                sx={{
                                    borderRadius: '8px',
                                    py: 1,
                                    px: collapsed ? 1 : 2,
                                    justifyContent: collapsed ? 'center' : 'flex-start',
                                    color: item.text === 'Logout' ? '#EF4444' : '#666',
                                    '&:hover': {
                                        bgcolor: item.text === 'Logout' ? 'rgba(239, 68, 68, 0.05)' : 'rgba(0,0,0,0.03)',
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
                                            fontWeight: 500,
                                        }}
                                    />
                                )}
                            </ListItemButton>
                        </ListItem>
                    </Tooltip>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#F9FAFB' }}>
            {/* Top AppBar for mobile */}
            <AppBar
                position="fixed"
                sx={{
                    display: { sm: 'none' },
                    bgcolor: 'white',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
            >
                <Toolbar>
                    <IconButton edge="start" color="inherit" onClick={handleDrawerToggle}>
                        <MenuIcon sx={{ color: '#1A1A1A' }} />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1, color: '#1A1A1A', fontWeight: 700 }}>
                        Dashboard
                    </Typography>
                </Toolbar>
            </AppBar>

            {/* Sidebar Drawer */}
            <Box
                component="nav"
                sx={{ width: { sm: collapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH }, flexShrink: { sm: 0 }, transition: 'width 0.3s' }}
            >
                {/* Mobile drawer */}
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: collapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH, bgcolor: 'white', borderRight: '1px solid #E5E7EB', transition: 'width 0.3s' },
                    }}
                >
                    {drawer}
                </Drawer>

                {/* Desktop drawer */}
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: collapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH, bgcolor: 'white', borderRight: '1px solid #E5E7EB', transition: 'width 0.3s' },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { sm: `calc(100% - ${collapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH}px)` },
                    transition: 'width 0.3s',
                    minHeight: '100vh',
                    bgcolor: '#F9FAFB',
                }}
            >
                {/* Top Bar */}
                <Box
                    sx={{
                        bgcolor: 'white',
                        borderBottom: '1px solid #E5E7EB',
                        px: 3,
                        py: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        position: 'sticky',
                        top: 0,
                        zIndex: 10,
                    }}
                >
                    {/* Search Bar */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            bgcolor: '#F3F4F6',
                            borderRadius: '8px',
                            px: 2,
                            py: 1,
                            width: { xs: '100%', md: '400px' },
                        }}
                    >
                        <Search sx={{ color: '#9CA3AF', fontSize: 20, mr: 1 }} />
                        <InputBase
                            placeholder="Search your course here..."
                            sx={{ flex: 1, fontSize: '0.875rem', color: '#1A1A1A' }}
                        />
                    </Box>

                    {/* Right Side Icons */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton size="small">
                            <FilterList sx={{ fontSize: 20 }} />
                        </IconButton>
                        <IconButton size="small">
                            <Badge badgeContent={3} color="error">
                                <Notifications sx={{ fontSize: 20 }} />
                            </Badge>
                        </IconButton>

                        {/* Language Selector */}
                        <Box sx={{ display: 'flex', gap: 0.5, bgcolor: '#F3F4F6', borderRadius: '6px', p: 0.5 }}>
                            <Box
                                onClick={() => i18n.changeLanguage('en')}
                                sx={{
                                    px: 1.5,
                                    py: 0.5,
                                    borderRadius: '4px',
                                    cursor: 'pointer',
                                    bgcolor: i18n.language === 'en' ? '#FD7E14' : 'transparent',
                                    color: i18n.language === 'en' ? '#fff' : '#666',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        bgcolor: i18n.language === 'en' ? '#FD7E14' : 'rgba(253, 126, 20, 0.1)',
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
                                    color: i18n.language === 'rw' ? '#fff' : '#666',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    transition: 'all 0.2s',
                                    '&:hover': {
                                        bgcolor: i18n.language === 'rw' ? '#FD7E14' : 'rgba(253, 126, 20, 0.1)',
                                    },
                                }}
                            >
                                RW
                            </Box>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: '#FD7E14' }}>
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </Avatar>
                            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.875rem', color: '#1A1A1A' }}>
                                    Your Profile
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>

                {/* Page Content */}
                <Box sx={{ p: 0 }}>{children}</Box>
            </Box>
        </Box>
    );
};

export default LearnerDashboardLayout;
