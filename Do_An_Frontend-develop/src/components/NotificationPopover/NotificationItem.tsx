/* eslint-disable no-console */
import { Box, Typography, IconButton } from '@mui/material';
import { X, Bell, Calendar, CreditCard, FileText } from 'lucide-react';
import { INotification, EUserRole } from '@src/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import ApiNotification from '@src/api/ApiNotification';
import QUERY_KEY from '@src/api/QueryKey';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IRootState } from '@src/redux/store';
import { formatDateTimeFromIso } from '@src/utils/datetime';

interface NotificationItemProps {
  notification: INotification;
  onClose?: () => void;
}

// Format relative time (2 phút trước, 1 giờ trước...)
const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) return 'Vừa xong';
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} phút trước`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} ngày trước`;
  return formatDateTimeFromIso(dateString);
};

// Get icon based on notification title/content
const getNotificationIcon = (notification: INotification) => {
  const title = notification.title?.toLowerCase() || '';
  const content = notification.content?.toLowerCase() || '';

  if (
    title.includes('lịch') ||
    content.includes('lịch hẹn') ||
    content.includes('appointment')
  ) {
    return <Calendar size={20} className="text-blue-500" />;
  }
  if (
    title.includes('thanh toán') ||
    content.includes('payment') ||
    content.includes('hóa đơn')
  ) {
    return <CreditCard size={20} className="text-green-500" />;
  }
  if (title.includes('hồ sơ') || content.includes('kết quả')) {
    return <FileText size={20} className="text-purple-500" />;
  }
  return <Bell size={20} className="text-gray-500" />;
};

const getNavigationPath = (
  notification: INotification,
  userRole?: string
): string | null => {
  switch (notification.type) {
    case 'contact':
      return '/admin/contacts';
    case 'contact_reply':
      return '/patient/feedback';
    // Appointment notification types - route based on user role
    case 'appointment':
    case 'appointment_new':
    case 'appointment_confirmed':
    case 'appointment_patient_cancelled':
    case 'appointment_doctor_cancelled':
    case 'appointment_reminder':
      if (userRole === EUserRole.DOCTOR) {
        return '/doctor/appointments';
      }
      return '/patient/appointments';
    default:
      return null;
  }
};

export default function NotificationItem({
  notification,
  onClose,
}: NotificationItemProps) {
  const navigate = useNavigate();
  const userRole = useSelector(
    (state: IRootState) => state.auth.user?.role?.name
  );

  const queryClient = useQueryClient();
  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: () => ApiNotification.markAsRead(notification.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.NOTIFICATION.GET_NOTIFICATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.NOTIFICATION.GET_UNREAD_COUNT],
      });
    },
  });
  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: () => ApiNotification.deleteNotification(notification.id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.NOTIFICATION.GET_NOTIFICATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.NOTIFICATION.GET_UNREAD_COUNT],
      });
    },
  });
  const handleClick = () => {
    if (!notification.isRead) {
      markAsReadMutation.mutate();
    }

    const path = getNavigationPath(notification, userRole);
    if (path) {
      console.log(path);
      navigate(path);
    }

    onClose?.();
  };
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteMutation.mutate();
  };
  return (
    <Box
      onClick={handleClick}
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 1.5,
        p: 2,
        cursor: 'pointer',
        backgroundColor: notification.isRead
          ? 'transparent'
          : 'rgba(59, 130, 246, 0.05)',
        transition: 'background-color 0.2s ease',
        '&:hover': {
          backgroundColor: notification.isRead
            ? 'rgba(0, 0, 0, 0.04)'
            : 'rgba(59, 130, 246, 0.1)',
        },
        position: 'relative',
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          backgroundColor: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {getNotificationIcon(notification)}
      </Box>
      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {notification.title && (
          <Typography
            variant="body2"
            fontWeight={notification.isRead ? 400 : 600}
            sx={{
              color: 'text.primary',
              mb: 0.5,
              lineHeight: 1.4,
            }}
          >
            {notification.title}
          </Typography>
        )}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.5,
          }}
        >
          {notification.content}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'text.disabled',
            display: 'block',
            mt: 0.5,
          }}
        >
          {formatRelativeTime(notification.createdAt)}
        </Typography>
      </Box>
      {/* Unread indicator */}
      {!notification.isRead && (
        <Box
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            flexShrink: 0,
            mt: 0.5,
          }}
        />
      )}
      {/* Delete button */}
      <IconButton
        size="small"
        onClick={handleDelete}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          opacity: 0,
          transition: 'opacity 0.2s',
          '.MuiBox-root:hover &': {
            opacity: 1,
          },
        }}
      >
        <X size={16} />
      </IconButton>
    </Box>
  );
}
