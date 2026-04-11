import { PatientHeader } from './components/PatientHeader';
import { useQuery } from '@tanstack/react-query';
import QUERY_KEY from '@src/api/QueryKey';
import { useParams } from 'react-router-dom';
import ApiVisit from '@src/api/ApiVisit';
import { formatAge } from '@src/utils/age';
import { MedicalRecordSidebar } from './components/MedicalRecordSidebar';
import { useEffect, useState } from 'react';
import { MedicineTab } from './components/MedicineTab';
import DetailMedicalRecord from './components/DetailMedicalRecord';
import { Calendar } from 'lucide-react';
import clsx from 'clsx';

export default function DetailVisit() {
  const { id: visitId } = useParams();
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'medications'>(
    'diagnosis'
  );
  const [activeMedicalRecordId, setActiveMedicalRecordId] = useState<
    string | null
  >(null);
  const { data: detailVisit } = useQuery({
    queryKey: [QUERY_KEY.VISIT.GET_VISIT_DETAIL, 'doctor', visitId],
    queryFn: () => ApiVisit.getVisitDetail(visitId!),
    enabled: !!visitId,
  });

  useEffect(() => {
    if (detailVisit?.medicalRecords && detailVisit.medicalRecords.length > 0) {
      setActiveMedicalRecordId(detailVisit.medicalRecords[0].id);
    }
  }, [detailVisit]);

  const user = detailVisit?.ehr?.patient?.user;
  const patientData = {
    patientName: user
      ? `${user.name?.firstName} ${user.name?.lastName}`
      : 'N/A',
    gender: user ? (user.gender === 'female' ? 'Nữ' : 'Nam') : 'N/A',
    age: user?.birthday ? formatAge(user.birthday) : 'N/A',
    status: detailVisit ? detailVisit.status : 'N/A',
    startTime: detailVisit
      ? new Date(detailVisit.startTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'N/A',
    endTime: detailVisit?.endTime
      ? new Date(detailVisit.endTime).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'N/A',
  };
  const medicalRecords =
    detailVisit?.medicalRecords?.map((record) => ({
      id: record.id,
      title: record.title,
      isParent: record.isParent,
      doctorName: record.doctor?.staff?.user?.name
        ? `${record.doctor.staff.user.name.firstName} ${record.doctor.staff.user.name.lastName}`
        : 'N/A',
      time: new Date(record.createdAt).toLocaleString(),
      isActive: record.id === activeMedicalRecordId,
    })) || [];

  const nextVisitTime = detailVisit?.nextVisitDate
    ? new Date(detailVisit.nextVisitDate).toLocaleDateString()
    : null;

  const handleOpenTabPrescription = () => {
    setActiveTab('medications');
    setActiveMedicalRecordId(null);
  };

  const handleSelectMedicalRecord = (recordId: string) => {
    setActiveMedicalRecordId(recordId);
    setActiveTab('diagnosis');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Patient Header */}
      <PatientHeader {...patientData} />

      {/* Main Content - 3 Column Layout */}
      <div className="flex-1 flex">
        {/* Left Sidebar - 20% */}
        <div className="w-1/5 flex flex-col bg-white border-r border-gray-200 overflow-y-auto">
          <MedicalRecordSidebar
            onSelectRecord={handleSelectMedicalRecord}
            records={medicalRecords}
          />
          <div
            onClick={handleOpenTabPrescription}
            className={clsx(
              'p-6 border-y border-gray-200 font-medium cursor-pointer bg-white hover:bg-blue-50',
              { '!bg-blue-100': activeTab === 'medications' }
            )}
          >
            Kê đơn thuốc
          </div>

          <div className="p-6 border-b border-gray-200 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-green-600" />
              Lịch Tái Khám
            </h3>
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-gray-900">
                  {nextVisitTime || 'Chưa có lịch'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Center Content - 60% */}
        <div className="w-4/5 overflow-y-auto p-8">
          <div className="w-full">
            {activeTab === 'medications' ? (
              <MedicineTab prescriptions={detailVisit?.prescriptions || []} />
            ) : activeTab === 'diagnosis' && activeMedicalRecordId ? (
              <DetailMedicalRecord
                data={detailVisit?.medicalRecords?.find(
                  (record) => record.id === activeMedicalRecordId
                )}
              />
            ) : (
              <p className="text-xl">
                Vui lòng chọn hồ sơ khám để xem chi tiết chẩn đoán.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
