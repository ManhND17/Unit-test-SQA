import { Box } from '@mui/material';
import SummaryStats from './components/SummaryStats';
import StaffChart from './components/StaffChart';
import AnalyticsCharts from './components/AnalyticsCharts';

export default function AdminHome() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#ffffff',
        padding: '24px',
      }}
    >
      <Box sx={{ gap: 3, display: 'flex', flexDirection: 'column' }}>
        {/* Hàng 1: Thống kê tổng quan - 4 cột đều nhau */}
        <SummaryStats />

        {/* Hàng 2: Biểu đồ nhân sự - full width */}
        <StaffChart />

        {/* Hàng 3: Biểu đồ phân tích - 2 cột */}
        <AnalyticsCharts />
      </Box>
    </Box>
  );
}
