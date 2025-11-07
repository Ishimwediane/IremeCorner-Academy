import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Chip,
  IconButton,
  Divider,
  CircularProgress,
  Menu,
  MenuItem,
  Tabs,
  Tab,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CheckCircle,
  Delete,
  MoreVert,
  MarkEmailRead,
  School,
  Assignment,
  CardMembership,
  Message,
  Info,
  MenuBook,
} from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead, useDeleteNotification } from '../../hooks/useNotifications';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'course_update':
      return <MenuBook sx={{ fontSize: 24, color: '#4A90E2' }} />;
    case 'assignment_deadline':
      return <Assignment sx={{ fontSize: 24, color: '#FF6B6B' }} />;
    case 'new_course':
      return <School sx={{ fontSize: 24, color: '#50C878' }} />;
    case 'certificate':
      return <CardMembership sx={{ fontSize: 24, color: '#FFD700' }} />;
    case 'message':
      return <Message sx={{ fontSize: 24, color: '#7B68EE' }} />;
    case 'system':
      return <Info sx={{ fontSize: 24, color: '#202F32' }} />;
    default:
      return <NotificationsIcon sx={{ fontSize: 24, color: '#C39766' }} />;
  }
};

const getNotificationColor = (type) => {
  switch (type) {
    case 'course_update':
      return 'rgba(74, 144, 226, 0.1)';
    case 'assignment_deadline':
      return 'rgba(255, 107, 107, 0.1)';
    case 'new_course':
      return 'rgba(80, 200, 120, 0.1)';
    case 'certificate':
      return 'rgba(255, 215, 0, 0.1)';
    case 'message':
      return 'rgba(123, 104, 238, 0.1)';
    case 'system':
      return 'rgba(32, 47, 50, 0.05)';
    default:
      return 'rgba(195, 151, 102, 0.1)';
  }
};

const Notifications = () => {
  const navigate = useNavigate();
  const { notifications, unreadCount, isLoading } = useNotifications();
  const markAsRead = useMarkNotificationRead();
  const markAllAsRead = useMarkAllNotificationsRead();
  const deleteNotification = useDeleteNotification();
  const [tabValue, setTabValue] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleMenuOpen = (event, notification) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setSelectedNotification(notification);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedNotification(null);
  };

  const handleMarkAsRead = (notification) => {
    if (!notification.isRead) {
      markAsRead.mutate(notification._id);
    }
    handleMenuClose();
  };

  const handleDelete = (notification) => {
    deleteNotification.mutate(notification._id);
    handleMenuClose();
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead.mutate(notification._id);
    }
    if (notification.link) {
      navigate(notification.link);
    }
  };

  const handleMarkAllRead = () => {
    markAllAsRead.mutate();
  };

  const filteredNotifications = tabValue === 0 
    ? notifications 
    : tabValue === 1 
    ? notifications.filter(n => !n.isRead)
    : notifications.filter(n => n.isRead);

  const unreadNotifications = notifications.filter(n => !n.isRead);
  const readNotifications = notifications.filter(n => n.isRead);

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#202F32' }}>
            Notifications
          </Typography>
          {unreadCount > 0 && (
            <Button
              variant="outlined"
              startIcon={<MarkEmailRead />}
              onClick={handleMarkAllRead}
              disabled={markAllAsRead.isLoading}
              sx={{
                borderColor: '#C39766',
                color: '#C39766',
                textTransform: 'none',
                '&:hover': {
                  borderColor: '#A67A52',
                  bgcolor: 'rgba(195,151,102,0.05)',
                },
              }}
            >
              Mark All as Read
            </Button>
          )}
        </Box>
        <Typography variant="body2" sx={{ color: 'rgba(32,47,50,0.6)' }}>
          {notifications.length} {notifications.length === 1 ? 'notification' : 'notifications'}
          {unreadCount > 0 && ` • ${unreadCount} unread`}
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: -1 }}>
          <Tab 
            label={`All (${notifications.length})`} 
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Unread ({unreadNotifications.length})
                {unreadCount > 0 && (
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: 'error.main',
                    }}
                  />
                )}
              </Box>
            }
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
          <Tab 
            label={`Read (${readNotifications.length})`} 
            sx={{ textTransform: 'none', fontWeight: 600 }}
          />
        </Tabs>
      </Box>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card
          sx={{
            textAlign: 'center',
            py: 8,
            bgcolor: 'rgba(32,47,50,0.02)',
            borderRadius: '16px',
          }}
        >
          <NotificationsIcon sx={{ fontSize: 64, color: 'rgba(32,47,50,0.3)', mb: 2 }} />
          <Typography variant="h6" sx={{ color: '#202F32', mb: 1 }}>
            {tabValue === 1 ? 'No unread notifications' : tabValue === 2 ? 'No read notifications' : 'No notifications yet'}
          </Typography>
          <Typography variant="body2" sx={{ color: 'rgba(32,47,50,0.6)' }}>
            {tabValue === 1 
              ? 'You\'re all caught up!' 
              : 'You\'ll see notifications here when there\'s activity'}
          </Typography>
        </Card>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {filteredNotifications.map((notification) => (
            <Card
              key={notification._id}
              onClick={() => handleNotificationClick(notification)}
              sx={{
                cursor: notification.link ? 'pointer' : 'default',
                border: notification.isRead ? '1px solid rgba(0,0,0,0.08)' : '2px solid #C39766',
                borderRadius: '12px',
                bgcolor: notification.isRead ? 'white' : getNotificationColor(notification.type),
                transition: 'all 0.2s',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  transform: 'translateY(-2px)',
                },
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  {/* Icon */}
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '12px',
                      bgcolor: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    {getNotificationIcon(notification.type)}
                  </Box>

                  {/* Content */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{
                            fontWeight: notification.isRead ? 600 : 700,
                            color: '#202F32',
                            mb: 0.5,
                            fontSize: '1rem',
                          }}
                        >
                          {notification.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'rgba(32,47,50,0.7)',
                            mb: 1.5,
                            lineHeight: 1.6,
                          }}
                        >
                          {notification.message}
                        </Typography>
                      </Box>
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, notification)}
                        sx={{
                          color: 'rgba(32,47,50,0.5)',
                          '&:hover': {
                            bgcolor: 'rgba(0,0,0,0.04)',
                          },
                        }}
                      >
                        <MoreVert fontSize="small" />
                      </IconButton>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Chip
                          label={notification.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(32,47,50,0.08)',
                            color: '#202F32',
                            fontWeight: 500,
                            fontSize: '0.75rem',
                            height: 24,
                          }}
                        />
                        {!notification.isRead && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: '#C39766',
                            }}
                          />
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: 'rgba(32,47,50,0.6)',
                          fontSize: '0.75rem',
                        }}
                      >
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {selectedNotification && !selectedNotification.isRead && (
          <MenuItem onClick={() => handleMarkAsRead(selectedNotification)}>
            <CheckCircle sx={{ mr: 1, fontSize: 20 }} />
            Mark as Read
          </MenuItem>
        )}
        {selectedNotification && (
          <MenuItem 
            onClick={() => handleDelete(selectedNotification)}
            sx={{ color: 'error.main' }}
          >
            <Delete sx={{ mr: 1, fontSize: 20 }} />
            Delete
          </MenuItem>
        )}
      </Menu>
    </Container>
  );
};

export default Notifications;

