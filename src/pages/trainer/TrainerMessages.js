import React, { useState } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  TextField,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  Chip,
} from '@mui/material';
import {
  Send as SendIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import TrainerLayout from '../../components/TrainerLayout';

const TrainerMessages = () => {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [message, setMessage] = useState('');

  // TODO: Fetch messages from API
  const conversations = [];

  return (
    <TrainerLayout title="Messages">
      <Grid container spacing={3} sx={{ height: 'calc(100vh - 150px)' }}>
        {/* Conversations List */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '100%', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#202F32', mb: 2 }}>
                Conversations
              </Typography>
              <TextField
                fullWidth
                placeholder="Search messages..."
                size="small"
                InputProps={{
                  startAdornment: <SearchIcon sx={{ color: '#666', mr: 1 }} />,
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px',
                  },
                }}
              />
            </Box>
            <Box sx={{ flex: 1, overflow: 'auto' }}>
              {conversations.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    No conversations yet.
                  </Typography>
                </Box>
              ) : (
                <List>
                  {conversations.map((conversation) => (
                    <ListItem
                      key={conversation.id}
                      button
                      selected={selectedConversation?.id === conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      sx={{
                        '&.Mui-selected': {
                          bgcolor: 'rgba(195,151,102,0.1)',
                        },
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: '#C39766' }}>
                          {conversation.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={conversation.name}
                        secondary={conversation.lastMessage}
                      />
                      {conversation.unread > 0 && (
                        <Chip label={conversation.unread} size="small" color="error" />
                      )}
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          </Paper>
        </Grid>

        {/* Message View */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '100%', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
            {selectedConversation ? (
              <>
                <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: '#202F32' }}>
                    {selectedConversation.name}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                  {/* Messages will be displayed here */}
                  <Typography variant="body2" sx={{ color: '#666', textAlign: 'center', py: 4 }}>
                    No messages yet. Start the conversation!
                  </Typography>
                </Box>
                <Box sx={{ p: 2, borderTop: '1px solid rgba(0,0,0,0.1)' }}>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '12px',
                        },
                      }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<SendIcon />}
                      sx={{
                        bgcolor: '#C39766',
                        '&:hover': { bgcolor: '#A67A52' },
                        borderRadius: '12px',
                      }}
                    >
                      Send
                    </Button>
                  </Box>
                </Box>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                <Typography variant="body2" sx={{ color: '#666' }}>
                  Select a conversation to start messaging
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </TrainerLayout>
  );
};

export default TrainerMessages;



