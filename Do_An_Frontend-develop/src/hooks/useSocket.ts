import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { IRootState } from '@redux/store';
import { connectSocket, disconnectSocket, getSocket } from '@src/config/socket';

interface UseSocketOptions {
  onConnect?: () => void;
  onDisconnect?: (reason: string) => void;
}

/**
 * Hook quản lý lifecycle Socket.IO theo auth state
 * - Login  -> connect socket
 * - Logout -> disconnect socket
 */
export function useSocket(options?: UseSocketOptions) {
  const { isAuthenticated, accessToken } = useSelector(
    (state: IRootState) => state.auth
  );

  useEffect(() => {
    // User đã login
    if (isAuthenticated && accessToken) {
      const socket = connectSocket();
      if (!socket) return;

      if (options?.onConnect) {
        socket.on('connect', options.onConnect);
      }

      if (options?.onDisconnect) {
        socket.on('disconnect', options.onDisconnect);
      }

      return () => {
        if (options?.onConnect) {
          socket.off('connect', options.onConnect);
        }
        if (options?.onDisconnect) {
          socket.off('disconnect', options.onDisconnect);
        }
      };
    }

    // User logout
    disconnectSocket();
  }, [isAuthenticated, accessToken]);
}

/**
 * Hook lắng nghe notification events
 * Tự động attach listeners khi socket connected
 */
export function useNotificationSocket(
  onNewNotification: (data: any, eventType: string) => void
) {
  const { isAuthenticated } = useSelector((state: IRootState) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) return;

    const events = [
      'contact:new',
      'contact:reply',
      'appointment:new',
      'appointment:confirmed',
      'appointment:cancelled',
      'appointment:updated',
      'appointment:reminder',
    ];

    // Tạo object để lưu trữ các handler riêng biệt cho việc cleanup (socket.off)
    const handlers: Record<string, (data: any) => void> = {};

    const attachListeners = () => {
      const socket = getSocket();
      if (!socket) return false;

      events.forEach((event) => {
        // Tạo hàm wrapper: nhận data từ socket -> gọi callback của bạn kèm theo event name
        const handler = (data: any) => {
          onNewNotification(data, event);
        };

        // Lưu tham chiếu hàm để remove sau này
        handlers[event] = handler;

        socket.on(event, handler);
      });
      return true;
    };

    const detachListeners = () => {
      const socket = getSocket();
      if (!socket) return;

      events.forEach((event) => {
        if (handlers[event]) {
          socket.off(event, handlers[event]);
        }
      });
    };

    // Logic retry kết nối (giữ nguyên code cũ của bạn)
    if (!attachListeners()) {
      const retryTimer = setTimeout(() => {
        attachListeners();
      }, 500);

      return () => {
        clearTimeout(retryTimer);
        detachListeners();
      };
    }

    return () => {
      detachListeners();
    };
  }, [isAuthenticated, onNewNotification]);
}
