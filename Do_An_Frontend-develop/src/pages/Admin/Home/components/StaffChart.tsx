import { useEffect, useRef } from 'react';
import { init, graphic } from 'echarts';
import { Paper, Typography, Box, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import ApiStatistics, { IStaffByDepartment } from '@api/ApiStatistics';
import QUERY_KEY from '@api/QueryKey';

export default function StaffChart() {
  const chartRef = useRef<HTMLDivElement>(null);

  const { data: staffStats, isLoading } = useQuery({
    queryKey: [QUERY_KEY.STATISTICS.STAFF_BY_DEPARTMENT],
    queryFn: ApiStatistics.getStaffByDepartment,
  });

  useEffect(() => {
    if (chartRef.current && staffStats && staffStats.length > 0) {
      const chartInstance = init(chartRef.current);

      const option = {
        textStyle: {
          fontFamily: "'Roboto', sans-serif",
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              color: 'rgba(59, 130, 246, 0.08)',
            },
          },
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          textStyle: {
            color: '#374151',
          },
          formatter: (params: { name: string; value: number }[]) => {
            const data = params[0];
            return `<div style="padding: 8px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${data.name}</div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="display: inline-block; width: 10px; height: 10px; background: linear-gradient(180deg, #3b82f6, #60a5fa); border-radius: 2px;"></span>
                <span>Nhân sự: <strong>${data.value}</strong> người</span>
              </div>
            </div>`;
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '12%',
          top: '15%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            data: staffStats.map((item: IStaffByDepartment) => item.department),
            axisTick: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: '#e5e7eb',
              },
            },
            axisLabel: {
              interval: 0,
              rotate: 25,
              color: '#6b7280',
              fontSize: 12,
              margin: 12,
            },
          },
        ],
        yAxis: [
          {
            minInterval: 1,
            type: 'value',
            name: 'Số lượng',
            nameTextStyle: {
              color: '#9ca3af',
              fontSize: 12,
              padding: [0, 0, 8, 0],
            },
            splitLine: {
              lineStyle: {
                color: '#f3f4f6',
                type: 'dashed',
              },
            },
            axisLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              color: '#9ca3af',
              fontSize: 12,
            },
          },
        ],
        series: [
          {
            name: 'Nhân sự',
            type: 'bar',
            barWidth: '45%',
            data: staffStats.map((item: IStaffByDepartment) => ({
              value: item.count,
              itemStyle: {
                color: new graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#3b82f6' },
                  { offset: 0.6, color: '#60a5fa' },
                  { offset: 1, color: '#93c5fd' },
                ]),
                borderRadius: [6, 6, 0, 0],
                shadowColor: 'rgba(59, 130, 246, 0.3)',
                shadowBlur: 8,
                shadowOffsetY: 4,
              },
            })),
            emphasis: {
              itemStyle: {
                color: new graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: '#2563eb' },
                  { offset: 0.6, color: '#3b82f6' },
                  { offset: 1, color: '#60a5fa' },
                ]),
                shadowColor: 'rgba(59, 130, 246, 0.5)',
                shadowBlur: 12,
                shadowOffsetY: 6,
              },
            },
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(243, 244, 246, 0.5)',
              borderRadius: [6, 6, 0, 0],
            },
            animationDuration: 1000,
            animationEasing: 'elasticOut',
          },
        ],
      };

      chartInstance.setOption(option);

      const handleResize = () => chartInstance.resize();
      window.addEventListener('resize', handleResize);

      return () => {
        chartInstance.dispose();
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [staffStats]);

  if (isLoading) {
    return (
      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: 2, border: '1px solid #e5e7eb' }}
      >
        <Box sx={{ mb: 3 }}>
          <Skeleton variant="text" width="60%" height={28} />
          <Skeleton variant="text" width="40%" height={20} />
        </Box>
        <Skeleton variant="rectangular" height={380} sx={{ borderRadius: 1 }} />
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{ p: 3, borderRadius: 2, border: '1px solid #e5e7eb' }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#111827' }}>
          Thống kê số lượng nhân sự (bác sĩ, nhân viên) theo từng phòng ban
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Số lượng bác sĩ và nhân viên y tế phân bố theo từng phòng ban
        </Typography>
      </Box>
      <div ref={chartRef} style={{ height: '380px', width: '100%' }} />
    </Paper>
  );
}
