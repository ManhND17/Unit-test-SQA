import { IMedicalRecord, IPrescription, IVisitService } from '@src/types';
import { DiagnosisTab, DiagnosisTabRef } from './components/DisagnosisTab';
import {
  PrescriptionTab,
  PrescriptionTabRef,
} from './components/PrescriptionTab';
import { useEffect, useState, useRef } from 'react';
import { Save, Loader, Edit2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { useQueryClient } from '@tanstack/react-query';
import QUERY_KEY from '@src/api/QueryKey';

interface IMedicalRecordProps {
  mode: 'view' | 'edit' | 'create';
  visitId: string;
  initData: {
    diagnosisRecord: IMedicalRecord | null;
    prescriptions: IPrescription[];
    visitServices: IVisitService[];
  } | null;
  onSaveSuccess?: () => void;
}

export default function MedicalRecordForm({
  mode,
  visitId,
  initData,
  onSaveSuccess,
}: IMedicalRecordProps) {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('symptoms');
  const [isSaving, setIsSaving] = useState(false);
  const [titleError, setTitleError] = useState<string | undefined>();

  const [viewMode, setViewMode] = useState(mode);

  useEffect(() => {
    setViewMode(mode);
  }, [mode]);

  const diagnosisTabRef = useRef<DiagnosisTabRef>(null);
  const prescriptionTabRef = useRef<PrescriptionTabRef>(null);

  const initPrescriptionsData = initData ? initData.prescriptions : [];
  const initDiagnosisData = initData ? initData.diagnosisRecord : null;
  const initVisitServicesData = initData ? initData.visitServices : [];

  const [title, setTitle] = useState(
    initDiagnosisData ? initDiagnosisData.title : ''
  );

  useEffect(() => {
    setTitle(initDiagnosisData ? initDiagnosisData.title : '');
    setTitleError(undefined);
  }, [initDiagnosisData]);

  // Validate title
  const validateTitle = (): boolean => {
    if (!title.trim()) {
      setTitleError('Tiêu đề là bắt buộc');
      return false;
    }
    setTitleError(undefined);
    return true;
  };

  // Handle save all
  const handleSave = async () => {
    // Validate title first
    if (!validateTitle()) {
      toast.error('Vui lòng nhập tiêu đề bản khám');
      return;
    }

    setIsSaving(true);

    try {
      // Save diagnosis (medical record) first
      const diagnosisResult = await diagnosisTabRef.current?.save();

      if (!diagnosisResult) {
        setIsSaving(false);
        return;
      }

      // Save prescriptions
      const prescriptionResult = await prescriptionTabRef.current?.save();

      if (prescriptionResult === false) {
        setIsSaving(false);
        return;
      }

      // Invalidate queries to refetch data
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.VISIT.GET_VISIT_DETAIL],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.MEDICAL_RECORD.GET_MEDICAL_RECORDS_BY_VISIT],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.PRESCRIPTION.GET_PRESCRIPTIONS_BY_VISIT],
      });

      setViewMode('view');

      onSaveSuccess?.();
    } catch {
      toast.error('Lưu bản khám thất bại. Vui lòng thử lại.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChildSaveSuccess = () => {
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEY.VISIT.GET_VISIT_DETAIL, 'doctor', visitId],
    });
  };

  const handleClickButton = () => {
    if (viewMode === 'view') {
      setViewMode('edit');
      return;
    }
    handleSave();
  };

  return (
    <div className="w-full">
      {/* Header with Save Button */}
      <div className="flex justify-end mb-4">
        <button
          onClick={handleClickButton}
          disabled={isSaving}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              Đang lưu...
            </>
          ) : viewMode === 'view' ? (
            <>
              <Edit2 className="w-4 h-4 mr-2" /> Chỉnh sửa bản khám
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" /> Lưu bản khám
            </>
          )}
        </button>
      </div>

      {/* Title Input */}
      <div className="flex flex-col gap-3 mb-6">
        <label className="text-sm font-medium text-gray-900">
          Tiêu đề (Title) <span className="text-red-500">*</span>
        </label>
        <textarea
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (titleError) setTitleError(undefined);
          }}
          className={`p-3 rounded-lg focus-ring-2 focus:ring-blue-500 border resize-none ${titleError ? 'border-red-500' : 'border-gray-300'}`}
          placeholder="Nhập tiêu đề bản khám..."
          rows={1}
          disabled={viewMode === 'view'}
        />
        {titleError && (
          <span className="text-red-500 text-sm">{titleError}</span>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('symptoms')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'symptoms' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            aria-current={activeTab === 'symptoms' ? 'page' : undefined}
          >
            Chẩn Đoán
          </button>
          <button
            onClick={() => setActiveTab('medications')}
            className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === 'medications' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            aria-current={activeTab === 'medications' ? 'page' : undefined}
          >
            Đơn Thuốc
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <div className={activeTab === 'symptoms' ? 'block' : 'hidden'}>
          <DiagnosisTab
            ref={diagnosisTabRef}
            initData={{
              diagnosis: initDiagnosisData,
              visitServices: initVisitServicesData,
            }}
            initMode={viewMode}
            visitId={visitId}
            title={title}
            onSaveSuccess={handleChildSaveSuccess}
          />
        </div>
        <div className={activeTab === 'medications' ? 'block' : 'hidden'}>
          <PrescriptionTab
            ref={prescriptionTabRef}
            initData={initPrescriptionsData}
            initMode={viewMode}
            visitId={visitId}
            onSaveSuccess={handleChildSaveSuccess}
          />
        </div>
      </div>
    </div>
  );
}
