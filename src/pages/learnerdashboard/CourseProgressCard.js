import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Avatar,
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
        bgcolor: colorScheme.bg,
        color: colorScheme.text,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        textDecoration: 'none',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardContent sx={{ p: 2, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Typography variant="caption" sx={{ opacity: 0.9, fontSize: '0.75rem' }}>
            {enrolledDate}
          </Typography>
          <IconButton
            size="small"
            sx={{
              color: colorScheme.text,
              opacity: 0.8,
              '&:hover': { opacity: 1 },
            }}
          >
            <MoreVert fontSize="small" />
          </IconButton>
        </Box>
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            mb: 1.5,
            fontSize: '0.9rem',
            lineHeight: 1.3,
            minHeight: 36,
          }}
        >
          {courseTitle.length > 40 ? `${courseTitle.substring(0, 40)}...` : courseTitle}
        </Typography>
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5, fontSize: '1.1rem' }}>
          {progress}%
        </Typography>
      </CardContent>
    </Card>
  );
};

export default CourseProgressCard;