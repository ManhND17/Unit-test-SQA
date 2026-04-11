import { Button } from '@mui/material';
import clsx from 'clsx';
import { Check, File, HeartPlus, Plus } from 'lucide-react';
import { useState } from 'react';
import GeneralEHR from './components/tabs/GeneralEHR';
import MedicalRecords from './components/tabs/MedicalRecords';
import PatientInformation from './components/tabs/PatientInformation';
import PatientStatsChart from './components/charts';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IRootState } from '@src/redux/store';
import { useQuery } from '@tanstack/react-query';
import ApiStatistics from '@src/api/ApiStatistics';

export default function EHR() {
  const [activeTab, setActiveTab] = useState(1);
  const navigate = useNavigate();
  const patientId = useSelector((state: IRootState) => state.auth.user?.id);

  const {
    data: patientVisitStatusStats,
    isLoading: isLoadingPatientVisitStatusStats,
  } = useQuery({
    queryKey: ['patient-visit-status-stats', patientId],
    queryFn: () => ApiStatistics.getPatientVisitsStatusStats(patientId!),
    enabled: !!patientId,
  });

  return (
    <div className="container mx-auto px-4 pt-4 lg:pt-8">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h1 className="lg:text-2xl font-bold text-gray-900">Hồ sơ bệnh án</h1>
          <Button
            variant="contained"
            className="!bg-green-500 !text-sm !lg:text-xl"
            onClick={() => navigate('/patient/create-appointment')}
          >
            <Plus className="mr-2" />
            Tạo lịch khám
          </Button>
        </div>
        <div>
          <p className="text-gray-600 mt-1">
            Quản lý hồ sơ khám & điều trị của bệnh nhân
          </p>
        </div>
        <div className="flex items-center"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Tổng số lần khám</p>
              <p className="text-2xl font-bold text-gray-900">
                {patientVisitStatusStats?.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <File className="text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đang điều trị</p>
              <p className="text-2xl font-bold text-orange-600">
                {patientVisitStatusStats?.byStatus['in_progress'] || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <HeartPlus className=" text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Đã hoàn thành</p>
              <p className="text-2xl font-bold text-green-600">
                {patientVisitStatusStats?.byStatus['completed'] || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Check className="text-green-600" />
            </div>
          </div>
        </div>
      </div>
      {patientId && (
        <div className="mb-6">
          <PatientStatsChart patientId={patientId} />
        </div>
      )}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            <button
              className={clsx(
                'border-b-[3px] border-transparent text-gray-700 hover:text-blue-500 hover:border-blue-600 py-2 px-1 font-medium text-sm',
                {
                  '!border-blue-500 !text-blue-500': activeTab === 1,
                }
              )}
              data-tab="overview"
              onClick={() => setActiveTab(1)}
            >
              Tổng quan
            </button>
            <button
              className={clsx(
                'border-b-[3px] border-transparent text-gray-700 hover:text-blue-500 hover:border-blue-600 py-2 px-1 font-medium text-sm',
                {
                  '!border-blue-500 !text-blue-500': activeTab === 2,
                }
              )}
              data-tab="records"
              onClick={() => setActiveTab(2)}
            >
              Kết quả khám bệnh
            </button>
            <button
              className={clsx(
                'border-b-[3px] border-transparent text-gray-700 hover:text-blue-500 hover:border-blue-600 py-2 px-1 font-medium text-sm',
                {
                  '!border-blue-500 !text-blue-500': activeTab === 3,
                }
              )}
              data-tab="profile"
              onClick={() => setActiveTab(3)}
            >
              Thông tin cá nhân
            </button>
          </nav>
        </div>
      </div>
      <div
        className={clsx('fade-in', {
          hidden: activeTab !== 1,
        })}
      >
        <GeneralEHR setActiveTab={setActiveTab} />
      </div>
      <div
        className={clsx('fade-in', {
          hidden: activeTab !== 2,
        })}
      >
        {patientId && <MedicalRecords patientId={patientId} />}
      </div>
      <div
        className={clsx('fade-in', {
          hidden: activeTab !== 3,
        })}
      >
        <PatientInformation />
      </div>
    </div>
  );
}
