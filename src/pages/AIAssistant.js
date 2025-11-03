import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  Avatar,
  CircularProgress,
  Card,
  CardContent,
  Grid,
  Chip,
} from '@mui/material';
import {
  SmartToy,
  Send,
  Recommend,
} from '@mui/icons-material';
import { useMutation, useQuery } from 'react-query';
import api from '../utils/api';
import { toast } from 'react-toastify';

const AIAssistant = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: 'Hello! I\'m your AI learning assistant. How can I help you today?',
    },
  ]);

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
      onError: () => {
        toast.error('Failed to get response from AI assistant');
      },
    }
  );

  const { data: recommendationsData } = useQuery(
    'ai-recommendations',
    async () => {
      const response = await api.get('/ai-assistant/recommendations');
      return response.data;
    }
  );

  const recommendations = recommendationsData?.data?.recommendations || [];
  const basedOn = recommendationsData?.data?.basedOn || '';

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessages((prev) => [...prev, { type: 'user', content: userMessage }]);
    setMessage('');
    chatMutation.mutate(userMessage);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        AI Learning Assistant
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, mb: 2, height: 500, overflow: 'auto' }}>
            <List>
              {messages.map((msg, index) => (
                <ListItem
                  key={index}
                  sx={{
                    flexDirection: msg.type === 'user' ? 'row-reverse' : 'row',
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: msg.type === 'user' ? 'primary.main' : 'secondary.main',
                      mx: 1,
                    }}
                  >
                    {msg.type === 'user' ? 'U' : <SmartToy />}
                  </Avatar>
                  <Paper
                    sx={{
                      p: 2,
                      bgcolor: msg.type === 'user' ? 'primary.light' : 'grey.100',
                      maxWidth: '70%',
                    }}
                  >
                    <Typography variant="body1">{msg.content}</Typography>
                  </Paper>
                </ListItem>
              ))}
              {chatMutation.isLoading && (
                <ListItem>
                  <CircularProgress size={20} />
                </ListItem>
              )}
            </List>
          </Paper>

          <Paper component="form" onSubmit={handleSend} sx={{ p: 1, display: 'flex' }}>
            <TextField
              fullWidth
              placeholder="Ask me anything about courses, learning, or recommendations..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
              size="small"
            />
            <Button
              type="submit"
              variant="contained"
              startIcon={<Send />}
              disabled={chatMutation.isLoading || !message.trim()}
              sx={{ ml: 1 }}
            >
              Send
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Recommend color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Recommended Courses</Typography>
              </Box>
              {basedOn && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Based on {basedOn}
                </Typography>
              )}
              {recommendations.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No recommendations available
                </Typography>
              ) : (
                <List>
                  {recommendations.map((course) => (
                    <ListItem key={course._id} sx={{ flexDirection: 'column', alignItems: 'flex-start', px: 0 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {course.title}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                        <Chip label={course.category} size="small" />
                        <Chip label={course.level} size="small" color="primary" />
                      </Box>
                    </ListItem>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AIAssistant;


