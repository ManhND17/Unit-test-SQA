import { useEffect, useRef } from 'react';
import { init, graphic } from 'echarts';
import { Paper, Typography, Box, Grid, Skeleton } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import ApiStatistics, {
  IRevenueByDay,
  IAppointmentByDay,
} from '@api/ApiStatistics';
import QUERY_KEY from '@api/QueryKey';

function ChartSkeleton() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 2,
        border: '1px solid #e5e7eb',
        height: '100%',
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Skeleton variant="text" width="70%" height={28} />
        <Skeleton variant="text" width="50%" height={20} />
      </Box>
      <Skeleton variant="rectangular" height={340} sx={{ borderRadius: 1 }} />
    </Paper>
  );
}

export default function AnalyticsCharts() {
  const revenueChartRef = useRef<HTMLDivElement>(null);
  const appointmentChartRef = useRef<HTMLDivElement>(null);

  const { data: revenueStats, isLoading: isLoadingRevenue } = useQuery({
    queryKey: [QUERY_KEY.STATISTICS.REVENUE_BY_DAY],
    queryFn: ApiStatistics.getRevenueByDay,
  });

  const { data: appointmentStats, isLoading: isLoadingAppointments } = useQuery(
    {
      queryKey: [QUERY_KEY.STATISTICS.APPOINTMENTS_BY_DAY],
      queryFn: ApiStatistics.getAppointmentsByDay,
    }
  );

  useEffect(() => {
    if (revenueChartRef.current && revenueStats && revenueStats.length > 0) {
      const chartInstance = init(revenueChartRef.current);

      const option = {
        textStyle: {
          fontFamily: "'Roboto', sans-serif",
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          textStyle: {
            color: '#374151',
          },
          formatter: (params: { name: string; value: number }[]) => {
            const data = params[0];
            const formattedValue = new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(data.value);
            return `<div style="padding: 8px;">
              <div style="font-weight: 600; margin-bottom: 4px;">${data.name}</div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="display: inline-block; width: 10px; height: 10px; background: #10b981; border-radius: 50%;"></span>
                <span>Doanh thu: <strong style="color: #10b981;">${formattedValue}</strong></span>
              </div>
            </div>`;
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          top: '18%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: revenueStats.map((item: IRevenueByDay) => item.day),
          axisLine: {
            lineStyle: {
              color: '#e5e7eb',
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#6b7280',
            fontSize: 12,
          },
        },
        yAxis: {
          type: 'value',
          name: 'VND',
          nameTextStyle: {
            color: '#9ca3af',
            fontSize: 11,
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
            fontSize: 11,
            formatter: (value: number) => {
              if (value >= 1000000) {
                return (value / 1000000).toFixed(0) + 'M';
              }
              return value.toString();
            },
          },
        },
        series: [
          {
            name: 'Doanh thu',
            type: 'line',
            smooth: 0.4,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              width: 3,
              color: '#10b981',
              shadowColor: 'rgba(16, 185, 129, 0.3)',
              shadowBlur: 10,
              shadowOffsetY: 8,
            },
            itemStyle: {
              color: '#10b981',
              borderWidth: 3,
              borderColor: '#fff',
              shadowColor: 'rgba(16, 185, 129, 0.3)',
              shadowBlur: 6,
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(16, 185, 129, 0.35)' },
                { offset: 0.5, color: 'rgba(16, 185, 129, 0.15)' },
                { offset: 1, color: 'rgba(16, 185, 129, 0.02)' },
              ]),
            },
            emphasis: {
              focus: 'series',
              itemStyle: {
                borderWidth: 4,
                shadowBlur: 10,
              },
            },
            data: revenueStats.map((item: IRevenueByDay) => item.value),
            animationDuration: 1200,
            animationEasing: 'cubicOut',
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
  }, [revenueStats]);

  useEffect(() => {
    if (
      appointmentChartRef.current &&
      appointmentStats &&
      appointmentStats.length > 0
    ) {
      const chartInstance = init(appointmentChartRef.current);

      const option = {
        textStyle: {
          fontFamily: "'Roboto', sans-serif",
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e5e7eb',
          borderWidth: 1,
          textStyle: {
            color: '#374151',
          },
          formatter: (params: { name: string; value: number }[]) => {
            const data = params[0];
            return `<div style="padding: 8px; font-family: 'Roboto', sans-serif;">
              <div style="font-weight: 600; margin-bottom: 4px;">${data.name}</div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="display: inline-block; width: 10px; height: 10px; background: #f59e0b; border-radius: 50%;"></span>
                <span>Lịch hẹn: <strong style="color: #f59e0b;">${data.value}</strong> lượt</span>
              </div>
            </div>`;
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '8%',
          top: '18%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          data: appointmentStats.map((item: IAppointmentByDay) => item.day),
          axisLine: {
            lineStyle: {
              color: '#e5e7eb',
            },
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            color: '#6b7280',
            fontSize: 12,
          },
        },
        yAxis: {
          minInterval: 1,
          type: 'value',
          name: 'Lượt',
          nameTextStyle: {
            color: '#9ca3af',
            fontSize: 11,
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
            fontSize: 11,
          },
        },
        series: [
          {
            name: 'Lịch hẹn',
            type: 'line',
            smooth: 0.4,
            symbol: 'circle',
            symbolSize: 10,
            data: appointmentStats.map((item: IAppointmentByDay) => item.value),
            lineStyle: {
              color: '#f59e0b',
              width: 3,
              shadowColor: 'rgba(245, 158, 11, 0.3)',
              shadowBlur: 10,
              shadowOffsetY: 8,
            },
            itemStyle: {
              borderWidth: 3,
              borderColor: '#fff',
              color: '#f59e0b',
              shadowColor: 'rgba(245, 158, 11, 0.3)',
              shadowBlur: 6,
            },
            areaStyle: {
              color: new graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(245, 158, 11, 0.25)' },
                { offset: 0.5, color: 'rgba(245, 158, 11, 0.1)' },
                { offset: 1, color: 'rgba(245, 158, 11, 0.02)' },
              ]),
            },
            emphasis: {
              focus: 'series',
              itemStyle: {
                borderWidth: 4,
                shadowBlur: 10,
              },
            },
            animationDuration: 1200,
            animationEasing: 'cubicOut',
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
  }, [appointmentStats]);

  if (isLoadingRevenue && isLoadingAppointments) {
    return (
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartSkeleton />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ChartSkeleton />
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        {isLoadingRevenue ? (
          <ChartSkeleton />
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid #e5e7eb',
              height: '100%',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: '#111827' }}
              >
                Thống kê doanh thu hàng ngày
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tổng doanh thu theo ngày trong tuần
              </Typography>
            </Box>
            <div
              ref={revenueChartRef}
              style={{ height: '340px', width: '100%' }}
            />
          </Paper>
        )}
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        {isLoadingAppointments ? (
          <ChartSkeleton />
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid #e5e7eb',
              height: '100%',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ fontWeight: 'bold', color: '#111827' }}
              >
                Thống kê số lịch hẹn hàng ngày
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Số lượng lịch hẹn đã đặt theo ngày
              </Typography>
            </Box>
            <div
              ref={appointmentChartRef}
              style={{ height: '340px', width: '100%' }}
            />
          </Paper>
        )}
      </Grid>
    </Grid>
  );
}
