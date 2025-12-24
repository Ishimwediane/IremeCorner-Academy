import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  LinearProgress,
} from '@mui/material';
import { MoreVert } from '@mui/icons-material';
import { format } from 'date-fns';

const CourseProgressCard = ({ enrollment, colorScheme }) => {
  const progress = enrollment.progress || 0;
  const courseTitle = enrollment.course?.title || 'Untitled Course';
  const enrolledDate = enrollment.createdAt
    ? format(new Date(enrollment.createdAt), 'MMM d')
    : 'Recent';
  const courseLink = `/learner/course/${enrollment.course?._id}`;

  return (
    <Card
      component={Link}
      to={courseLink}
      sx={{
        borderRadius: '12px',
        bgcolor: 'white',
        border: '1px solid',
        borderColor: 'rgba(0,0,0,0.08)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
        textDecoration: 'none',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 20px rgba(195,151,102,0.15)',
          borderColor: '#C39766',
        },
      }}
    >
      <CardContent sx={{ p: 2.5, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Typography variant="caption" sx={{ color: '#C39766', fontSize: '0.75rem', fontWeight: 600 }}>
            {enrolledDate}
          </Typography>
          <IconButton
            size="small"
            sx={{
              color: '#666',
              opacity: 0.6,
              '&:hover': { opacity: 1, bgcolor: 'rgba(195,151,102,0.1)' },
            }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            mb: 2,
            fontSize: '0.95rem',
            lineHeight: 1.4,
            minHeight: 40,
            color: '#202F32',
          }}
        >
          {courseTitle.length > 45 ? `${courseTitle.substring(0, 45)}...` : courseTitle}
        </Typography>

        {/* Progress Bar */}
        <Box sx={{ mb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem' }}>
              Progress
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#C39766', fontSize: '0.85rem' }}>
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 6,
              borderRadius: 3,
              bgcolor: 'rgba(195,151,102,0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#C39766',
                borderRadius: 3,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CourseProgressCard;