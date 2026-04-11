import { useState } from 'react';
import { IRootState } from '@src/redux/store';
import { useSelector } from 'react-redux';
import WaitingVisits from './components/tabs/WaitingVisits';
import InProgressVisits from './components/tabs/InProgressVisits';
import CompletedVisits from './components/tabs/CompletedVisits';

export default function DoctorVisitPage() {
  const [activeTab, setActiveTab] = useState<
    'waiting' | 'in_progress' | 'completed'
  >('waiting');
  const { user } = useSelector((state: IRootState) => state.auth);

  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('waiting')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors flex items-center justify-center gap-2
            ${activeTab === 'waiting' ? 'border-yellow-500 text-yellow-700 bg-yellow-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'}
          `}
          >
            Đang chờ
          </button>
          <button
            onClick={() => setActiveTab('in_progress')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors flex items-center justify-center gap-2
            ${activeTab === 'in_progress' ? 'border-blue-500 text-blue-700 bg-blue-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'}
          `}
          >
            Đang khám
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide border-b-2 transition-colors flex items-center justify-center gap-2
            ${activeTab === 'completed' ? 'border-green-500 text-green-700 bg-green-50/50' : 'border-transparent text-gray-500 hover:bg-gray-50'}
          `}
          >
            Hoàn thành
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
          {activeTab === 'waiting' && <WaitingVisits doctorId={user?.id} />}

          {activeTab === 'in_progress' && (
            <InProgressVisits doctorId={user?.id} />
          )}

          {activeTab === 'completed' && <CompletedVisits doctorId={user?.id} />}
        </div>
      </div>
    </div>
  );
}
