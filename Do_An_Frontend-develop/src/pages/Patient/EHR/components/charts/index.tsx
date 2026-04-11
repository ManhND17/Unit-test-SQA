import { useEffect, useRef, useState } from 'react';
import { init } from 'echarts';
import ApiStatistics from '@src/api/ApiStatistics';
import { useQuery } from '@tanstack/react-query';
import CommonSelect from '@src/components/CommonSelect';

interface IPatientStatsChartProps {
  patientId: string;
}

export default function PatientStatsChart({
  patientId,
}: IPatientStatsChartProps) {
  const chartRef = useRef(null);
  const [year, setYear] = useState(new Date().getFullYear());

  const { data: patientMonthlyVisitCountsByYear } = useQuery({
    queryKey: ['patient-monthly-visit-counts-by-year', patientId, year],
    queryFn: () =>
      ApiStatistics.getPatientMonthlyVisitCountsByYear(patientId, year),
    enabled: !!patientId,
  });

  const chartInstanceRef = useRef<any>(null);

  // initialize chart once
  useEffect(() => {
    if (chartRef.current) {
      chartInstanceRef.current = init(chartRef.current);
    }

    const handleResize = () => {
      chartInstanceRef.current?.resize();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      chartInstanceRef.current?.dispose?.();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // update chart when data changes
  useEffect(() => {
    if (!chartInstanceRef.current) return;

    const option = {
      textStyle: {
        fontFamily: "'Roboto', sans-serif",
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      xAxis: [
        {
          type: 'category',
          data: [
            'Tháng 1',
            'Tháng 2',
            'Tháng 3',
            'Tháng 4',
            'Tháng 5',
            'Tháng 6',
            'Tháng 7',
            'Tháng 8',
            'Tháng 9',
            'Tháng 10',
            'Tháng 11',
            'Tháng 12',
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: 'value',
        },
      ],
      series: [
        {
          name: 'Lượt khám',
          type: 'bar',
          barWidth: '60%',
          data:
            patientMonthlyVisitCountsByYear?.months.map(
              (month) => month.count
            ) || [],
          itemStyle: {
            color: '#3b82f6',
            borderRadius: [4, 4, 0, 0],
          },
        },
      ],
    };

    chartInstanceRef.current.setOption(option, true);
  }, [patientMonthlyVisitCountsByYear]);

  return (
    <div className="bg-white rounded-lg p-6 border border-gray-200 w-full mb-6">
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            Thống kê lượt khám
          </h3>
          <div className="flex gap-3 items-center">
            <label className="block font-medium" htmlFor="year-select">
              Năm
            </label>
            <CommonSelect
              id="year-select"
              values={[
                { name: '2026', id: '2026' },
                { name: '2025', id: '2025' },
                { name: '2024', id: '2024' },
                { name: '2023', id: '2023' },
                { name: '2022', id: '2022' },
              ]}
              value={year + ''}
              onChange={(value) => setYear(Number(value))}
            />
          </div>
        </div>
        <p className="text-sm text-gray-500">
          Số lượng lượt khám theo tháng trong {year}
        </p>
      </div>

      <div ref={chartRef} style={{ height: '400px', width: '100%' }} />
    </div>
  );
}
