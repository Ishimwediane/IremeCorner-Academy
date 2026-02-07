import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  TrendingUp as TrendingUpIcon,
  AccountBalance as WalletIcon,
} from '@mui/icons-material';
import { useQuery } from 'react-query';
import { useMemo } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import TrainerLayout from '../../components/TrainerLayout';
import { format } from 'date-fns';

const TrainerEarnings = () => {
  const { user } = useAuth();

  const { data: coursesData } = useQuery(
    ['trainer-courses', user?._id || user?.id],
    async () => {
      const userId = user?._id || user?.id;
      const response = await api.get(`/courses?trainer=${userId}`);
      return response.data;
    },
    { enabled: !!(user?._id || user?.id) }
  );

  const courses = coursesData?.data || [];

  // Calculate earnings
  const earnings = useMemo(() => {
    let totalEarnings = 0;
    let totalStudents = 0;
    const transactions = [];

    courses.forEach((course) => {
      if (!course.isFree && course.price) {
        const enrolledCount = course.enrolledStudents?.length || 0;
        const courseEarnings = course.price * enrolledCount;
        totalEarnings += courseEarnings;
        totalStudents += enrolledCount;

        if (enrolledCount > 0) {
          transactions.push({
            id: course._id,
            course: course.title,
            students: enrolledCount,
            amount: courseEarnings,
            date: course.createdAt,
          });
        }
      }
    });

    return {
      totalEarnings,
      totalStudents,
      transactions,
      monthlyEarnings: totalEarnings * 0.3, // Mock monthly
    };
  }, [courses]);

  return (
    <TrainerLayout title="Earnings">
      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ borderRadius: 0 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Total Earnings
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#202F32' }}>
                    ${earnings.totalEarnings.toLocaleString()}
                  </Typography>
                </Box>
                <MoneyIcon sx={{ fontSize: 40, color: '#C39766', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    This Month
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#202F32' }}>
                    ${earnings.monthlyEarnings.toLocaleString()}
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: '#4caf50', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Paid Students
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#202F32' }}>
                    {earnings.totalStudents}
                  </Typography>
                </Box>
                <WalletIcon sx={{ fontSize: 40, color: '#2196f3', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="body2" sx={{ color: '#666', mb: 1 }}>
                    Available Balance
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: '#202F32' }}>
                    ${(earnings.totalEarnings * 0.8).toLocaleString()}
                  </Typography>
                </Box>
                <WalletIcon sx={{ fontSize: 40, color: '#9c27b0', opacity: 0.3 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Transactions Table */}
      <Paper sx={{ borderRadius: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Box sx={{ p: 3, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#202F32' }}>
            Transaction History
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f7fa' }}>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Course</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Students</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#202F32' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {earnings.transactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      No transactions yet.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                earnings.transactions.map((transaction) => (
                  <TableRow key={transaction.id} hover>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: '#202F32' }}>
                        {transaction.course}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {transaction.students} student(s)
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 600, color: '#4caf50' }}>
                        ${transaction.amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ color: '#666' }}>
                        {format(new Date(transaction.date), 'MMM dd, yyyy')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip label="Completed" size="small" color="success" />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </TrainerLayout>
  );
};

export default TrainerEarnings;

