import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Avatar,
    AvatarGroup,
    Button,
    Chip,
    Tab,
    Tabs,
    Card,
    CardContent,
    IconButton,
} from '@mui/material';
import { Add, MoreVert, People, Lock, Public } from '@mui/icons-material';

const LearnerGroups = () => {
    const [activeTab, setActiveTab] = useState(0);

    // Mock data - replace with actual API calls
    const myGroups = [
        {
            id: 1,
            name: 'Web Development Study Group',
            description: 'Learning modern web technologies together',
            members: 24,
            type: 'public',
            avatar: null,
        },
        {
            id: 2,
            name: 'Data Science Enthusiasts',
            description: 'Exploring data science and machine learning',
            members: 18,
            type: 'private',
            avatar: null,
        },
        {
            id: 3,
            name: 'UI/UX Design Community',
            description: 'Sharing design tips and feedback',
            members: 32,
            type: 'public',
            avatar: null,
        },
    ];

    const suggestedGroups = [
        {
            id: 4,
            name: 'Python Programming',
            description: 'Learn Python from basics to advanced',
            members: 156,
            type: 'public',
            avatar: null,
        },
        {
            id: 5,
            name: 'Mobile App Development',
            description: 'iOS and Android development',
            members: 89,
            type: 'public',
            avatar: null,
        },
    ];

    const GroupCard = ({ group, showJoinButton = false }) => (
        <Card elevation={0} sx={{ border: '1px solid rgba(32,47,50,0.1)', borderRadius: 0 }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Avatar
                            sx={{
                                width: 56,
                                height: 56,
                                bgcolor: '#202F32',
                                borderRadius: 0,
                            }}
                        >
                            <People />
                        </Avatar>
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem', color: '#202F32', mb: 0.5 }}>
                                {group.name}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                                <Chip
                                    icon={group.type === 'public' ? <Public sx={{ fontSize: 14 }} /> : <Lock sx={{ fontSize: 14 }} />}
                                    label={group.type}
                                    size="small"
                                    sx={{
                                        height: 20,
                                        fontSize: '0.7rem',
                                        textTransform: 'capitalize',
                                        bgcolor: 'rgba(32,47,50,0.08)',
                                        '& .MuiChip-icon': { ml: 0.5 },
                                    }}
                                />
                                <Typography variant="caption" sx={{ color: 'rgba(32,47,50,0.6)' }}>
                                    {group.members} members
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                    {!showJoinButton && (
                        <IconButton size="small">
                            <MoreVert fontSize="small" />
                        </IconButton>
                    )}
                </Box>

                <Typography variant="body2" sx={{ color: 'rgba(32,47,50,0.7)', mb: 2 }}>
                    {group.description}
                </Typography>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: '0.75rem' } }}>
                        <Avatar>A</Avatar>
                        <Avatar>B</Avatar>
                        <Avatar>C</Avatar>
                        <Avatar>D</Avatar>
                    </AvatarGroup>

                    {showJoinButton ? (
                        <Button
                            variant="contained"
                            size="small"
                            sx={{
                                bgcolor: '#202F32',
                                color: '#fff',
                                borderRadius: 0,
                                textTransform: 'none',
                                '&:hover': { bgcolor: '#1a2628' },
                            }}
                        >
                            Join Group
                        </Button>
                    ) : (
                        <Button
                            variant="outlined"
                            size="small"
                            sx={{
                                borderColor: 'rgba(32,47,50,0.3)',
                                color: '#202F32',
                                borderRadius: 0,
                                textTransform: 'none',
                                '&:hover': {
                                    borderColor: '#202F32',
                                    bgcolor: 'rgba(32,47,50,0.05)',
                                },
                            }}
                        >
                            View Group
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    );

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#202F32', mb: 1 }}>
                        Groups
                    </Typography>
                    <Typography sx={{ color: 'rgba(32,47,50,0.7)' }}>
                        Connect with other learners and collaborate
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    sx={{
                        bgcolor: '#202F32',
                        color: '#fff',
                        borderRadius: 0,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#1a2628' },
                    }}
                >
                    Create Group
                </Button>
            </Box>

            {/* Tabs */}
            <Paper elevation={0} sx={{ mb: 3, border: '1px solid rgba(32,47,50,0.1)', borderRadius: 0 }}>
                <Tabs
                    value={activeTab}
                    onChange={(e, val) => setActiveTab(val)}
                    sx={{
                        borderBottom: '1px solid rgba(32,47,50,0.1)',
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.95rem',
                            color: 'rgba(32,47,50,0.6)',
                            '&.Mui-selected': {
                                color: '#202F32',
                                fontWeight: 600,
                            },
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#202F32',
                            height: 3,
                        },
                    }}
                >
                    <Tab label={`My Groups (${myGroups.length})`} />
                    <Tab label="Discover" />
                </Tabs>
            </Paper>

            {/* Content */}
            {activeTab === 0 ? (
                <Grid container spacing={3}>
                    {myGroups.length === 0 ? (
                        <Grid item xs={12}>
                            <Box sx={{ textAlign: 'center', py: 8 }}>
                                <People sx={{ fontSize: 64, color: 'rgba(32,47,50,0.3)', mb: 2 }} />
                                <Typography variant="h6" sx={{ color: '#202F32', mb: 2 }}>
                                    You haven't joined any groups yet
                                </Typography>
                                <Typography sx={{ color: 'rgba(32,47,50,0.7)', mb: 3 }}>
                                    Join groups to connect with other learners
                                </Typography>
                                <Button
                                    variant="contained"
                                    onClick={() => setActiveTab(1)}
                                    sx={{
                                        bgcolor: '#202F32',
                                        color: '#fff',
                                        borderRadius: 0,
                                        textTransform: 'none',
                                        '&:hover': { bgcolor: '#1a2628' },
                                    }}
                                >
                                    Discover Groups
                                </Button>
                            </Box>
                        </Grid>
                    ) : (
                        myGroups.map((group) => (
                            <Grid item xs={12} md={6} lg={4} key={group.id}>
                                <GroupCard group={group} />
                            </Grid>
                        ))
                    )}
                </Grid>
            ) : (
                <Grid container spacing={3}>
                    {suggestedGroups.map((group) => (
                        <Grid item xs={12} md={6} lg={4} key={group.id}>
                            <GroupCard group={group} showJoinButton />
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default LearnerGroups;
