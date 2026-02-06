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
        borderRadius: '10px',
        bgcolor: 'white',
        border: '1px solid',
        borderColor: 'rgba(0,0,0,0.08)',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
        textDecoration: 'none',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: '0 6px 16px rgba(253, 126, 20, 0.12)',
          borderColor: '#FD7E14',
        },
      }}
    >
      <CardContent sx={{ p: 1.5, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="caption" sx={{ color: '#FD7E14', fontSize: '0.7rem', fontWeight: 600 }}>
            {enrolledDate}
          </Typography>
          <IconButton
            size="small"
            sx={{
              color: '#666',
              opacity: 0.6,
              padding: '2px',
              '&:hover': { opacity: 1, bgcolor: 'rgba(253, 126, 20, 0.08)' },
            }}
          >
            <MoreVert fontSize="small" sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            mb: 1.5,
            fontSize: '0.875rem',
            lineHeight: 1.3,
            minHeight: 36,
            color: '#1A1A1A',
          }}
        >
          {courseTitle.length > 40 ? `${courseTitle.substring(0, 40)}...` : courseTitle}
        </Typography>

        {/* Progress Bar */}
        <Box sx={{ mb: 0 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
            <Typography variant="caption" sx={{ color: '#666', fontSize: '0.7rem' }}>
              Progress
            </Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: '#FD7E14', fontSize: '0.75rem' }}>
              {progress}%
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 5,
              borderRadius: 2.5,
              bgcolor: 'rgba(253, 126, 20, 0.1)',
              '& .MuiLinearProgress-bar': {
                bgcolor: '#FD7E14',
                borderRadius: 2.5,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};

export default CourseProgressCard;