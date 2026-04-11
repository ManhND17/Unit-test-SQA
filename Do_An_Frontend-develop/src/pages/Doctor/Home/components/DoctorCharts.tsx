import { useEffect, useRef } from 'react';
import { init, graphic } from 'echarts';
import { useQuery } from '@tanstack/react-query';
import ApiStatistics from '@api/ApiStatistics';
import QUERY_KEY from '@api/QueryKey';

function ChartSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
      <div className="h-6 w-48 bg-gray-200 rounded mb-4"></div>
      <div className="h-[300px] bg-gray-100 rounded flex items-center justify-center">
        <div className="w-24 h-24 border-4 border-gray-200 border-t-gray-300 rounded-full"></div>
      </div>
    </div>
  );
}

export default function DoctorCharts() {
  // Refs for chart containers
  const lineChartRef = useRef<HTMLDivElement>(null);
  const pieChartRef = useRef<HTMLDivElement>(null);

  // Fetch data from APIs
  const { data: appointmentsByDay, isLoading: isLoadingAppointments } =
    useQuery({
      queryKey: [QUERY_KEY.STATISTICS.DOCTOR_APPOINTMENTS_BY_DAY],
      queryFn: ApiStatistics.getDoctorAppointmentsByDay,
    });

  const { data: appointmentStatus, isLoading: isLoadingStatus } = useQuery({
    queryKey: [QUERY_KEY.STATISTICS.DOCTOR_APPOINTMENT_STATUS],
    queryFn: ApiStatistics.getDoctorAppointmentStatus,
  });

  // Build chart when data is available
  useEffect(() => {
    if (!appointmentsByDay || !lineChartRef.current) return;

    const lineChartInstance = init(lineChartRef.current);

    const lineChartOption = {
      textStyle: {
        fontFamily: "'Roboto', sans-serif",
      },
      title: {
        text: 'Thống kê số ca khám trong tuần này',
        left: 'left',
        textStyle: {
          fontSize: 16,
          fontWeight: '600',
          fontFamily: "'Roboto', sans-serif",
        },
      },
      tooltip: { trigger: 'axis' },
      grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: appointmentsByDay.labels,
      },
      yAxis: { type: 'value', minInterval: 1 },
      series: [
        {
          name: 'Số ca khám',
          type: 'line',
          data: appointmentsByDay.values,
          smooth: true,
          lineStyle: { color: '#3b82f6', width: 3 },
          itemStyle: { color: '#3b82f6' },
          areaStyle: {
            color: new graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
              { offset: 1, color: 'rgba(59, 130, 246, 0)' },
            ]),
          },
        },
      ],
    };

    lineChartInstance.setOption(lineChartOption);

    const handleResize = () => lineChartInstance.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      lineChartInstance.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [appointmentsByDay]);

  // Build pie chart when data is available
  useEffect(() => {
    if (!appointmentStatus || !pieChartRef.current) return;

    const pieChartInstance = init(pieChartRef.current);

    // Map status names to colors
    const colorMap: Record<string, string> = {
      'Hoàn thành': '#10b981',
      Hủy: '#ef4444',
      'Chờ khám': '#f59e0b',
    };

    const pieData = appointmentStatus.map((item) => ({
      value: item.value,
      name: item.name,
      itemStyle: { color: colorMap[item.name] || '#6b7280' },
    }));

    const pieChartOption = {
      textStyle: {
        fontFamily: "'Roboto', sans-serif",
      },
      title: {
        text: 'Tỉ lệ trạng thái lịch hẹn',
        left: 'left',
        textStyle: {
          fontSize: 16,
          fontWeight: '600',
          fontFamily: "'Roboto', sans-serif",
        },
      },
      tooltip: { trigger: 'item' },
      legend: { bottom: '0%', left: 'center' },
      series: [
        {
          name: 'Trạng thái',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2,
          },
          label: { show: false, position: 'center' },
          emphasis: {
            label: { show: true, fontSize: 18, fontWeight: 'bold' },
          },
          labelLine: { show: false },
          data: pieData,
        },
      ],
    };

    pieChartInstance.setOption(pieChartOption);

    const handleResize = () => pieChartInstance.resize();
    window.addEventListener('resize', handleResize);

    return () => {
      pieChartInstance.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, [appointmentStatus]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Box for Line Chart */}
      {isLoadingAppointments ? (
        <ChartSkeleton />
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div ref={lineChartRef} style={{ height: '350px', width: '100%' }} />
        </div>
      )}

      {/* Box for Pie Chart */}
      {isLoadingStatus ? (
        <ChartSkeleton />
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div ref={pieChartRef} style={{ height: '350px', width: '100%' }} />
        </div>
      )}
    </div>
  );
}
