import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  School,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
        position: 'fixed', // Changed from absolute to fixed
        top: 30,
        left: 0,
        right: 0,
        zIndex: 1100,
        display: 'flex',
        justifyContent: 'center',
        px: 2,
        pointerEvents: 'none', // Allow clicking through the wrapper
      }}
    >
      <Box
        sx={{
          pointerEvents: 'auto', // Re-enable clicks on the navbar itself
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderRadius: '50px',
          px: 4,
          py: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          maxWidth: '1200px',
          boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
          border: '1px solid rgba(255,255,255,0.3)',
        }}
      >
        {/* Logo */}
        <Box
          component={Link}
          to="/"
          sx={{
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5
          }}
        >
          <Box
            sx={{
              bgcolor: '#1A1A1A',
              color: '#FD7E14',
              borderRadius: '50%',
              p: 0.5,
            }}
          >
            <School sx={{ fontSize: 24 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: '#1A1A1A',
              letterSpacing: '-0.5px',
              fontSize: '1.25rem'
            }}
          >
            IremeCorner
          </Typography>
        </Box>

        {/* Center Links (Desktop) */}
        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 1,
            alignItems: 'center',
            bgcolor: 'rgba(0,0,0,0.03)',
            p: 0.75,
            borderRadius: '50px',
          }}
        >
          {['Home', 'Courses', 'About Us', 'Contact Us'].map((item) => {
            const path = item === 'Home' ? '/' : `/${item.toLowerCase().replace(/ /g, '-')}`;
            const isActive = location.pathname === path;

            return (
              <Button
                key={item}
                component={Link}
                to={path}
                sx={{
                  color: isActive ? '#FD7E14' : '#666',
                  textTransform: 'none',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: '25px',
                  transition: 'all 0.2s',
                  bgcolor: isActive ? 'white' : 'transparent',
                  boxShadow: isActive ? '0 2px 10px rgba(0,0,0,0.05)' : 'none',
                  '&:hover': {
                    color: '#1A1A1A',
                    bgcolor: 'white',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  },
                }}
              >
                {item}
              </Button>
            );
          })}
        </Box>

        {/* Right Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {user ? (
            <>
              <IconButton
                component={Link}
                to="/dashboard"
                sx={{ color: '#1A1A1A' }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton onClick={handleMenu}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: '#FD7E14' }}>
                  {user.name?.charAt(0)?.toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={Link} to="/profile" onClick={handleClose}>Profile</MenuItem>
                <MenuItem component={Link} to="/dashboard" onClick={handleClose}>Dashboard</MenuItem>
                {user.role === 'admin' && <MenuItem component={Link} to="/admin" onClick={handleClose}>Admin</MenuItem>}
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                sx={{
                  color: '#1A1A1A',
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  px: 2,
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  background: '#FD7E14 !important', // Brand Orange enforced
                  color: 'white',
                  borderRadius: '30px',
                  px: 3,
                  py: 1,
                  textTransform: 'none',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  boxShadow: '0 4px 14px rgba(253, 126, 20, 0.4)',
                  '&:hover': {
                    background: '#FD7E14 !important',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 20px rgba(253, 126, 20, 0.6)', // Enhanced shadow for hover
                  },
                }}
              >
                Register
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Navbar;
