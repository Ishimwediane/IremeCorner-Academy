import React from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography } from '@mui/material';

const AssignmentPage = () => {
  const { assignmentId } = useParams();

  return (
    <Container>
      <Typography variant="h4">Assignment Page</Typography>
      <Typography>Assignment ID: {assignmentId}</Typography>
      {/* Assignment submission UI will be implemented here */}
    </Container>
  );
};

export default AssignmentPage;
