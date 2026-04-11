import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import QUERY_KEY from '@src/api/QueryKey';
import { useParams } from 'react-router-dom';
import ApiVisit from '@src/api/ApiVisit';
import { formatAge } from '@src/utils/age';
import { useEffect, useState } from 'react';
import { Calendar, Edit2, Trash, CheckCircle } from 'lucide-react';
import clsx from 'clsx';
import { PatientHeader } from '@src/modules/DetailVisit/components/PatientHeader';
import { MedicalRecordSidebar } from '@src/modules/DetailVisit/components/MedicalRecordSidebar';
import MedicalRecordForm from '../components/MedicalRecord/MedicalRecordForm';
import { MedicineTab } from '@src/modules/DetailVisit/components/MedicineTab';
import { toast } from 'react-toastify';
import CommonModal from '@src/components/Modal';
import DatePicker from '@src/components/DatePicker';
import { EVisitStatus } from '@src/types';

export default function DetailVisitDoctorPage() {
  const { id: visitId } = useParams();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'diagnosis' | 'medications'>(
    'diagnosis'
  );
  const [activeMedicalRecordId, setActiveMedicalRecordId] = useState<
    string | null
  >(null);
  const [isNextVisitModalOpen, setIsNextVisitModalOpen] = useState(false);
  const [selectedNextVisitDate, setSelectedNextVisitDate] =
    useState<Date | null>(null);
  const { data: detailVisit } = useQuery({
    queryKey: [QUERY_KEY.VISIT.GET_VISIT_DETAIL, 'doctor', visitId],
    queryFn: () => ApiVisit.getVisitDetail(visitId!),
    enabled: !!visitId,
  });

  const updateNextVisitDateMutation = useMutation({
    mutationFn: (date: string | null) =>
      ApiVisit.updateVisitNextVisitDate(visitId!, date),
    onSuccess: () => {
      toast.success('Cập nhật lịch tái khám thành công');
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.VISIT.GET_VISIT_DETAIL, 'doctor', visitId],
      });
      setIsNextVisitModalOpen(false);
    },
    onError: () => {
      toast.error('Cập nhật lịch tái khám thất bại');
    },
  });

  const completeVisitMutation = useMutation({
    mutationFn: () =>
      ApiVisit.updateVisitStatus(visitId!, EVisitStatus.COMPLETED),
    onSuccess: () => {
      toast.success('Kết thúc khám thành công');
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.VISIT.GET_VISIT_DETAIL, 'doctor', visitId],
      });
    },
    onError: () => {
      toast.error('Kết thúc khám thất bại');
    },
  });

  useEffect(() => {
    if (detailVisit?.medicalRecords && detailVisit.medicalRecords.length > 0) {
      setActiveMedicalRecordId(detailVisit.medicalRecords[0].id);
    }
  }, [detailVisit]);

  useEffect(() => {
    if (detailVisit?.nextVisitDate) {
      setSelectedNextVisitDate(new Date(detailVisit.nextVisitDate));
    }
  }, [detailVisit?.nextVisitDate]);

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
    ? new Date(detailVisit.nextVisitDate).toLocaleString()
    : null;

  const handleOpenTabPrescription = () => {
    setActiveTab('medications');
    setActiveMedicalRecordId(null);
  };

  const handleSelectMedicalRecord = (recordId: string) => {
    setActiveMedicalRecordId(recordId);
    setActiveTab('diagnosis');
  };

  const handleOpenNextVisitModal = () => {
    setIsNextVisitModalOpen(true);
  };

  const handleSaveNextVisitDate = () => {
    if (selectedNextVisitDate) {
      updateNextVisitDateMutation.mutate(selectedNextVisitDate.toISOString());
    }
  };

  const handleClearNextVisitDate = () => {
    updateNextVisitDateMutation.mutate(null);
  };

  const handleCompleteVisit = () => {
    if (window.confirm('Bạn có chắc chắn muốn kết thúc khám?')) {
      completeVisitMutation.mutate();
    }
  };

  const selectedMedicalRecord = detailVisit?.medicalRecords?.find(
    (record) => record.id === activeMedicalRecordId
  );

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
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenNextVisitModal}
                    className="p-2 hover:bg-green-100 rounded-full transition-colors"
                    title="Chọn lịch tái khám"
                  >
                    <Edit2 className="h-4 w-4 text-green-600" />
                  </button>
                  <button
                    onClick={handleClearNextVisitDate}
                    className="p-2 hover:bg-green-100 rounded-full transition-colors"
                    title="Xoá lịch tái khám"
                  >
                    <Trash className="h-4 w-4 text-red-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Nút Kết thúc khám */}
          {detailVisit?.status !== EVisitStatus.COMPLETED && (
            <div className="p-6 border-b border-gray-200 bg-white">
              <button
                onClick={handleCompleteVisit}
                disabled={completeVisitMutation.isPending}
                className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <CheckCircle className="h-5 w-5" />
                {completeVisitMutation.isPending
                  ? 'Đang xử lý...'
                  : 'Kết thúc khám'}
              </button>
            </div>
          )}
        </div>

        {/* Center Content - 60% */}
        <div className="w-4/5 overflow-y-auto p-8">
          <div className="w-full">
            {activeTab === 'diagnosis' ? (
              <MedicalRecordForm
                mode="view"
                visitId={visitId!}
                initData={
                  selectedMedicalRecord
                    ? {
                        diagnosisRecord: selectedMedicalRecord,
                        prescriptions: detailVisit?.prescriptions || [],
                        visitServices: detailVisit?.visitServices || [],
                      }
                    : null
                }
              />
            ) : (
              <MedicineTab prescriptions={detailVisit?.prescriptions || []} />
            )}
          </div>
        </div>
      </div>

      {/* Next Visit Date Modal */}
      <CommonModal
        open={isNextVisitModalOpen}
        onClose={() => setIsNextVisitModalOpen(false)}
        title="Chọn Lịch Tái Khám"
      >
        <div className="py-4">
          <DatePicker
            value={
              selectedNextVisitDate?.toISOString() || new Date().toISOString()
            }
            onChange={(selected) => {
              if (selected) {
                setSelectedNextVisitDate(selected.toDate());
              }
            }}
            config={{
              minDate: new Date().toISOString(),
            }}
            enableTime={true}
          />
          <div className="flex justify-end gap-4 mt-6">
            <button
              onClick={() => setIsNextVisitModalOpen(false)}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSaveNextVisitDate}
              disabled={
                !selectedNextVisitDate || updateNextVisitDateMutation.isPending
              }
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Lưu
            </button>
          </div>
        </div>
      </CommonModal>
    </div>
  );
}
