import { CalendarCheck, CheckCircle, Clock } from 'lucide-react';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import ApiStatistics from '@api/ApiStatistics';
import QUERY_KEY from '@api/QueryKey';

function StatsCardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
          <div className="h-8 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );
}

function StatsCard({
  title,
  value,
  textColor,
  bgColor,
  icon,
}: {
  title: string;
  value: string;
  textColor: string;
  bgColor: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transaction-all hover:translate-y-[-2px] hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold ${textColor}`}>{value}</p>
        </div>
        <div
          className={`w-12 h-12 ${bgColor} ${textColor} rounded-lg flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function StatsGrid() {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEY.STATISTICS.DOCTOR_SUMMARY],
    queryFn: ApiStatistics.getDoctorDashboardSummary,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCardSkeleton />
        <StatsCardSkeleton />
        <StatsCardSkeleton />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard
        title="Ca khám đã hoàn thành"
        value={String(data?.completedAppointments ?? 0)}
        textColor="text-teal-600"
        bgColor="bg-teal-50"
        icon={<CheckCircle size={24} />}
      />
      <StatsCard
        title="Ca khám chưa hoàn thành"
        value={String(data?.pendingAppointments ?? 0)}
        textColor="text-amber-600"
        bgColor="bg-amber-50"
        icon={<Clock size={24} />}
      />
      <StatsCard
        title="Số lịch khám tuần này"
        value={String(data?.weeklyAppointments ?? 0)}
        textColor="text-blue-600"
        bgColor="bg-blue-50"
        icon={<CalendarCheck size={24} />}
      />
    </div>
  );
}
