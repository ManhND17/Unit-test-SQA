import { useState } from 'react';
import Modal from '@src/components/Modal';
import { IEHR, IVisit } from '@src/types';
import { VisitList } from './VisitList';
import { VisitDetailModal } from './VisitDetailModal';
import { FileText, Calendar, RefreshCw } from 'lucide-react';
import { queryClient } from '@src/config/queryClient';
import { formatDateTimeFromIso } from '@src/utils/datetime';

interface EHRModalProps {
  isOpen: boolean;
  onClose: () => void;
  ehr?: IEHR;
}

export function EHRModal({ isOpen, onClose, ehr }: EHRModalProps) {
  const [selectedResult, setSelectedResult] = useState<IVisit | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  if (!ehr) return null;

  const handleViewResult = (result: IVisit) => {
    setSelectedResult(result);
    setIsDetailModalOpen(true);
  };

  const handleRefreshHistory = () => {
    queryClient.invalidateQueries({ queryKey: ['ehr', ehr.id] });
  };

  const sortedResults =
    typeof ehr.visits === 'object'
      ? [...ehr.visits].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
      : [];

  return (
    <>
      <Modal open={isOpen} onClose={onClose} title="Hồ sơ sức khỏe (EHR)">
        <div className="flex flex-col h-[500px]">
          {/* EHR Header - Fixed */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100 flex-shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Họ tên: {ehr.patient?.user?.name?.firstName}{' '}
                  {ehr.patient?.user?.name?.lastName}
                </h3>
                <p className="text-xs text-gray-600 mt-0.5 font-semibold">
                  EHR: {ehr.id}
                </p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <FileText size={20} className="text-green-600" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 text-xs">
              <StatBox label="Lần khám" value={ehr?.visits?.length || 0} />
              <StatBox
                label="Tạo"
                value={
                  ehr?.createdAt ? formatDateTimeFromIso(ehr.createdAt) : ''
                }
              />
              <StatBox
                label="Cập nhật"
                value={
                  ehr?.updatedAt ? formatDateTimeFromIso(ehr.updatedAt) : ''
                }
              />
            </div>
          </div>

          {/* Medical Results List - Scrollable */}
          <div className="flex flex-col flex-1 min-h-0 mt-3">
            <div className="flex items-center justify-between mb-2 flex-shrink-0">
              <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                <Calendar size={16} className="text-green-600" />
                Lịch sử khám
              </h4>
              <button
                onClick={handleRefreshHistory}
                className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-0.5 hover:bg-green-50 px-2 py-1 rounded transition-colors"
              >
                <RefreshCw size={12} />
                Làm mới
              </button>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0">
              <VisitList
                visits={sortedResults}
                onViewVisit={handleViewResult}
              />
            </div>
          </div>
        </div>
      </Modal>

      <VisitDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        visit={selectedResult || undefined}
      />
    </>
  );
}

function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white/70 rounded-md p-2">
      <p className="text-xs text-gray-600 mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-gray-900 leading-tight">
        {value}
      </p>
    </div>
  );
}
