import { IVisit } from '@src/types';
import { FileText, Calendar, User, ChevronRight } from 'lucide-react';

interface VisitListProps {
  visits: IVisit[];
  onViewVisit: (visit: IVisit) => void;
}

export function VisitList({ visits, onViewVisit }: VisitListProps) {
  if (visits.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <FileText size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium text-sm">
            Chưa có hồ sơ khám bệnh
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {visits.map((visit) => (
        <div
          key={visit.id}
          onClick={() => onViewVisit(visit)}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md hover:border-green-200 transition-all cursor-pointer group"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1.5">
                <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                  <FileText size={18} className="text-green-600" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mt-0.5 text-[11px] text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(visit.createdAt).toLocaleDateString('vi-VN')}
                    </span>
                    {visit.doctorId && (
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        BS. {visit.doctor?.staff?.user?.name?.firstName}{' '}
                        {visit.doctor?.staff?.user?.name?.lastName}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-600 ml-11 flex-wrap">
                <span>
                  <span className="font-semibold text-gray-700">
                    Trạng thái:
                  </span>{' '}
                  {visit.status}
                </span>
                {visit.startTime && (
                  <>
                    <span className="text-gray-400">|</span>
                    <span>
                      <span className="font-semibold text-gray-700">
                        Bắt đầu:
                      </span>{' '}
                      {new Date(visit.startTime).toLocaleTimeString('vi-VN')}
                    </span>
                  </>
                )}
                {visit.endTime && (
                  <>
                    <span className="text-gray-400">|</span>
                    <span>
                      <span className="font-semibold text-gray-700">
                        Kết thúc:
                      </span>{' '}
                      {new Date(visit.endTime).toLocaleTimeString('vi-VN')}
                    </span>
                  </>
                )}
              </div>

              {visit.nextVisitDate && (
                <div className="ml-11 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-blue-100 text-blue-800">
                    Tái khám:{' '}
                    {new Date(visit.nextVisitDate).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              )}
            </div>

            <div className="ml-3 pt-1">
              <ChevronRight
                size={18}
                className="text-gray-400 group-hover:text-green-600 transition-colors"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
