// Mock data for Admin Home Page
// Các card thống kê tổng quan (4 card ở trên cùng)
export const summaryStats = [
  {
    id: 1,
    title: 'Số bệnh nhân tới khám trong ngày',
    value: 124, // Số bệnh nhân đã tới khám trong ngày hôm nay
    change: '+12%', // Thay đổi so với ngày hôm trước
    trend: 'up', // tăng
  },
  {
    id: 2,
    title: 'Số tài khoản mới được tạo',
    value: 45, // Số tài khoản mới trong ngày (bệnh nhân, bác sĩ, nhân viên)
    change: '+5%', // Thay đổi so với ngày hôm trước
    trend: 'up', // tăng
  },
  {
    id: 3,
    title: 'Tổng số phòng khám, khoa',
    value: 18, // Số lượng phòng khám, khoa hiện có (tính đến thời điểm hiện tại)
    change: '0%', // Thay đổi so với ngày hôm trước
    trend: 'neutral', // không tăng không giảm
  },
  {
    id: 4,
    title: 'Tổng số bác sĩ trong bệnh viện',
    value: 32, // Số lượng bác sĩ hiện có (tính đến thời điểm hiện tại)
    change: '+2', // Thay đổi so với ngày hôm trước
    trend: 'up', // tăng
  },
];

// Dữ liệu thống kê nhân sự theo phòng ban (Biểu đồ cột)
export const staffStats = [
  { department: 'Nội', count: 12 },
  { department: 'Ngoại', count: 8 },
  { department: 'Nhi', count: 10 },
  { department: 'Sản', count: 6 },
  { department: 'Tai Mũi Họng', count: 5 },
  { department: 'Răng Hàm Mặt', count: 4 },
  { department: 'Mắt', count: 3 },
  { department: 'Da liễu', count: 4 },
];

// Dữ liệu thống kê doanh thu theo ngày trong tuần (Biêu đồ đường)
export const revenueStats = [
  { day: 'Thứ 2', value: 15000000 },
  { day: 'Thứ 3', value: 23000000 },
  { day: 'Thứ 4', value: 18000000 },
  { day: 'Thứ 5', value: 20000000 },
  { day: 'Thứ 6', value: 25000000 },
  { day: 'Thứ 7', value: 30000000 },
  { day: 'CN', value: 28000000 },
];

// Dữ liệu thống kê số lượng lịch hẹn theo ngày trong tuần (Biểu đồ đường)
export const appointmentStats = [
  { day: 'Thứ 2', value: 45 },
  { day: 'Thứ 3', value: 52 },
  { day: 'Thứ 4', value: 38 },
  { day: 'Thứ 5', value: 42 },
  { day: 'Thứ 6', value: 55 },
  { day: 'Thứ 7', value: 68 },
  { day: 'CN', value: 60 },
];
