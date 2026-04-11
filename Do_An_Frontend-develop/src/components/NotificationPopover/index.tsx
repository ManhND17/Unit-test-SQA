import { useState, MouseEvent, useCallback, useRef, useEffect } from 'react';
import {
  Popover,
  Badge,
  IconButton,
  Box,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material';
import { Bell, CheckCheck } from 'lucide-react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from '@tanstack/react-query';
import QUERY_KEY from '@src/api/QueryKey';
import ApiNotification from '@src/api/ApiNotification';
import NotificationItem from './NotificationItem';
import { INotification } from '@src/types';
import { useNotificationSocket } from '@src/hooks/useSocket';
import { toast } from 'react-toastify';

export default function NotificationPopover() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const queryClient = useQueryClient();
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'notification-popover' : undefined;

  // Fetch notifications
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: [QUERY_KEY.NOTIFICATION.GET_NOTIFICATIONS],
      queryFn: ({ pageParam = 1 }) =>
        ApiNotification.getNotifications({ page: pageParam, limit: 20 }),
      getNextPageParam: (lastPage) => {
        const { metadata } = lastPage;
        return metadata?.hasNext ? (metadata.page || 0) + 1 : undefined;
      },
      initialPageParam: 1,
    });

  // Fetch unread count
  const { data: unreadData } = useQuery({
    queryKey: [QUERY_KEY.NOTIFICATION.GET_UNREAD_COUNT],
    queryFn: () => ApiNotification.getUnreadCount(),
  });

  // Mark all as read mutation
  const markAllAsReadMutation = useMutation({
    mutationFn: () => ApiNotification.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.NOTIFICATION.GET_NOTIFICATIONS],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.NOTIFICATION.GET_UNREAD_COUNT],
      });
    },
  });
  const notifications: INotification[] =
    data?.pages.flatMap((page) => page.data) ?? [];
  const unreadCount = unreadData?.unreadCount ?? 0;

  // Ref cho infinite scroll trigger
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Setup IntersectionObserver cho infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useNotificationSocket(
    useCallback(
      (notificationData: { title?: string; content?: string }) => {
        // Invalidate queries để cập nhật danh sách thông báo
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.NOTIFICATION.GET_NOTIFICATIONS],
        });
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEY.NOTIFICATION.GET_UNREAD_COUNT],
        });

        // Hiển thị toast notification
        const title = notificationData?.title || 'Thông báo mới';
        const content = notificationData?.content || '';

        toast.info(
          <div>
            <strong>{title}</strong>
            {content && <p className="text-sm mt-1">{content}</p>}
          </div>,
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );
      },
      [queryClient]
    )
  );

  return (
    <>
      <IconButton
        aria-describedby={id}
        onClick={handleClick}
        className="relative"
        sx={{ color: 'inherit' }}
      >
        <Badge
          badgeContent={unreadCount}
          color="error"
          max={99}
          sx={{
            '& .MuiBadge-badge': {
              fontSize: '0.65rem',
              minWidth: '18px',
              height: '18px',
            },
          }}
        >
          <Bell size={22} />
        </Badge>
      </IconButton>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              width: { xs: '100vw', sm: 380 },
              maxWidth: { sm: 380 },
              maxHeight: 480,
              mt: 1,
              borderRadius: 2,
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            },
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #e5e7eb',
          }}
        >
          <Typography variant="h6" fontWeight={600}>
            Thông báo
          </Typography>
          {unreadCount > 0 && (
            <Button
              size="small"
              startIcon={<CheckCheck size={16} />}
              onClick={() => markAllAsReadMutation.mutate()}
              disabled={markAllAsReadMutation.isPending}
              sx={{ textTransform: 'none' }}
            >
              Đánh dấu tất cả đã đọc
            </Button>
          )}
        </Box>
        {/* Content */}
        <Box sx={{ maxHeight: 380, overflowY: 'auto' }}>
          {isLoading ? (
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                py: 6,
              }}
            >
              <CircularProgress size={32} />
            </Box>
          ) : notifications.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 6,
                color: 'text.secondary',
              }}
            >
              <Bell size={48} strokeWidth={1.5} />
              <Typography sx={{ mt: 2 }}>Không có thông báo nào</Typography>
            </Box>
          ) : (
            <>
              {notifications.map((notification, index) => (
                <Box key={notification.id}>
                  <NotificationItem
                    notification={notification}
                    onClose={handleClose}
                  />
                  {index < notifications.length - 1 && <Divider />}
                </Box>
              ))}
              {/* Infinite scroll trigger */}
              <div ref={loadMoreRef} style={{ height: '1px' }} />
              {/* Loading indicator khi đang load thêm */}
              {isFetchingNextPage && (
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    py: 2,
                  }}
                >
                  <CircularProgress size={24} />
                </Box>
              )}
            </>
          )}
        </Box>
      </Popover>
    </>
  );
}
