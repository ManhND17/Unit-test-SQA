import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import ApiAppointment, {
  AppointmentResponseDto,
} from '@src/api/ApiAppointment';
import Badge from '@src/components/CommonBadge';
import {
  endOfDayISO,
  formatDateTimeFromIso,
  startOfDayISO,
} from '@src/utils/datetime';
import { mapAppointmentStatus } from '@src/utils/mapStatus';
import { EAppointmentStatus } from '@src/types';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  patientId?: string | number;
  doctorId?: string | number;
  days?: number; // how many days ahead, default 7
  defaultLimit?: number; // how many to show initially
  onOpenDetail?: (appointment: AppointmentResponseDto) => void;
  applyRole?: 'patient' | 'doctor' | 'admin';
}

export default function UpcomingAppointmentsList({
  patientId,
  doctorId,
  days = 7,
  defaultLimit = 5,
  onOpenDetail,
  applyRole,
}: Props) {
  const fromDate = startOfDayISO(new Date())!;
  const toDateObj = new Date();
  toDateObj.setDate(toDateObj.getDate() + days);
  const toDate = endOfDayISO(toDateObj)!;

  const queryKey = [
    'appointments',
    'upcoming',
    patientId || '',
    doctorId || '',
    days,
  ];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      ApiAppointment.getListAppointments({
        page: 1,
        limit: 100,
        fromDate,
        toDate,
        ...(patientId ? { patientId: String(patientId) } : {}),
        ...(doctorId ? { doctorId: String(doctorId) } : {}),
      }),
    staleTime: 60 * 1000, // 1 minute
  });

  const appointments: AppointmentResponseDto[] = useMemo(
    () => data?.data || [],
    [data?.data]
  );

  const uniqueAppointments = useMemo(() => {
    const map = new Map<string, AppointmentResponseDto>();
    appointments.forEach((a) => {
      if (!map.has(a.id)) map.set(a.id, a);
    });
    return Array.from(map.values()).sort(
      (x, y) =>
        new Date(x.startTime).getTime() - new Date(y.startTime).getTime()
    );
  }, [appointments]);

  const [showAll, setShowAll] = useState(false);
  const visibleAppointments = showAll
    ? uniqueAppointments
    : uniqueAppointments.slice(0, defaultLimit);

  return (
    <div className="mt-12">
      <h3 className="text-lg font-semibold mb-4">
        Danh sách lịch hẹn trong {days} ngày tới của{' '}
        {applyRole === 'patient'
          ? 'bệnh nhân'
          : applyRole === 'doctor'
            ? 'bác sĩ'
            : 'các bệnh nhân'}
      </h3>
      {isLoading ? (
        <div>Đang tải...</div>
      ) : uniqueAppointments.length === 0 ? (
        <div className="text-gray-500">
          Không có lịch hẹn nào trong {days} ngày tới.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleAppointments.map((a) => (
              <div
                key={a.id}
                className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold text-sm line-clamp-1">
                      {a.doctor ? a.doctor.name : a.patient?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {a.medicalService?.name || '-'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatDateTimeFromIso(a.startTime) || '-'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {a.schedule?.room || ''}
                    </p>
                  </div>
                </div>

                <p className="text-sm mb-2">
                  Lý do:{' '}
                  <span className="text-gray-700">{a.reason || '-'}</span>
                </p>

                <div className="flex items-center justify-between">
                  <Badge
                    variant={
                      mapAppointmentStatus(a.status as EAppointmentStatus)
                        .variant
                    }
                  >
                    {mapAppointmentStatus(a.status as EAppointmentStatus).label}
                  </Badge>
                  <button
                    className="text-sm text-blue-600 hover:underline"
                    onClick={() => {
                      if (onOpenDetail) onOpenDetail(a);
                      else
                        window.dispatchEvent(
                          new CustomEvent('open-appointment-detail', {
                            detail: a,
                          })
                        );
                    }}
                  >
                    Xem chi tiết
                  </button>
                </div>
              </div>
            ))}
          </div>
          {!isLoading && appointments.length > defaultLimit && (
            <div className="mt-4 flex justify-center">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center gap-2 hover:bg-blue-700 transition"
                onClick={() => setShowAll((s) => !s)}
              >
                {showAll ? (
                  <>
                    Thu gọn <ChevronUp />
                  </>
                ) : (
                  <>
                    Xem thêm <ChevronDown />
                  </>
                )}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
