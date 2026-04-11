import { useEffect, useRef } from 'react';
import { init, graphic } from 'echarts';

export default function DoctorCharts() {
  // 1. Tạo Refs để trỏ tới thẻ div chứa biểu đồ
  const lineChartRef = useRef(null);
  const pieChartRef = useRef(null);

  const lineChartOption = {
    title: {
      text: 'Thống kê số lượng khám (7 ngày)',
      left: 'left',
      textStyle: { fontSize: 16, fontWeight: '600' },
    },
    tooltip: { trigger: 'axis' },
    grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'],
    },
    yAxis: { type: 'value' },
    series: [
      {
        name: 'Số ca khám',
        type: 'line',
        data: [12, 18, 15, 25, 22, 30, 10],
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

  const pieChartOption = {
    title: {
      text: 'Tỉ lệ trạng thái lịch hẹn',
      left: 'left',
      textStyle: { fontSize: 16, fontWeight: '600' },
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
        data: [
          { value: 45, name: 'Hoàn thành', itemStyle: { color: '#10b981' } },
          { value: 10, name: 'Hủy', itemStyle: { color: '#ef4444' } },
          { value: 25, name: 'Chờ khám', itemStyle: { color: '#f59e0b' } },
        ],
      },
    ],
  };

  // 2. Sử dụng useEffect để khởi tạo biểu đồ
  useEffect(() => {
    // Khởi tạo instance
    const lineChartInstance = init(lineChartRef.current);
    const pieChartInstance = init(pieChartRef.current);

    // Set options
    lineChartInstance.setOption(lineChartOption);
    pieChartInstance.setOption(pieChartOption);

    // Xử lý responsive (resize biểu đồ khi màn hình thay đổi)
    const handleResize = () => {
      lineChartInstance.resize();
      pieChartInstance.resize();
    };

    window.addEventListener('resize', handleResize);

    // 3. Cleanup function: Hủy instance khi component unmount để tránh memory leak
    return () => {
      lineChartInstance.dispose();
      pieChartInstance.dispose();
      window.removeEventListener('resize', handleResize);
    };
  }, []); // Empty dependency array: chỉ chạy 1 lần khi mount

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Box for Line Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        {/* Thay thế ReactECharts bằng thẻ div có ref */}
        <div ref={lineChartRef} style={{ height: '350px', width: '100%' }} />
      </div>

      {/* Box for Pie Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div ref={pieChartRef} style={{ height: '350px', width: '100%' }} />
      </div>
    </div>
  );
}
