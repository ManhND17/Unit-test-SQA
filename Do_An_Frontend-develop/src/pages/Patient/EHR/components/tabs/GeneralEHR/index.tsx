import DefaultAvatar from '@assets/images/default-avatar.jpg';
import { IRootState } from '@src/redux/store';
import { mapAddress, mapGender } from '@src/utils/mapValue';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import UpcomingAppointmentsList from '@src/components/UpcomingAppointmentsList';
import ModalDetailAppointment from '@pages/Admin/Appointment/components/ModalDetailAppointment';

interface IGeneralEHRProps {
  setActiveTab: (tab: number) => void;
}

export default function GeneralEHR({ setActiveTab }: IGeneralEHRProps) {
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const { patient } = useSelector((state: IRootState) => state.patient);

  return (
    <div>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-2 lg:p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Thông tin bệnh nhân
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl">
                <img
                  src={DefaultAvatar}
                  alt="Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">Bệnh nhân</p>
                <h2 className="text-lg font-semibold text-gray-900">
                  {patient?.user?.name?.firstName ||
                  patient?.user?.name?.lastName
                    ? patient?.user?.name?.firstName +
                      ' ' +
                      patient?.user?.name?.lastName
                    : '......'}
                </h2>
                <p className="text-sm text-gray-600">
                  Mã BN:{' '}
                  <span className="font-medium text-gray-900">
                    {patient?.patientId || '......'}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500">Ngày sinh</p>
              <p className="text-sm break-word font-medium text-gray-900">
                {patient?.user?.birthday
                  ? new Date(patient?.user?.birthday).toLocaleDateString(
                      'vi-VN'
                    )
                  : '____/__/____'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Giới tính</p>
              <p className="text-sm break-words font-medium text-gray-900">
                {mapGender(patient?.user?.gender)}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Số điện thoại</p>
              <p className="text-sm break-words font-medium text-gray-900">
                {patient?.user?.phone || '......'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm break-words font-medium text-gray-900">
                {patient?.user?.email || '......'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">BHYT</p>
              <p className="text-sm break-words font-medium text-gray-900">
                {patient?.healthInsurances?.[0]?.insuranceId || '......'}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Địa chỉ</p>
              <p className="text-sm break-words font-medium text-gray-900">
                {mapAddress(patient?.user?.address)}
              </p>
            </div>
          </div>
        </div>
      </div>
      <UpcomingAppointmentsList
        patientId={patient?.userId || ''}
        days={7}
        defaultLimit={5}
        onOpenDetail={(a) => {
          setSelectedAppointment(a);
          setOpenDetailModal(true);
        }}
        applyRole="patient"
      />
      <ModalDetailAppointment
        open={openDetailModal}
        onClose={() => setOpenDetailModal(false)}
        appointment={selectedAppointment}
      />
    </div>
  );
}
