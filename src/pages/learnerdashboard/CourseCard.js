import React from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  CardMedia,
  Button,
  Typography,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import { TrendingUp } from '@mui/icons-material';

const CourseCard = ({ course }) => {
  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-8px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
        },
      }}
    >
      {course.thumbnail && (
        <CardMedia
          component="img"
          height="200"
          image={course.thumbnail}
          alt={course.title}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#202F32', mb: 1.5, minHeight: 56 }}>
          {course.title}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
          <Chip
            label={course.category}
            size="small"
            sx={{ bgcolor: 'rgba(195,151,102,0.1)', color: '#C39766', fontWeight: 600 }}
          />
          <Chip
            label={course.level}
            size="small"
            sx={{ bgcolor: 'rgba(46,125,50,0.1)', color: '#2E7D32', fontWeight: 600 }}
          />
        </Stack>
        <Typography
          variant="body2"
          sx={{
            color: '#202F32',
            opacity: 0.75,
            mb: 2,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {course.description}
        </Typography>
        {course.trainer && (
          <Typography variant="body2" sx={{ color: '#202F32', opacity: 0.7, mb: 1, fontSize: '0.85rem' }}>
            By {course.trainer.name}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
          <Typography variant="body2" sx={{ color: '#2E7D32', fontWeight: 600, fontSize: '0.9rem' }}>
            <TrendingUp sx={{ fontSize: 16, verticalAlign: 'middle', mr: 0.5 }} />
            {course.enrolledStudents?.length || 0} enrolled
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ p: 2, pt: 0 }}>
        <Button
          fullWidth
          variant="contained"
          component={Link}
          to={`/learner/course/${course._id}`}
          sx={{ bgcolor: '#C39766', '&:hover': { bgcolor: '#A67A52' }, fontWeight: 600, borderRadius: '8px' }}
        >
          Start Learning
        </Button>
      </CardActions>
    </Card>
  );
};

export default CourseCard;