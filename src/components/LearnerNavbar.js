import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  School,
  Notifications,
  ExitToApp,
  AccountCircle,
  Dashboard,
} from '@mui/icons-material';

const LearnerNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : '';

  return (
    <AppBar
      position="fixed"
      sx={{
        boxShadow: '0 2px 4px -2px rgba(0,0,0,0.1)',
        bgcolor: 'background.paper',
        color: 'text.primary',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Toolbar
        sx={{
          justifyContent: 'space-between',
          height: '70px',
        }}
      >
        <Box
          sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
          component={Link}
          to="/learner/dashboard"
        >
          <School sx={{ mr: 1, color: '#C39766' }} />
          <Typography
            variant="h6"
            sx={{ fontWeight: 'bold', color: '#C39766' }}
          >
            Ireme Academy
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            component={Link}
            to="/learner/dashboard"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                color: '#C39766',
              },
            }}
          >
            Dashboard
          </Button>
          <Button
            component={Link}
            to="/learner/my-learning"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                color: '#C39766',
              },
            }}
          >
            My Learning
          </Button>
          <Button
            component={Link}
            to="/learner/courses"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                color: '#C39766',
              },
            }}
          >
            Browse Courses
          </Button>
          <IconButton
            component={Link}
            to="/learner/notifications"
            color="inherit"
          >
            <Notifications />
          </IconButton>

          <Box sx={{ ml: 2 }}>
            <IconButton
              onClick={handleMenu}
              sx={{ p: 0 }}
            >
              <Avatar sx={{ bgcolor: '#C39766' }}>{userInitial}</Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose} component={Link} to="/profile">
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                Profile
              </MenuItem>
              <MenuItem onClick={handleClose} component={Link} to="/learner/dashboard">
                <ListItemIcon>
                  <Dashboard fontSize="small" />
                </ListItemIcon>
                Dashboard
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToApp fontSize="small" />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default LearnerNavbar;