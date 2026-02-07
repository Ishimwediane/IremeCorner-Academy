import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    TextField,
    IconButton,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    ListItemButton,
    InputAdornment,
    Badge,
    CircularProgress,
    Chip,
} from '@mui/material';
import {
    Send,
    Search,
    MoreVert,
    School,
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { format, isToday, isYesterday } from 'date-fns';
import io from 'socket.io-client';

const SOCKET_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const Messages = () => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [searchParams] = useSearchParams();
    const trainerId = searchParams.get('trainer');

    const [selectedConversation, setSelectedConversation] = useState(null);
    const [messageText, setMessageText] = useState('');
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState(new Set());
    const messagesEndRef = useRef(null);
    const selectedConversationRef = useRef(selectedConversation);

    // Keep ref in sync with state
    useEffect(() => {
        selectedConversationRef.current = selectedConversation;
    }, [selectedConversation]);

    // Initialize Socket.IO
    useEffect(() => {
        const newSocket = io(SOCKET_URL, {
            transports: ['websocket'],
        });

        newSocket.on('connect', () => {
            console.log('Connected to socket');
            newSocket.emit('join', user._id);
        });

        newSocket.on('receive-message', (message) => {
            console.log('Received message:', message);
            // Immediately update the messages if we're viewing this conversation
            const currentConversation = selectedConversationRef.current;
            if (currentConversation && message.sender._id === currentConversation.partner._id) {
                queryClient.setQueryData(['messages', currentConversation.partner._id], (oldData) => {
                    return oldData ? [...oldData, message] : [message];
                });
            }
            // Also invalidate to ensure consistency
            queryClient.invalidateQueries(['conversations']);
        });

        newSocket.on('user-online', (userId) => {
            setOnlineUsers(prev => new Set([...prev, userId]));
        });

        newSocket.on('user-offline', (userId) => {
            setOnlineUsers(prev => {
                const newSet = new Set(prev);
                newSet.delete(userId);
                return newSet;
            });
        });

        setSocket(newSocket);

        return () => newSocket.close();
    }, [user._id, queryClient]);

    // Fetch conversations
    const { data: conversationsData, isLoading: conversationsLoading } = useQuery(
        ['conversations'],
        async () => {
            const res = await api.get('/messages/conversations');
            return res.data.data;
        }
    );

    // Fetch trainer info if trainerId is provided
    const { data: trainerData } = useQuery(
        ['trainer', trainerId],
        async () => {
            const res = await api.get(`/users/${trainerId}`);
            return res.data.data;
        },
        {
            enabled: !!trainerId,
        }
    );

    // Auto-select conversation when trainer is specified
    useEffect(() => {
        if (trainerId && trainerData && !selectedConversation) {
            // Check if conversation exists
            const existingConversation = conversationsData?.find(
                c => c.partner._id === trainerId
            );

            if (existingConversation) {
                setSelectedConversation(existingConversation);
            } else {
                // Create a new conversation object
                setSelectedConversation({
                    partner: trainerData,
                    lastMessage: null,
                    unreadCount: 0,
                });
            }
        }
    }, [trainerId, trainerData, conversationsData, selectedConversation]);

    // Fetch messages with selected user
    const { data: messagesData, isLoading: messagesLoading } = useQuery(
        ['messages', selectedConversation?.partner._id],
        async () => {
            const res = await api.get(`/messages/conversation/${selectedConversation.partner._id}`);
            return res.data.data;
        },
        {
            enabled: !!selectedConversation,
        }
    );

    // Send message mutation
    const sendMessageMutation = useMutation(
        (data) => api.post('/messages/send', data),
        {
            onSuccess: (response) => {
                setMessageText('');
                queryClient.invalidateQueries(['messages']);
                queryClient.invalidateQueries(['conversations']);

                // Emit socket event
                if (socket) {
                    socket.emit('send-message', {
                        receiverId: selectedConversation.partner._id,
                        message: response.data.data,
                    });
                }
            },
        }
    );

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messagesData]);

    const handleSendMessage = () => {
        if (!messageText.trim() || !selectedConversation) return;

        sendMessageMutation.mutate({
            receiverId: selectedConversation.partner._id,
            content: messageText,
        });
    };

    const formatMessageTime = (date) => {
        const messageDate = new Date(date);
        if (isToday(messageDate)) {
            return format(messageDate, 'HH:mm');
        } else if (isYesterday(messageDate)) {
            return 'Yesterday';
        } else {
            return format(messageDate, 'MMM dd');
        }
    };

    const conversations = conversationsData || [];
    const messages = messagesData || [];

    return (
        <Box sx={{ height: 'calc(100vh - 100px)', display: 'flex', gap: 2, p: 3 }}>
            {/* Conversations List */}
            <Paper sx={{ width: 350, display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#202F32', mb: 2 }}>
                        Messages
                    </Typography>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Search conversations..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <Search sx={{ color: '#666' }} />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 3,
                            },
                        }}
                    />
                </Box>

                <List sx={{ flex: 1, overflow: 'auto', p: 0 }}>
                    {conversationsLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress size={30} sx={{ color: '#FD7E14' }} />
                        </Box>
                    ) : conversations.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                No conversations yet
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Click "Message Trainer" from any course to start chatting
                            </Typography>
                        </Box>
                    ) : (
                        conversations.map((conversation) => {
                            const isOnline = onlineUsers.has(conversation.partner._id);
                            const isTrainer = conversation.partner.role === 'trainer';

                            return (
                                <ListItemButton
                                    key={conversation.partner._id}
                                    selected={selectedConversation?.partner._id === conversation.partner._id}
                                    onClick={() => setSelectedConversation(conversation)}
                                    sx={{
                                        borderBottom: 1,
                                        borderColor: 'divider',
                                        '&.Mui-selected': {
                                            bgcolor: 'rgba(253, 126, 20, 0.1)',
                                            borderLeft: '4px solid #FD7E14',
                                        },
                                    }}
                                >
                                    <ListItemAvatar>
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            variant="dot"
                                            sx={{
                                                '& .MuiBadge-badge': {
                                                    bgcolor: isOnline ? '#4caf50' : 'transparent',
                                                    width: 12,
                                                    height: 12,
                                                    borderRadius: '50%',
                                                    border: '2px solid white',
                                                },
                                            }}
                                        >
                                            <Avatar sx={{ bgcolor: isTrainer ? '#FD7E14' : '#202F32' }}>
                                                {conversation.partner.name?.charAt(0).toUpperCase()}
                                            </Avatar>
                                        </Badge>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {conversation.partner.name}
                                                </Typography>
                                                {isTrainer && (
                                                    <School sx={{ fontSize: 16, color: '#FD7E14' }} />
                                                )}
                                            </Box>
                                        }
                                        secondary={
                                            <Typography variant="caption" color="text.secondary" noWrap>
                                                {conversation.lastMessage?.content || 'Start a conversation'}
                                            </Typography>
                                        }
                                    />
                                    {conversation.unreadCount > 0 && (
                                        <Badge badgeContent={conversation.unreadCount} color="error" />
                                    )}
                                </ListItemButton>
                            );
                        })
                    )}
                </List>
            </Paper>

            {/* Chat Area */}
            <Paper sx={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 2 }}>
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar sx={{ bgcolor: selectedConversation.partner.role === 'trainer' ? '#FD7E14' : '#202F32' }}>
                                    {selectedConversation.partner.name?.charAt(0).toUpperCase()}
                                </Avatar>
                                <Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                            {selectedConversation.partner.name}
                                        </Typography>
                                        {selectedConversation.partner.role === 'trainer' && (
                                            <Chip
                                                label="Trainer"
                                                size="small"
                                                icon={<School />}
                                                sx={{
                                                    bgcolor: 'rgba(253, 126, 20, 0.1)',
                                                    color: '#FD7E14',
                                                    height: 20,
                                                    fontSize: '0.7rem'
                                                }}
                                            />
                                        )}
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">
                                        {selectedConversation.partner.email}
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton>
                                <MoreVert />
                            </IconButton>
                        </Box>

                        {/* Messages */}
                        <Box sx={{ flex: 1, overflow: 'auto', p: 2, bgcolor: '#faf8f5' }}>
                            {messagesLoading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                    <CircularProgress size={30} sx={{ color: '#FD7E14' }} />
                                </Box>
                            ) : messages.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 8 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No messages yet. Start the conversation!
                                    </Typography>
                                </Box>
                            ) : (
                                <>
                                    {messages.map((message) => {
                                        const isOwnMessage = message.sender._id === user._id;
                                        return (
                                            <Box
                                                key={message._id}
                                                sx={{
                                                    display: 'flex',
                                                    justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
                                                    mb: 2,
                                                }}
                                            >
                                                <Box
                                                    sx={{
                                                        maxWidth: '70%',
                                                        bgcolor: isOwnMessage ? '#FD7E14' : 'white',
                                                        color: isOwnMessage ? 'white' : '#202F32',
                                                        p: 1.5,
                                                        borderRadius: 2,
                                                        boxShadow: 1,
                                                    }}
                                                >
                                                    <Typography variant="body2">{message.content}</Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{
                                                            display: 'block',
                                                            mt: 0.5,
                                                            opacity: 0.7,
                                                            textAlign: 'right',
                                                        }}
                                                    >
                                                        {formatMessageTime(message.createdAt)}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </>
                            )}
                        </Box>

                        {/* Message Input */}
                        <Box sx={{ p: 2, pb: 3, borderTop: 1, borderColor: 'divider' }}>
                            <TextField
                                fullWidth
                                placeholder="Type a message..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                multiline
                                maxRows={4}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        bgcolor: 'white',
                                        pr: 0.5,
                                    },
                                }}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={handleSendMessage}
                                                disabled={!messageText.trim() || sendMessageMutation.isLoading}
                                                sx={{
                                                    bgcolor: '#FD7E14',
                                                    color: 'white',
                                                    width: 40,
                                                    height: 40,
                                                    '&:hover': { bgcolor: '#E56D0F' },
                                                    '&:disabled': { bgcolor: '#ddd', color: '#999' },
                                                }}
                                            >
                                                <Send sx={{ fontSize: 20 }} />
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                    </>
                ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', flexDirection: 'column', gap: 2 }}>
                        <Typography variant="h6" color="text.secondary">
                            Select a conversation to start messaging
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Or click "Message Trainer" from any course
                        </Typography>
                    </Box>
                )}
            </Paper>
        </Box>
    );
};

export default Messages;
