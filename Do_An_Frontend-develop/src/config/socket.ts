/* eslint-disable no-console */
import { io, Socket } from 'socket.io-client';
import store from '@redux/store';

let socket: Socket | null = null;

/**
 * Lấy Socket server URL từ API_BASE_URL
 * Ví dụ: http://localhost:5000/api/v1 -> http://localhost:5000
 */
const getSocketUrl = (): string => {
  const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
  return apiUrl.replace('/api/v1', '');
};

/**
 * Kết nối Socket.IO với JWT
 * Chỉ tạo 1 instance duy nhất
 */
export const connectSocket = (): Socket | null => {
  const token = store.getState().auth.accessToken;

  if (!token) {
    console.warn('[Socket.IO] No access token, skip connect');
    return null;
  }

  // Nếu socket đã tồn tại & đang kết nối thì dùng lại
  if (socket && socket.connected) {
    return socket;
  }

  // Nếu socket tồn tại nhưng chưa connected (reconnect)
  if (socket) {
    socket.auth = { token };
    socket.connect();
    return socket;
  }

  socket = io(getSocketUrl(), {
    auth: { token },
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => {
    console.log('[Socket.IO] Connected:', socket?.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('[Socket.IO] Disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('[Socket.IO] Connection error:', error.message);
  });

  return socket;
};

/**
 * Ngắt kết nối Socket.IO (khi logout)
 */
export const disconnectSocket = (): void => {
  if (!socket) return;

  socket.removeAllListeners();
  socket.disconnect();
  socket = null;

  console.log('[Socket.IO] Disconnected & cleaned up');
};

/**
 * Lấy socket instance hiện tại
 */
export const getSocket = (): Socket | null => socket;

/**
 * Kiểm tra trạng thái kết nối
 */
export const isSocketConnected = (): boolean => {
  return socket?.connected ?? false;
};
