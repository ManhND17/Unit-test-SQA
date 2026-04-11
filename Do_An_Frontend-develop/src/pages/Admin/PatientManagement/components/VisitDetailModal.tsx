import React, { useEffect, useRef, useState } from 'react';
import { IVisit } from '@src/types';
import Modal from '@src/components/Modal';
import {
  Calendar,
  User,
  FileText,
  Activity,
  Pill,
  StickyNote,
  Receipt,
  Clock,
  ChevronDown,
} from 'lucide-react';

interface VisitDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  visit?: IVisit;
}

export function VisitDetailModal({
  isOpen,
  onClose,
  visit,
}: VisitDetailModalProps) {
  const [expandedRecords, setExpandedRecords] = useState<Set<string>>(
    new Set()
  );

  if (!visit) return null;

  const toggleRecord = (recordId: string) => {
    const newExpanded = new Set(expandedRecords);
    if (newExpanded.has(recordId)) {
      newExpanded.delete(recordId);
    } else {
      newExpanded.add(recordId);
    }
    setExpandedRecords(newExpanded);
  };

  const formatCurrency = (value: number) =>
    value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  return (
    <Modal open={isOpen} onClose={onClose} title="Chi tiết lịch khám">
      <div className="max-h-[80vh] overflow-y-auto pr-2">
        <div className="space-y-4">
          {/* Header Info */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {visit.medicalRecords?.[0]?.title || 'Lịch khám'}
            </h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-green-600" />
                <span className="text-gray-600">Ngày khám:</span>
                <span className="font-semibold text-gray-900">
                  {visit.startTime &&
                    new Date(visit.startTime).toLocaleDateString('vi-VN')}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-green-600" />
                <span className="text-gray-600">Thời gian:</span>
                <span className="font-semibold text-gray-900">
                  {visit.startTime ? (
                    <>
                      {new Date(visit.startTime).toLocaleTimeString('vi-VN', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}{' '}
                      -{' '}
                      {visit.endTime
                        ? new Date(visit.endTime).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : '-'}
                    </>
                  ) : (
                    '-'
                  )}
                </span>
              </div>
              {visit.doctorId && (
                <div className="flex items-center gap-2 col-span-2">
                  <User size={14} className="text-green-600" />
                  <span className="text-gray-600">Bác sĩ:</span>
                  <span className="font-semibold text-gray-900">
                    BS. {visit.doctor?.staff?.user?.name?.firstName}{' '}
                    {visit.doctor?.staff?.user?.name?.lastName}
                  </span>
                </div>
              )}
            </div>
          </div>

          {visit.medicalRecords && visit.medicalRecords.length > 0 ? (
            <div className="space-y-2">
              {visit.medicalRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleRecord(record.id)}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Activity
                        size={16}
                        className="text-orange-600 flex-shrink-0"
                      />
                      <div className="text-left">
                        <p className="font-semibold text-gray-900 text-sm">
                          {record.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {record.diagnosis}
                        </p>
                      </div>
                    </div>
                    <ChevronDown
                      size={18}
                      className={`text-gray-400 flex-shrink-0 transition-transform ${
                        expandedRecords.has(record.id) ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {expandedRecords.has(record.id) && (
                    <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 space-y-3">
                      <InfoCard
                        icon={
                          <Activity size={14} className="text-orange-600" />
                        }
                        iconBg="bg-orange-100"
                        title="Triệu chứng"
                        content={record.symptoms}
                      />
                      <InfoCard
                        icon={<FileText size={14} className="text-blue-600" />}
                        iconBg="bg-blue-100"
                        title="Chẩn đoán"
                        content={record.diagnosis}
                      />
                      <InfoCard
                        icon={<Pill size={14} className="text-green-600" />}
                        iconBg="bg-green-100"
                        title="Điều trị"
                        content={record.treatments}
                      />

                      {record.notes && (
                        <InfoCard
                          icon={
                            <StickyNote size={14} className="text-yellow-600" />
                          }
                          iconBg="bg-yellow-100"
                          title="Ghi chú"
                          content={record.notes}
                          wrapperClass="bg-yellow-50 border border-yellow-200"
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-sm text-gray-500 italic">
              Không có thông tin y tế
            </div>
          )}

          {visit.nextVisitDate && (
            <div className="bg-blue-50 rounded-lg border border-blue-200 p-3">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-blue-600" />
                <div>
                  <p className="text-xs text-gray-600">Ngày tái khám</p>
                  <p className="text-base font-semibold text-blue-900">
                    {new Date(visit.nextVisitDate).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
            </div>
          )}

          {visit.visitServices && visit.visitServices.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <FileText size={16} className="text-gray-700" /> Dịch vụ khám
              </div>
              {visit.visitServices.map((service) => (
                <div
                  key={service.id}
                  className="bg-gray-50 border border-gray-200 rounded-lg p-3 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-900">
                      {service.medicalService?.name}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatCurrency(service.price)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">
                    {service.medicalService?.description}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600">
                      Số lượng: {service.quantity}{' '}
                      {service.medicalService?.unit}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full ${
                        service.status === 'done'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {service.status === 'done'
                        ? 'Hoàn thành'
                        : 'Đang thực hiện'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-900 font-semibold">
                <FileText size={16} className="text-gray-700" /> Dịch vụ khám
              </div>
              <div className="text-center text-sm text-gray-500 italic">
                Không có dịch vụ khám
              </div>
            </div>
          )}

          {visit.prescriptions?.length ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-purple-900 font-semibold">
                <Receipt size={16} className="text-purple-600" /> Đơn thuốc
              </div>
              {visit.prescriptions.map((pr, idx) => {
                const total =
                  pr.medicineUsages?.reduce(
                    (sum, u) => sum + u.price * u.quantity,
                    0
                  ) || 0;
                return (
                  <div
                    key={pr.id}
                    className="bg-purple-50 border border-purple-200 rounded-lg p-3 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 rounded bg-white text-purple-700 font-semibold">
                          #{idx + 1}
                        </span>
                        <span className="text-gray-600">
                          {pr.createdAt &&
                            new Date(pr.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full ${
                          pr.paid
                            ? 'bg-green-100 text-green-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {pr.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                      </span>
                    </div>
                    <div className="divide-y divide-purple-100">
                      {pr.medicineUsages?.map((u) => (
                        <div
                          key={u.id}
                          className="py-2 flex items-start justify-between gap-3"
                        >
                          <div className="space-y-0.5">
                            <p className="text-sm font-semibold text-gray-900">
                              {u.drugName || u.medicine?.name || 'Thuốc'}
                            </p>
                            {u.medicine?.description && (
                              <p className="text-xs text-gray-500">
                                {u.medicine.description}
                              </p>
                            )}
                            <p className="text-xs text-gray-600">
                              {u.quantity} {u.medicine?.unit || 'đv'}
                            </p>
                            {u.note && (
                              <p className="text-xs text-gray-500">
                                Ghi chú: {u.note}
                              </p>
                            )}
                          </div>
                          <div className="text-right text-sm whitespace-nowrap">
                            <p className="font-semibold text-gray-900">
                              {formatCurrency(u.price * u.quantity)}
                            </p>
                            <p className="text-[11px] text-gray-500">
                              {formatCurrency(u.price)} /{' '}
                              {u.medicine?.unit || 'đv'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="pt-1 flex items-center justify-between text-sm font-semibold text-purple-900">
                      <span>Tổng đơn</span>
                      <span>{formatCurrency(total)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-purple-900 font-semibold">
                <Receipt size={16} className="text-purple-600" /> Đơn thuốc
              </div>
              <div className="text-center text-sm text-gray-500 italic">
                Không có đơn thuốc
              </div>
            </div>
          )}

          <div className="border-t pt-3">
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500">
              <div>
                <span className="font-medium">Mã lịch khám:</span>{' '}
                <span className="font-mono">{visit.id}</span>
              </div>
              <div>
                <span className="font-medium">Cập nhật:</span>{' '}
                {visit.updatedAt &&
                  new Date(visit.updatedAt).toLocaleString('vi-VN')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function InfoCard({
  icon,
  iconBg,
  title,
  content,
  wrapperClass = 'bg-white border border-gray-200',
}: {
  icon: React.ReactNode;
  iconBg: string;
  title: string;
  content: string;
  wrapperClass?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);
  const contentRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      const el = contentRef.current;
      setShowToggle(el.scrollHeight > el.clientHeight);
    }
  }, [content]);

  return (
    <div className={`${wrapperClass} rounded-lg p-3`}>
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-7 h-7 ${iconBg} rounded-md flex items-center justify-center`}
        >
          {icon}
        </div>
        <h4 className="font-semibold text-gray-900 text-sm">{title}</h4>
      </div>

      <p
        ref={contentRef}
        className={`text-gray-700 leading-relaxed text-sm pl-8 ${
          expanded ? '' : 'line-clamp-5'
        }`}
      >
        {content}
      </p>

      {showToggle && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-2 pl-8 text-sm text-blue-600 hover:underline"
        >
          {expanded ? 'Thu gọn' : 'Xem thêm'}
        </button>
      )}
    </div>
  );
}
