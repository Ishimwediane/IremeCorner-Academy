import React, { useState, useRef, useEffect } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Avatar,
    List,
    ListItem,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    Chip,
    IconButton,
} from '@mui/material';
import {
    Send as SendIcon,
    SmartToy,
    Psychology,
    School,
    Work,
    Lightbulb,
} from '@mui/icons-material';
import { useMutation } from 'react-query';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';

const LearnerCareerGuidance = () => {
    const { user } = useAuth();
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            content: `Hello ${user?.name || 'there'}! I'm Nuru, your AI Career Guide. I can help you explore career paths, review your skills, or suggest courses to reach your goals. What's on your mind today?`,
        },
    ]);
    const messagesEndRef = useRef(null);

    const suggestedQuestions = [
        "How do I become a Software Engineer?",
        "What skills are needed for Data Science?",
        "Review my current learning path",
        "Tips for my first tech interview",
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const chatMutation = useMutation(
        async (msg) => {
            // Using the same endpoint as AIAssistant for now, but context could be added if backend supports it
            const response = await api.post('/ai-assistant/chat', { message: msg, context: 'career_guidance' });
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
                toast.error('Failed to get response from Nuru');
                setMessages((prev) => [
                    ...prev,
                    { type: 'bot', content: "I'm having a little trouble connecting right now. Please try again in a moment." },
                ]);
            },
        }
    );

    const handleSend = async (e) => {
        e.preventDefault();
        if (!message.trim() || chatMutation.isLoading) return;

        const userMessage = message;
        setMessages((prev) => [...prev, { type: 'user', content: userMessage }]);
        setMessage('');
        chatMutation.mutate(userMessage);
    };

    const handleSuggestionClick = (question) => {
        setMessages((prev) => [...prev, { type: 'user', content: question }]);
        chatMutation.mutate(question);
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" sx={{ mb: 1, fontWeight: 700, color: '#202F32' }}>
                Career Guidance with AI Nuru
            </Typography>
            <Typography variant="body1" sx={{ mb: 4, color: '#666' }}>
                Get personalized career advice and learning recommendations powered by AI.
            </Typography>

            <Grid container spacing={3}>
                {/* Chat Area */}
                <Grid item xs={12} md={8}>
                    <Paper
                        sx={{
                            height: '70vh',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                        }}
                    >
                        {/* Chat Header */}
                        <Box
                            sx={{
                                p: 2,
                                bgcolor: '#FD7E14',
                                color: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            <Avatar sx={{ bgcolor: 'white', color: '#FD7E14' }}>
                                <Psychology />
                            </Avatar>
                            <Box>
                                <Typography variant="subtitle1" fontWeight="700">
                                    Nuru Career Assistant
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.9 }}>
                                    Online
                                </Typography>
                            </Box>
                        </Box>

                        {/* Messages List */}
                        <Box
                            sx={{
                                flex: 1,
                                overflowY: 'auto',
                                p: 3,
                                bgcolor: '#F9FAFB',
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
                                        gap: 1.5,
                                    }}
                                >
                                    {msg.type === 'bot' && (
                                        <Avatar sx={{ bgcolor: '#FD7E14', width: 32, height: 32 }}>
                                            <SmartToy sx={{ fontSize: 18 }} />
                                        </Avatar>
                                    )}
                                    <Paper
                                        elevation={0}
                                        sx={{
                                            p: 2,
                                            maxWidth: '80%',
                                            bgcolor: msg.type === 'user' ? '#202F32' : 'white',
                                            color: msg.type === 'user' ? 'white' : '#202F32',
                                            borderRadius: msg.type === 'user'
                                                ? '20px 20px 4px 20px'
                                                : '20px 20px 20px 4px',
                                            boxShadow: msg.type === 'user' ? 'none' : '0 2px 5px rgba(0,0,0,0.05)',
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                                            {msg.content}
                                        </Typography>
                                    </Paper>
                                    {msg.type === 'user' && (
                                        <Avatar sx={{ bgcolor: '#202F32', width: 32, height: 32 }}>
                                            {user?.name?.charAt(0) || 'U'}
                                        </Avatar>
                                    )}
                                </Box>
                            ))}
                            {chatMutation.isLoading && (
                                <Box sx={{ display: 'flex', gap: 1.5 }}>
                                    <Avatar sx={{ bgcolor: '#FD7E14', width: 32, height: 32 }}>
                                        <SmartToy sx={{ fontSize: 18 }} />
                                    </Avatar>
                                    <Paper sx={{ p: 2, borderRadius: '20px', bgcolor: 'white' }}>
                                        <CircularProgress size={20} sx={{ color: '#FD7E14' }} />
                                    </Paper>
                                </Box>
                            )}
                            <div ref={messagesEndRef} />
                        </Box>

                        {/* Input Area */}
                        <Box
                            component="form"
                            onSubmit={handleSend}
                            sx={{
                                p: 2,
                                bgcolor: 'white',
                                borderTop: '1px solid #E5E7EB',
                                display: 'flex',
                                gap: 1,
                            }}
                        >
                            <TextField
                                fullWidth
                                placeholder="Ask about your career path..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                variant="outlined"
                                size="small"
                                disabled={chatMutation.isLoading}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: '25px',
                                        bgcolor: '#F3F4F6',
                                        '& fieldset': { border: 'none' },
                                    },
                                }}
                            />
                            <IconButton
                                type="submit"
                                disabled={!message.trim() || chatMutation.isLoading}
                                sx={{
                                    bgcolor: '#FD7E14',
                                    color: 'white',
                                    width: 40,
                                    height: 40,
                                    '&:hover': { bgcolor: '#E56D0F' },
                                    '&:disabled': { bgcolor: '#E5E7EB' },
                                }}
                            >
                                <SendIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Paper>
                </Grid>

                {/* Sidebar Info */}
                <Grid item xs={12} md={4}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {/* Suggested Questions */}
                        <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Lightbulb sx={{ color: '#FD7E14' }} />
                                    <Typography variant="h6" fontWeight="700">
                                        Suggested Topics
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {suggestedQuestions.map((q, idx) => (
                                        <Button
                                            key={idx}
                                            variant="outlined"
                                            onClick={() => handleSuggestionClick(q)}
                                            sx={{
                                                justifyContent: 'flex-start',
                                                textAlign: 'left',
                                                borderColor: '#E5E7EB',
                                                color: '#666',
                                                borderRadius: '10px',
                                                textTransform: 'none',
                                                '&:hover': {
                                                    borderColor: '#FD7E14',
                                                    bgcolor: 'rgba(253, 126, 20, 0.05)',
                                                    color: '#FD7E14',
                                                },
                                            }}
                                        >
                                            {q}
                                        </Button>
                                    ))}
                                </Box>
                            </CardContent>
                        </Card>

                        {/* Quick Stats or Info */}
                        <Card sx={{ borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                    <Work sx={{ color: '#202F32' }} />
                                    <Typography variant="h6" fontWeight="700">
                                        Your Profile
                                    </Typography>
                                </Box>
                                <List dense>
                                    <ListItem>
                                        <Typography variant="body2" color="text.secondary">
                                            Current Role: <strong>Student</strong>
                                        </Typography>
                                    </ListItem>
                                    <ListItem>
                                        <Typography variant="body2" color="text.secondary">
                                            Interests: <strong>Web Development, Design</strong>
                                        </Typography>
                                    </ListItem>
                                </List>
                                <Button
                                    fullWidth
                                    variant="text"
                                    sx={{ color: '#FD7E14', mt: 1 }}
                                >
                                    Update Profile
                                </Button>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LearnerCareerGuidance;
