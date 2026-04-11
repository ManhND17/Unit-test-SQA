import { CalendarCheck, CheckCircle, Clock } from 'lucide-react';
import React from 'react';

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
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 transaction-all hover:shadow-md">
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <StatsCard
        title="Ca khám đã hoàn thành"
        value="48"
        textColor="text-teal-600"
        bgColor="bg-teal-50"
        icon={<CheckCircle size={24} />}
      />
      <StatsCard
        title="Ca khám chưa hoàn thành"
        value="12"
        textColor="text-amber-600"
        bgColor="bg-amber-50"
        icon={<Clock size={24} />}
      />
      <StatsCard
        title="Số lịch khám tuần này"
        value="86"
        textColor="text-blue-600"
        bgColor="bg-blue-50"
        icon={<CalendarCheck size={24} />}
      />
    </div>
  );
}
