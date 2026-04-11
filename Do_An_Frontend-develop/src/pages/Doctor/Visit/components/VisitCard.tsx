import ApiVisit from '@src/api/ApiVisit';
import { EVisitStatus } from '@src/types';
import { useMutation } from '@tanstack/react-query';
import {
  Clock,
  Play,
  CheckCircle,
  FileText,
  User,
  ArrowRight,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface VisitCardProps {
  patientName: string;
  visitCode?: string;
  type: string;
  waitTime?: string;
  startTime?: string;
  completedTime?: string;
  diagnosis?: string;
  status: 'waiting' | 'in_progress' | 'completed';
  order?: number;
  from?: 'visit' | 'visit_service';
  refetchVisits?: () => void;
}

export function VisitCard({
  patientName,
  visitCode,
  type,
  waitTime,
  startTime,
  completedTime,
  diagnosis,
  status,
  order,
  from,
  refetchVisits,
}: VisitCardProps) {
  const isWaiting = status === 'waiting';
  const isInProgress = status === 'in_progress';
  const isCompleted = status === 'completed';
  const navigate = useNavigate();

  const updateVisitStatus = useMutation({
    mutationFn: (data: { visitId: string; status: EVisitStatus }) => {
      return ApiVisit.updateVisitStatus(data.visitId, data.status);
    },
  });

  const handleWatchVisit = () => {
    if (visitCode) {
      navigate(`/doctor/visits/${visitCode}`);
    }
  };

  const handleStartNewMedicalRecord = async () => {
    if (visitCode) {
      await updateVisitStatus.mutateAsync({
        visitId: visitCode,
        status: EVisitStatus.IN_PROGRESS,
      });
      navigate(`/doctor/visits/${visitCode}/create-medical-record`);
    }
  };

  const handleCompleteVisit = async () => {
    if (visitCode) {
      await updateVisitStatus
        .mutateAsync({
          visitId: visitCode,
          status: EVisitStatus.COMPLETED,
        })
        .then(() => {
          if (refetchVisits) {
            refetchVisits();
          }
        });
    }
  };

  // Parse wait time safely
  const waitMinutes = waitTime ? parseInt(waitTime.replace(/[^0-9]/g, '')) : 0;
  const isLongWait = isWaiting && waitMinutes > 20;

  return (
    <div
      className={`
      group relative bg-white rounded-2xl border transition-all duration-300 hover:shadow-xl hover:-translate-y-1
      ${isInProgress ? 'border-primary-200 ring-4 ring-primary-50' : 'border-slate-100'}
      ${isCompleted ? 'bg-slate-50/50 opacity-90' : 'shadow-sm'}
    `}
    >
      {/* Status Badge */}
      <div className="absolute -top-3 left-4">
        {isWaiting && (
          <span
            className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
              isLongWait ? 'bg-red-500 text-white' : 'bg-amber-500 text-white'
            }`}
          >
            {isLongWait ? 'Đợi lâu' : 'Đang đợi'}
          </span>
        )}
        {isInProgress && (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white shadow-sm animate-pulse">
            Đang khám
          </span>
        )}
        {isCompleted && (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-white shadow-sm">
            Hoàn thành
          </span>
        )}
      </div>

      <div className="p-5 pt-7">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`
              flex items-center justify-center w-10 h-10 rounded-xl font-bold text-sm
              ${isInProgress ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-600'}
              ${isCompleted ? 'bg-emerald-50 text-emerald-600' : ''}
            `}
            >
              {order || <User className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-slate-900 line-clamp-1">
                {patientName}
              </h3>
              {visitCode && (
                <span className="text-[11px] font-mono text-slate-400">
                  #{visitCode}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 mb-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" /> Dịch vụ:
            </span>
            <span className="font-semibold text-slate-800">{type}</span>
          </div>

          {isWaiting && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Đã đợi:
              </span>
              <span
                className={`font-bold px-2 py-0.5 rounded-md ${
                  isLongWait
                    ? 'bg-red-50 text-red-600'
                    : 'bg-slate-50 text-slate-700'
                }`}
              >
                {waitTime}
              </span>
            </div>
          )}

          {isInProgress && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Giờ bắt đầu:
              </span>
              <span className="font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                {startTime
                  ? new Date(startTime).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : '--:--'}
              </span>
            </div>
          )}

          {isCompleted && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Hoàn thành:
                </span>
                <span className="font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md">
                  {completedTime
                    ? new Date(completedTime).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '--:--'}
                </span>
              </div>
              {diagnosis && (
                <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/50">
                  <div className="text-[10px] font-bold text-emerald-700 uppercase mb-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" /> Chẩn đoán ghi nhận
                  </div>
                  <p className="text-xs text-emerald-800 line-clamp-2 leading-relaxed">
                    {diagnosis}
                  </p>
                </div>
              )}
            </>
          )}
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-500 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Nguồn:
            </span>
            <span className="font-semibold text-slate-800">
              {from === 'visit'
                ? 'Trực tiếp'
                : from === 'visit_service'
                  ? 'Được giao'
                  : 'Không rõ'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-slate-50 flex gap-2">
          {isWaiting && (
            <button
              onClick={handleStartNewMedicalRecord}
              className="w-full h-10 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xl flex items-center justify-center transition-all shadow-lg shadow-blue-200/50 hover:shadow-blue-300/50"
            >
              <Play className="w-3.5 h-3.5 mr-2 fill-current" />
              BẮT ĐẦU KHÁM
              <ArrowRight className="w-3.5 h-3.5 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
            </button>
          )}

          {isInProgress && (
            <>
              <button
                onClick={handleWatchVisit}
                className="flex-1 h-10 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-[11px] rounded-xl flex items-center justify-center transition-all"
              >
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                KHÁM TIẾP
              </button>
              {from !== 'visit_service' && (
                <button
                  onClick={handleCompleteVisit}
                  className="flex-1 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-[11px] rounded-xl flex items-center justify-center transition-all shadow-lg shadow-emerald-200/50 hover:shadow-emerald-300/50"
                >
                  <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                  HOÀN THÀNH
                </button>
              )}
            </>
          )}

          {isCompleted && (
            <button
              onClick={handleWatchVisit}
              className="w-full h-10 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs rounded-xl flex items-center justify-center transition-all"
            >
              <FileText className="w-3.5 h-3.5 mr-2" />
              XEM LẠI HỒ SƠ
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
