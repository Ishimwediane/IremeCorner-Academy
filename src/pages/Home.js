import React from 'react';
import { Box } from '@mui/material';
import { useQuery } from 'react-query';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Hero from '../components/Hero';
import AllCoursesSection from '../components/AllCoursesSection';

const Home = () => {
  const { user } = useAuth();

  const { data: coursesData } = useQuery(
    'featured-courses',
    async () => {
      const response = await api.get('/courses?status=approved&limit=6');
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const courses = coursesData?.data || [];
  const totalApprovedCourses = coursesData?.count || courses.length || 0;

  return (
    <Box>
      <Hero user={user} totalCourses={totalApprovedCourses} />
      {/* All Courses Section */}
      <AllCoursesSection />
    </Box>
  );
};

export default Home;



