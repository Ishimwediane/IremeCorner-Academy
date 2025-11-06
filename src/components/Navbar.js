import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Badge,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  School as SchoolIcon,
  AdminPanelSettings,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const { unreadCount } = useNotifications();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 0, textDecoration: 'none', color: 'inherit', mr: 3 }}
        >
          IremeCorner Academy
        </Typography>

        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/courses">
            Courses
          </Button>
          {user && (
            <>
              <Button color="inherit" component={Link} to="/my-courses">
                My Courses
              </Button>
              <Button color="inherit" component={Link} to="/ai-assistant">
                AI Assistant
              </Button>
            </>
          )}
        </Box>

        {user ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {user.role === 'admin' && (
              <Button
                color="inherit"
                component={Link}
                to="/admin"
                startIcon={<AdminPanelSettings />}
              >
                Admin
              </Button>
            )}
            {(user.role === 'trainer' || user.role === 'admin') && (
              <Button
                color="inherit"
                component={Link}
                to="/create-course"
                startIcon={<SchoolIcon />}
              >
                Create Course
              </Button>
            )}
            <IconButton
              color="inherit"
              component={Link}
              to="/dashboard"
            >
              <Badge badgeContent={unreadCount} color="secondary">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <IconButton onClick={handleMenu} color="inherit">
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {user.name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem component={Link} to="/profile" onClick={handleClose}>
                Profile
              </MenuItem>
              <MenuItem component={Link} to="/dashboard" onClick={handleClose}>
                <DashboardIcon sx={{ mr: 1 }} />
                Dashboard
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;



