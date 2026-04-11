import { MedicalRecordSidebar } from '@src/modules/DetailVisit/components/MedicalRecordSidebar';
import { PatientHeader } from '@src/modules/DetailVisit/components/PatientHeader';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import QUERY_KEY from '@src/api/QueryKey';
import ApiVisit from '@src/api/ApiVisit';
import { formatAge } from '@src/utils/age';
import MedicalRecordForm from '../components/MedicalRecord/MedicalRecordForm';
import { useState } from 'react';
import clsx from 'clsx';
import { useNavigate } from 'react-router-dom';

export default function CreateNewMedicalRecord() {
  const { id: visitId } = useParams();
  const navigate = useNavigate();

  const { data: detailVisit, refetch } = useQuery({
    queryKey: [QUERY_KEY.VISIT.GET_VISIT_DETAIL, 'doctor', visitId],
    queryFn: () => ApiVisit.getVisitDetail(visitId!),
    enabled: !!visitId,
  });

  const [activeTab, setActiveTab] = useState<'new' | 'medicalRecord'>('new');
  const [activeMedicalRecordId, setActiveMedicalRecordId] = useState<
    string | null
  >(null);

  // Refetch data khi chuyển tab để đảm bảo đồng bộ
  const handleTabChange = (tab: 'new' | 'medicalRecord', recordId?: string) => {
    setActiveTab(tab);
    if (recordId) {
      setActiveMedicalRecordId(recordId);
    }
    refetch();
  };

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

  const existingMedicalRecords =
    detailVisit?.medicalRecords?.map((record) => ({
      id: record.id,
      title: record.title,
      isParent: record.isParent,
      doctorName: record.doctor?.staff?.user?.name
        ? `${record.doctor.staff.user.name.firstName} ${record.doctor.staff.user.name.lastName}`
        : 'N/A',
      time: new Date(record.createdAt).toLocaleString(),
      isActive: false,
    })) || [];

  const selectedMedicalRecord = detailVisit?.medicalRecords?.find(
    (record) => record.id === activeMedicalRecordId
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Patient Header */}
      <PatientHeader {...patientData} />

      {/* Main Content - 3 Column Layout */}
      <div className="flex flex-1">
        {/* Left Sidebar - 20% */}
        <div className="w-1/5 flex flex-col bg-white border-r border-gray-200 overflow-y-auto">
          <MedicalRecordSidebar
            onSelectRecord={(id: string) => {
              handleTabChange('medicalRecord', id);
            }}
            records={existingMedicalRecords}
          />
          <div
            onClick={() => handleTabChange('new')}
            className={clsx(
              'p-6 border-y border-gray-200 font-medium cursor-pointer bg-white hover:bg-blue-50',
              { '!bg-blue-100 text-blue-700': activeTab === 'new' }
            )}
          >
            Bản khám mới
          </div>
        </div>

        {/* Center Content - 60% */}
        <div className="w-full p-8">
          <MedicalRecordForm
            key={
              activeTab === 'new'
                ? 'new-record'
                : `view-record-${activeMedicalRecordId}`
            }
            mode={activeTab === 'new' ? 'create' : 'view'}
            visitId={visitId!}
            initData={
              activeTab === 'new'
                ? {
                    diagnosisRecord: null,
                    prescriptions: detailVisit?.prescriptions || [],
                    visitServices: detailVisit?.visitServices || [],
                  }
                : selectedMedicalRecord
                  ? {
                      diagnosisRecord: selectedMedicalRecord,
                      prescriptions: detailVisit?.prescriptions || [],
                      visitServices: detailVisit?.visitServices || [],
                    }
                  : null
            }
            onSaveSuccess={() => navigate('/doctor/visits/' + visitId)}
          />
        </div>
      </div>
    </div>
  );
}
