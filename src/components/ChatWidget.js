import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Fab,
  Slide,
  Button,
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  SmartToy,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useMutation } from 'react-query';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const ChatWidget = () => {
  const { user, isAuthenticated } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(() => [
    {
      type: 'bot',
      content: 'Hello! I\'m Nuru, your AI learning assistant. How can I help you today?',
    },
  ]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const hasInitializedRef = useRef(false);

  // Update welcome message based on auth state when chat opens
  useEffect(() => {
    if (open && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      setMessages([
        {
          type: 'bot',
          content: isAuthenticated
            ? 'Hello! I\'m Nuru, your AI learning assistant. How can I help you today?'
            : 'Hello! I\'m Nuru, your AI learning assistant. Please sign in to start chatting with me!',
        },
      ]);
    }
  }, [open, isAuthenticated]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [open]);

  const chatMutation = useMutation(
    async (msg) => {
      const response = await api.post('/ai-assistant/chat', { message: msg });
      return response.data;
    },
    {
      onSuccess: (data) => {
        setMessages((prev) => [
          ...prev,
          { type: 'bot', content: data.data.message },
        ]);
      },
      onError: (error) => {
        if (error.response?.status === 401) {
          setMessages((prev) => [
            ...prev,
            { type: 'bot', content: 'Please sign in to chat with Nuru. You can create a free account or log in to continue!' },
          ]);
        } else {
          toast.error('Failed to get response from Nuru');
          setMessages((prev) => [
            ...prev,
            { type: 'bot', content: 'Sorry, I\'m having trouble right now. Please try again later.' },
          ]);
        }
      },
    }
  );

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || chatMutation.isLoading) return;

    if (!isAuthenticated) {
      toast.info('Please sign in to chat with Nuru');
      return;
    }

    const userMessage = message;
    setMessages((prev) => [...prev, { type: 'user', content: userMessage }]);
    setMessage('');
    chatMutation.mutate(userMessage);
  };

  return (
    <>
      {/* Chat Window */}
      <Slide direction="up" in={open} mountOnEnter unmountOnExit>
        <Paper
          elevation={24}
          sx={{
            position: 'fixed',
            bottom: 100,
            right: 24,
            width: { xs: 'calc(100vw - 48px)', sm: 380 },
            height: 500,
            maxHeight: 'calc(100vh - 140px)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1300,
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          }}
        >
          {/* Header */}
          <Box
            sx={{
              bgcolor: '#FD7E14',
              color: 'white',
              p: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  width: 40,
                  height: 40,
                }}
              >
                <SmartToy />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                  Chat with Nuru
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
                  AI Learning Assistant
                </Typography>
              </Box>
            </Box>
            <IconButton
              size="small"
              onClick={() => setOpen(false)}
              sx={{ color: 'white' }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            sx={{
              flex: 1,
              overflow: 'auto',
              p: 2,
              bgcolor: '#fafafa',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                {msg.type === 'bot' && (
                  <Avatar
                    sx={{
                      bgcolor: '#FD7E14',
                      width: 32,
                      height: 32,
                      mt: 0.5,
                    }}
                  >
                    <SmartToy sx={{ fontSize: 20 }} />
                  </Avatar>
                )}
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    maxWidth: '75%',
                    bgcolor: msg.type === 'user' ? '#FD7E14' : 'white',
                    color: msg.type === 'user' ? 'white' : '#202F32',
                    borderRadius: msg.type === 'user'
                      ? '16px 16px 4px 16px'
                      : '16px 16px 16px 4px',
                    boxShadow: msg.type === 'user'
                      ? 'none'
                      : '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.875rem',
                      lineHeight: 1.5,
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.content}
                  </Typography>
                </Paper>
                {msg.type === 'user' && (
                  <Avatar
                    sx={{
                      bgcolor: '#202F32',
                      width: 32,
                      height: 32,
                      mt: 0.5,
                      fontSize: '0.875rem',
                    }}
                  >
                    You
                  </Avatar>
                )}
              </Box>
            ))}
            {chatMutation.isLoading && (
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  gap: 1,
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: '#FD7E14',
                    width: 32,
                    height: 32,
                    mt: 0.5,
                  }}
                >
                  <SmartToy sx={{ fontSize: 20 }} />
                </Avatar>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    bgcolor: 'white',
                    borderRadius: '16px 16px 16px 4px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.875rem',
                      color: '#202F32',
                      fontStyle: 'italic',
                    }}
                  >
                    Nuru is typing...
                  </Typography>
                </Paper>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Input or Login Prompt */}
          {!isAuthenticated ? (
            <Box
              sx={{
                p: 2,
                bgcolor: 'white',
                borderTop: '1px solid #e0e0e0',
                display: 'flex',
                flexDirection: 'column',
                gap: 1.5,
              }}
            >
              <Typography variant="body2" sx={{ textAlign: 'center', color: '#666', mb: 1 }}>
                Sign in to chat with Nuru
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  component={Link}
                  to="/register"
                  variant="contained"
                  fullWidth
                  startIcon={<LoginIcon />}
                  sx={{
                    bgcolor: '#FD7E14',
                    '&:hover': { bgcolor: '#E56D0F' },
                    borderRadius: '24px',
                  }}
                  onClick={() => setOpen(false)}
                >
                  Sign Up
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  variant="outlined"
                  fullWidth
                  sx={{
                    borderColor: '#FD7E14',
                    color: '#FD7E14',
                    '&:hover': {
                      borderColor: '#E56D0F',
                      bgcolor: 'rgba(253, 126, 20, 0.05)',
                    },
                    borderRadius: '24px',
                  }}
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Button>
              </Box>
            </Box>
          ) : (
            <Box
              component="form"
              onSubmit={handleSend}
              sx={{
                p: 2,
                bgcolor: 'white',
                borderTop: '1px solid #e0e0e0',
                display: 'flex',
                gap: 1,
              }}
            >
              <TextField
                inputRef={inputRef}
                fullWidth
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                variant="outlined"
                size="small"
                disabled={chatMutation.isLoading}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '24px',
                    bgcolor: '#f5f5f5',
                    '& fieldset': {
                      borderColor: 'transparent',
                    },
                    '&:hover fieldset': {
                      borderColor: '#FD7E14',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#FD7E14',
                    },
                  },
                }}
              />
              <IconButton
                type="submit"
                disabled={!message.trim() || chatMutation.isLoading}
                sx={{
                  bgcolor: '#FD7E14',
                  color: 'white',
                  '&:hover': {
                    bgcolor: '#E56D0F',
                  },
                  '&:disabled': {
                    bgcolor: '#e0e0e0',
                    color: '#9e9e9e',
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          )}
        </Paper>
      </Slide>

      {/* Chat Button */}
      <Fab
        color="primary"
        aria-label="chat"
        onClick={() => setOpen(!open)}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          bgcolor: '#FD7E14',
          color: 'white',
          zIndex: 1300,
          width: 60,
          height: 60,
          boxShadow: '0 4px 12px rgba(253, 126, 20, 0.4)',
          '&:hover': {
            bgcolor: '#E56D0F',
            boxShadow: '0 6px 16px rgba(253, 126, 20, 0.5)',
            transform: 'scale(1.05)',
          },
          transition: 'all 0.3s ease',
        }}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </Fab>
    </>
  );
};

export default ChatWidget;

