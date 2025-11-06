import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Badge,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  School,
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
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: 70,
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
      }}
    >
      {/* White background (left ~65%) */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '65%',
          height: '100%',
          bgcolor: 'white',
          zIndex: 0,
        }}
      />

      {/* Chocolate background (right ~35%) with oblique left edge */}
      <Box
        sx={{
          position: 'absolute',
          right: 0,
          top: 0,
          width: '35%',
          height: '100%',
          bgcolor: '#A84836',
          zIndex: 0,
          clipPath: 'polygon(15% 0%, 100% 0%, 100% 100%, 0% 100%)',
        }}
      />

      {/* Content */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          px: { xs: 2, md: 4 },
        }}
      >
        {/* Logo (Left) */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textDecoration: 'none',
            mr: 4,
          }}
        >
          <School sx={{ color: '#202F32', fontSize: 32 }} />
          <Typography
            variant="h6"
            sx={{
              color: '#202F32',
              fontWeight: 800,
              fontSize: { xs: '0.9rem', md: '1.1rem' },
            }}
          >
            IremeCorner
            <br />
            Academy
          </Typography>
        </Box>

        {/* Navigation Links (Center - White section) */}
        <Box
          sx={{
            flex: 1,
            display: { xs: 'none', md: 'flex' },
            gap: 3,
            alignItems: 'center',
          }}
        >
          <Button
            component={Link}
            to="/"
            sx={{
              color: '#202F32',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { color: '#A84836' },
            }}
          >
            Home
          </Button>
          <Button
            component={Link}
            to="/courses"
            sx={{
              color: '#202F32',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { color: '#A84836' },
            }}
          >
            Courses
          </Button>
          <Button
            component={Link}
            to="/#about"
            sx={{
              color: '#202F32',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { color: '#A84836' },
            }}
          >
            About Us
          </Button>
          <Button
            component={Link}
            to="/#contact"
            sx={{
              color: '#202F32',
              fontWeight: 500,
              textTransform: 'none',
              '&:hover': { color: '#A84836' },
            }}
          >
            Contact Us
          </Button>
        </Box>

        {/* Right Section (Gradient area) */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            ml: 'auto',
          }}
        >
          {user ? (
            <>
              {user.role === 'admin' && (
                <Button
                  component={Link}
                  to="/admin"
                  startIcon={<AdminPanelSettings />}
                  sx={{
                    color: 'white',
                    textTransform: 'none',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Admin
                </Button>
              )}
              {(user.role === 'trainer' || user.role === 'admin') && (
                <Button
                  component={Link}
                  to="/create-course"
                  startIcon={<School />}
                  sx={{
                    color: 'white',
                    textTransform: 'none',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                  }}
                >
                  Create Course
                </Button>
              )}
              <IconButton
                component={Link}
                to="/dashboard"
                sx={{ color: 'white' }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton onClick={handleMenu} sx={{ color: 'white' }}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.2)' }}>
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
            </>
          ) : (
            <Button
              component={Link}
              to="/login"
              sx={{
                bgcolor: 'white',
                color: '#202F32',
                borderRadius: '25px',
                px: 3,
                py: 1,
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                },
              }}
            >
              Sign in
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
