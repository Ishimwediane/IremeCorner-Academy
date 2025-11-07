import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
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
  KeyboardArrowDown,
  Language as LanguageIcon,
  Search,
  Assignment,
  Quiz,
  CardMembership,
  Explore,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../hooks/useNotifications';

const categories = [
  'Digital Tools',
  'Marketing',
  'Financial Literacy',
  'Business Management',
  'Technical Skills',
  'Other',
];

const languages = ['English', 'French', 'Spanish', 'Portuguese', 'Arabic', 'Swahili'];

const DashboardNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [categoryAnchor, setCategoryAnchor] = useState(null);
  const [languageAnchor, setLanguageAnchor] = useState(null);
  const [learnerMenuAnchor, setLearnerMenuAnchor] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const { unreadCount } = useNotifications();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCategoryClick = (event) => {
    setCategoryAnchor(event.currentTarget);
  };

  const handleCategoryClose = () => {
    setCategoryAnchor(null);
  };

  const handleLanguageClick = (event) => {
    setLanguageAnchor(event.currentTarget);
  };

  const handleLanguageClose = () => {
    setLanguageAnchor(null);
  };

  const handleLearnerMenuClick = (event) => {
    setLearnerMenuAnchor(event.currentTarget);
  };

  const handleLearnerMenuClose = () => {
    setLearnerMenuAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    handleCategoryClose();
    navigate(`/courses?category=${encodeURIComponent(category)}`);
  };

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    handleLanguageClose();
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        bgcolor: 'white',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {/* Gradient at top */}
      <Box
        sx={{
          height: '3px',
          background: 'linear-gradient(90deg, #4A90E2 0%, #7B68EE 100%)',
        }}
      />

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: { xs: 2, md: 4 },
          py: 1.5,
          gap: 2,
        }}
      >
        {/* Logo and Brand Name */}
        <Box
          component={Link}
          to="/"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            textDecoration: 'none',
            mr: 1,
          }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              background: 'linear-gradient(135deg, #4A90E2 0%, #7B68EE 100%)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <School sx={{ color: 'white', fontSize: 24 }} />
          </Box>
          <Typography
            variant="h6"
            sx={{
              color: '#202F32',
              fontWeight: 700,
              fontSize: '1.2rem',
            }}
          >
            IremeCorner Academy
          </Typography>
        </Box>

        {/* Categories Dropdown */}
        <Button
          onClick={handleCategoryClick}
          endIcon={<KeyboardArrowDown />}
          sx={{
            color: '#202F32',
            textTransform: 'none',
            fontWeight: 500,
            border: '1px solid rgba(0,0,0,0.12)',
            borderRadius: '8px',
            px: 2,
            py: 0.75,
            minWidth: 120,
            bgcolor: 'rgba(0,0,0,0.02)',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.05)',
            },
          }}
        >
          {selectedCategory}
        </Button>
        <Menu
          anchorEl={categoryAnchor}
          open={Boolean(categoryAnchor)}
          onClose={handleCategoryClose}
        >
          <MenuItem onClick={() => handleCategorySelect('All Categories')}>
            All Categories
          </MenuItem>
          {categories.map((cat) => (
            <MenuItem key={cat} onClick={() => handleCategorySelect(cat)}>
              {cat}
            </MenuItem>
          ))}
        </Menu>

        {/* Search Bar */}
        <Box
          sx={{
            flex: 1,
            maxWidth: 500,
            position: 'relative',
          }}
        >
          <TextField
            fullWidth
            placeholder="Find your course"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
            size="small"
            InputProps={{
              startAdornment: (
                <Search sx={{ mr: 1, color: 'rgba(0,0,0,0.4)', fontSize: 20 }} />
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(0,0,0,0.02)',
                borderRadius: '8px',
                '& fieldset': {
                  borderColor: 'rgba(0,0,0,0.12)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(0,0,0,0.2)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#C39766',
                },
              },
            }}
          />
        </Box>

        {/* Learner Menu Dropdown */}
        <Button
          onClick={handleLearnerMenuClick}
          endIcon={<KeyboardArrowDown />}
          sx={{
            color: '#202F32',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.04)',
            },
          }}
        >
          My Learning
        </Button>
        <Menu
          anchorEl={learnerMenuAnchor}
          open={Boolean(learnerMenuAnchor)}
          onClose={handleLearnerMenuClose}
        >
          <MenuItem 
            component={Link} 
            to="/my-courses" 
            onClick={handleLearnerMenuClose}
          >
            <School sx={{ mr: 1, fontSize: 20 }} />
            My Courses
          </MenuItem>
          <MenuItem 
            component={Link} 
            to="/learner/courses" 
            onClick={handleLearnerMenuClose}
          >
            <Explore sx={{ mr: 1, fontSize: 20 }} />
            Explore Courses
          </MenuItem>
          <MenuItem 
            onClick={handleLearnerMenuClose}
            sx={{ opacity: 0.6 }}
          >
            <Assignment sx={{ mr: 1, fontSize: 20 }} />
            My Assignments
          </MenuItem>
          <MenuItem 
            onClick={handleLearnerMenuClose}
            sx={{ opacity: 0.6 }}
          >
            <Quiz sx={{ mr: 1, fontSize: 20 }} />
            Quiz
          </MenuItem>
          <MenuItem 
            onClick={handleLearnerMenuClose}
            sx={{ opacity: 0.6 }}
          >
            <CardMembership sx={{ mr: 1, fontSize: 20 }} />
            Certificates
          </MenuItem>
        </Menu>

        {/* Language Selector */}
        <Button
          onClick={handleLanguageClick}
          startIcon={<LanguageIcon sx={{ fontSize: 20 }} />}
          endIcon={<KeyboardArrowDown />}
          sx={{
            color: '#202F32',
            textTransform: 'none',
            fontWeight: 500,
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.04)',
            },
          }}
        >
          {selectedLanguage}
        </Button>
        <Menu
          anchorEl={languageAnchor}
          open={Boolean(languageAnchor)}
          onClose={handleLanguageClose}
        >
          {languages.map((lang) => (
            <MenuItem
              key={lang}
              onClick={() => handleLanguageSelect(lang)}
              selected={selectedLanguage === lang}
            >
              {lang}
            </MenuItem>
          ))}
        </Menu>

        {/* Notification Bell */}
        <IconButton
          component={Link}
          to="/dashboard"
          sx={{
            color: '#202F32',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.04)',
            },
          }}
        >
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        {/* User Profile */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            cursor: 'pointer',
            px: 1,
            py: 0.5,
            borderRadius: '8px',
            '&:hover': {
              bgcolor: 'rgba(0,0,0,0.04)',
            },
          }}
          onClick={handleMenu}
        >
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: '#C39766',
              fontSize: '0.9rem',
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </Avatar>
          <Typography
            sx={{
              color: '#202F32',
              fontWeight: 500,
              fontSize: '0.95rem',
              display: { xs: 'none', md: 'block' },
            }}
          >
            {user?.name || 'User'}
          </Typography>
          <KeyboardArrowDown sx={{ color: '#202F32', fontSize: 20 }} />
        </Box>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <MenuItem component={Link} to="/profile" onClick={handleClose}>
            Profile
          </MenuItem>
          <MenuItem component={Link} to="/dashboard" onClick={handleClose}>
            <DashboardIcon sx={{ mr: 1, fontSize: 20 }} />
            Dashboard
          </MenuItem>
          {user?.role === 'admin' && (
            <MenuItem component={Link} to="/admin" onClick={handleClose}>
              <AdminPanelSettings sx={{ mr: 1, fontSize: 20 }} />
              Admin Panel
            </MenuItem>
          )}
          {(user?.role === 'trainer' || user?.role === 'admin') && (
            <MenuItem component={Link} to="/create-course" onClick={handleClose}>
              <School sx={{ mr: 1, fontSize: 20 }} />
              Create Course
            </MenuItem>
          )}
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default DashboardNavbar;

