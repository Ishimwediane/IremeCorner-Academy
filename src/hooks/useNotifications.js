import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export const useNotifications = () => {
  const { user } = useAuth();
  
  const { data: notificationsData } = useQuery(
    'notifications',
    async () => {
      const response = await api.get('/notifications');
      return response.data;
    },
    {
      enabled: !!user, // Only fetch if user is logged in
      refetchOnWindowFocus: false,
      retry: false,
      staleTime: 1 * 60 * 1000, // 1 minute
    }
  );

  const unreadCount = notificationsData?.data?.filter(n => !n.isRead).length || 0;

  return {
    notifications: notificationsData?.data || [],
    unreadCount,
    isLoading: !notificationsData,
  };
};

export const useMarkNotificationRead = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async (id) => {
      const response = await api.put(`/notifications/${id}/read`);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications');
      },
    }
  );
};





