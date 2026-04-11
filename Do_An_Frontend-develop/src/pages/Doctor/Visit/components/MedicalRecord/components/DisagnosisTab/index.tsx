import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  EVisitServiceStatus,
  IFileAsset,
  IMedicalRecord,
  IVisitService,
} from '@src/types';

import {
  Upload,
  Plus,
  File as FileIcon,
  X,
  Image as ImageIcon,
  Pencil,
} from 'lucide-react';
import {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import { AddEditServiceModal } from '../ModalAddService';
import { ImageViewerModal } from '@src/components/ImageViewerModal';
import { useMutation } from '@tanstack/react-query';
import ApiMedicalRecord, {
  CreateMedicalRecordPayload,
  CreateVisitServicePayload,
  UpdateMedicalRecordPayload,
  UpdateVisitServicePayload,
} from '@src/api/ApiMedicalRecord';
import { toast } from 'react-toastify';
import Badge from '@src/components/CommonBadge';
import { mapVisitServiceStatus } from '@src/utils/mapStatus';
import CommonModal from '@src/components/Modal';

interface DiagnosisTabProps {
  initData: {
    diagnosis: IMedicalRecord | null;
    visitServices: IVisitService[];
  };
  initMode: 'view' | 'edit' | 'create';
  visitId: string;
  title: string;
  onSaveSuccess?: (medicalRecord: IMedicalRecord) => void;
}

type AddedFile = {
  id: string;
  name: string;
  size: string;
  time: string;
  url: string;
  type: 'image' | 'document';
  mimeType: string;
  file: File;
};

export interface DiagnosisTabRef {
  save: () => Promise<IMedicalRecord | null>;
  validate: () => boolean;
  getData: () => {
    symptoms: string;
    diagnosis: string;
    treatments: string;
    notes: string;
    services: Partial<IVisitService>[];
    files: IFileAsset[];
    addedFiles: AddedFile[];
  };
}

export const DiagnosisTab = forwardRef<DiagnosisTabRef, DiagnosisTabProps>(
  ({ initData, initMode, visitId, title, onSaveSuccess }, ref) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [mode, setMode] = useState<'view' | 'edit' | 'create'>(initMode);
    const [diagnosis, setDiagnosis] = useState<string>(
      initData.diagnosis ? initData.diagnosis?.diagnosis : ''
    );
    const [symptoms, setSymptoms] = useState<string>(
      initData.diagnosis ? initData.diagnosis?.symptoms : ''
    );
    const [treatments, setTreatments] = useState<string>(
      initData.diagnosis ? initData.diagnosis?.treatments : ''
    );
    const [notes, setNotes] = useState<string>(
      initData.diagnosis ? initData.diagnosis?.notes || '' : ''
    );
    const [services, setServices] = useState<Partial<IVisitService>[]>(
      initData.visitServices || []
    );
    const [files, setFiles] = useState<IFileAsset[]>(
      initData.diagnosis?.fileAssets || []
    );
    const [addedFiles, setAddedFiles] = useState<AddedFile[]>([]);
    const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
    const [selectedService, setSelectedService] =
      useState<Partial<IVisitService> | null>(null);
    const [isConfirmDeleteServiceOpen, setIsConfirmDeleteServiceOpen] =
      useState(false);

    const [errors, setErrors] = useState<{
      symptoms?: string;
      diagnosis?: string;
      treatments?: string;
    }>({});

    // Chỉ reset state khi visitId thay đổi (khi chuyển sang visit khác)
    // Không reset khi chỉ chuyển tab để tránh mất dữ liệu đang nhập
    const prevVisitIdRef = useRef<string | null>(null);
    const prevDiagnosisIdRef = useRef<string | null>(null);

    // Sync mode with initMode when prop changes
    useEffect(() => {
      setMode(initMode);
    }, [initMode]);

    useEffect(() => {
      const currentDiagnosisId = initData.diagnosis?.id || null;
      const shouldUpdate =
        prevVisitIdRef.current === null || // Lần đầu load
        prevVisitIdRef.current !== visitId || // Chuyển visit khác
        prevDiagnosisIdRef.current !== currentDiagnosisId; // InitData thay đổi

      if (shouldUpdate) {
        setMode(initMode);
        setDiagnosis(initData.diagnosis ? initData.diagnosis.diagnosis : '');
        setSymptoms(initData.diagnosis ? initData.diagnosis.symptoms : '');
        setTreatments(initData.diagnosis ? initData.diagnosis.treatments : '');
        setNotes(initData.diagnosis?.notes || '');
        setServices(initData.visitServices || []);
        setFiles(initData.diagnosis?.fileAssets || []);
        setAddedFiles([]);
        setErrors({});
        prevVisitIdRef.current = visitId;
        prevDiagnosisIdRef.current = currentDiagnosisId;
      }
    }, [visitId, initData, initMode]);

    const createMedicalRecordMutation = useMutation({
      mutationFn: (payload: CreateMedicalRecordPayload) =>
        ApiMedicalRecord.createMedicalRecord(payload),
      onSuccess: (data) => {
        toast.success('Tạo bản khám thành công');
        onSaveSuccess?.(data);
      },
      onError: () => {
        toast.error('Tạo bản khám thất bại. Vui lòng thử lại.');
      },
    });

    const updateMedicalRecordMutation = useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: UpdateMedicalRecordPayload;
      }) => ApiMedicalRecord.updateMedicalRecord(id, payload),
      onSuccess: (data) => {
        toast.success('Cập nhật bản khám thành công');
        onSaveSuccess?.(data);
      },
      onError: () => {
        toast.error('Cập nhật bản khám thất bại. Vui lòng thử lại.');
      },
    });

    const createVisitServicesMutation = useMutation({
      mutationFn: ({
        visitId,
        services,
      }: {
        visitId: string;
        services: { medicalServiceId: string; quantity?: number }[];
      }) => {
        const payload = {
          items: services.map((s) => ({
            visitId,
            medicalServiceId: s.medicalServiceId,
            quantity: s.quantity || 1,
          })),
        };
        return ApiMedicalRecord.createVisitServices(payload);
      },
    });

    const deleteFileAssetMutation = useMutation({
      mutationFn: (fileId: string) => ApiMedicalRecord.deleteFileAsset(fileId),
      onError: () => {
        toast.error('Xoá file thất bại. Vui lòng thử lại.');
      },
      onSuccess: (_, id) => {
        toast.success('Xoá file thành công');
        setFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
      },
    });

    const addVisitServiceMutation = useMutation({
      mutationFn: (payload: CreateVisitServicePayload) =>
        ApiMedicalRecord.createVisitService(payload),
      onSuccess: (data) => {
        toast.success('Thêm dịch vụ thành công');
        setServices((prevServices) => [...prevServices, data]);
      },
      onError: () => {
        toast.error('Thêm dịch vụ thất bại. Vui lòng thử lại.');
      },
    });

    const deleteVisitServiceMutation = useMutation({
      mutationFn: (id: string) => ApiMedicalRecord.deleteVisitService(id),
      onError: () => {
        toast.error('Xoá dịch vụ thất bại. Vui lòng thử lại.');
      },
      onSuccess: (_, id) => {
        toast.success('Xoá dịch vụ thành công');
        setServices((prevServices) =>
          prevServices.filter((service) => service.id !== id)
        );
      },
    });

    const updateVisitServiceMutation = useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: UpdateVisitServicePayload;
      }) => ApiMedicalRecord.updateVisitService(id, payload),
      onError: () => {
        toast.error('Cập nhật dịch vụ thất bại. Vui lòng thử lại.');
      },
      onSuccess: (_, variable) => {
        toast.success('Cập nhật dịch vụ thành công');
        setServices((prevServices) =>
          prevServices.map((service) =>
            service.id === variable.id
              ? { ...service, ...variable.payload }
              : service
          )
        );
      },
    });

    // Validation
    const validate = (): boolean => {
      const newErrors: {
        symptoms?: string;
        diagnosis?: string;
        treatments?: string;
      } = {};

      if (!symptoms.trim()) {
        newErrors.symptoms = 'Triệu chứng là bắt buộc';
      }
      if (!diagnosis.trim()) {
        newErrors.diagnosis = 'Chẩn đoán là bắt buộc';
      }
      if (!treatments.trim()) {
        newErrors.treatments = 'Phương pháp điều trị là bắt buộc';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    // Save handler
    const handleSave = async (): Promise<IMedicalRecord | null> => {
      if (!validate()) {
        toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
        return null;
      }

      try {
        // Create or update medical record
        const payload = {
          visitId,
          title,
          symptoms,
          diagnosis,
          treatments,
          notes,
          fileIds: [...files.map((f) => f.id)],
          files: [] as File[],
        };

        if (addedFiles.length > 0) {
          payload.files = addedFiles.map((f) => f.file);
        }

        let result: IMedicalRecord;

        if (mode === 'create') {
          result = await createMedicalRecordMutation.mutateAsync(payload);
        } else {
          const recordId = initData.diagnosis?.id;
          if (!recordId) {
            toast.error('Không tìm thấy bản khám để cập nhật');
            return null;
          }
          result = await updateMedicalRecordMutation.mutateAsync({
            id: recordId,
            payload,
          });
        }

        // Create visit services for new services
        const newServices = services.filter(
          (s) => !initData.visitServices.some((vs) => vs.id === s.id)
        );
        if (newServices.length > 0) {
          await createVisitServicesMutation.mutateAsync({
            visitId,
            services: newServices.map((s) => ({
              medicalServiceId: s.medicalServiceId!,
              quantity: s.quantity || 1,
            })),
          });
        }

        return result;
      } catch {
        return null;
      }
    };

    // Expose methods via ref
    useImperativeHandle(ref, () => ({
      save: handleSave,
      validate,
      getData: () => ({
        symptoms,
        diagnosis,
        treatments,
        notes,
        services,
        files,
        addedFiles,
      }),
    }));

    // Image Viewer State
    const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const imageFiles = [
      ...files
        .filter((file) => file.fileType.includes('image'))
        .map((file) => ({
          id: file.id,
          url: file.url,
          name: file.name || 'Tên file không xác định',
        })),
      ...addedFiles
        .filter((file) => file.type.includes('image'))
        .map((file) => ({
          id: file.id,
          url: file.url,
          name: file.name,
        })),
    ];
    const handleDeleteFile = (id: string) => {
      deleteFileAssetMutation.mutate(id);
    };
    const handleDeleteAddedFile = (id: string) => {
      setAddedFiles((prevFiles) => prevFiles.filter((file) => file.id !== id));
    };
    const handleFileSelect = (selectedFiles: FileList | null) => {
      if (!selectedFiles) return;
      Array.from(selectedFiles).forEach((file) => {
        const newFile: AddedFile = {
          id: Date.now().toString() + Math.random(),
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(2) + ' MB',
          time: new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          url: URL.createObjectURL(file),
          type: file.type.startsWith('image/') ? 'image' : 'document',
          mimeType: file.type,
          file: file,
        };
        setAddedFiles((prev) => [...prev, newFile]);
      });
    };
    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(true);
    };
    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
    };
    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileSelect(e.dataTransfer.files);
    };
    const handleFileClick = (fileId: string) => {
      const allImageFiles = imageFiles;
      const index = allImageFiles.findIndex((file) => file.id === fileId);
      if (index !== -1) {
        setSelectedImageIndex(index);
        setIsImageViewerOpen(true);
      }
    };

    return (
      <div className="flex gap-6">
        {/* Main Content - Left (70%) */}
        <div className="flex-1 space-y-6 pr-2">
          {/* Symptoms */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-900">
              Triệu chứng (Symptoms) <span className="text-red-500">*</span>
            </label>
            <textarea
              value={symptoms}
              onChange={(e) => {
                setSymptoms(e.target.value);
                if (errors.symptoms)
                  setErrors((prev) => ({ ...prev, symptoms: undefined }));
              }}
              className={`p-3 rounded-lg focus-ring-2 focus:ring-blue-500 border resize-none min-h-[80px] ${errors.symptoms ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Mô tả triệu chứng bệnh nhân..."
              rows={4}
              disabled={mode === 'view'}
            />
            {errors.symptoms && (
              <span className="text-red-500 text-sm">{errors.symptoms}</span>
            )}
          </div>

          {/* Diagnosis */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-900">
              Chẩn đoán (Diagnosis) <span className="text-red-500">*</span>
            </label>
            <textarea
              value={diagnosis}
              onChange={(e) => {
                setDiagnosis(e.target.value);
                if (errors.diagnosis)
                  setErrors((prev) => ({ ...prev, diagnosis: undefined }));
              }}
              className={`p-3 rounded-lg focus-ring-2 focus:ring-blue-500 border resize-none min-h-[80px] ${errors.diagnosis ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Mô tả chẩn đoán..."
              rows={4}
              disabled={mode === 'view'}
            />
            {errors.diagnosis && (
              <span className="text-red-500 text-sm">{errors.diagnosis}</span>
            )}
          </div>

          {/* Treatments */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-900">
              Hướng điều trị (Treatments){' '}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              value={treatments}
              onChange={(e) => setTreatments(e.target.value)}
              className="p-3 rounded-lg focus-ring-2 focus:ring-blue-500 border border-gray-300 resize-none min-h-[80px]"
              placeholder="Mô tả hướng điều trị..."
              rows={4}
              disabled={mode === 'view'}
            />
          </div>

          {/* Notes */}
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-900">
              Ghi chú (Notes)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="p-3 rounded-lg focus-ring-2 focus:ring-blue-500 border border-gray-300 resize-none min-h-[80px]"
              placeholder="Ghi chú thêm..."
              rows={4}
              disabled={mode === 'view'}
            />
          </div>

          {/* Service Indication */}
          <div className="space-y-3 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Chỉ định dịch vụ</h4>
              <button
                disabled={mode === 'view'}
                onClick={() => setIsAddServiceModalOpen(true)}
                className="border border-gray-400 px-3 py-2 rounded-lg flex items-center text-black hover:bg-gray-300"
              >
                <Plus className="w-4 h-4 mr-1" />
                Thêm dịch vụ
              </button>
            </div>
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className="w-[40%]">Tên dịch vụ</TableCell>
                    <TableCell className="w-[20%]">Số lượng</TableCell>
                    <TableCell className="w-[20%]">Trạng thái</TableCell>
                    <TableCell className="w-[20%]">Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {services.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={4}
                        className="text-center text-gray-500 py-8"
                      >
                        Chưa có dịch vụ nào. Nhấn "Thêm dịch vụ" để bắt đầu.
                      </TableCell>
                    </TableRow>
                  ) : (
                    services.map((service) => (
                      <TableRow key={service.id}>
                        <TableCell>{service.medicalService?.name}</TableCell>
                        <TableCell>{service.quantity}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              mapVisitServiceStatus(service.status).variant
                            }
                          >
                            {mapVisitServiceStatus(service.status).label}
                          </Badge>
                        </TableCell>
                        <TableCell className="!text-right">
                          <div className="flex gap-3">
                            {mode !== 'view' && (
                              <>
                                <button
                                  title="Chỉnh sửa"
                                  onClick={() => {
                                    setSelectedService(service);
                                    setIsAddServiceModalOpen(true);
                                  }}
                                  className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>
                                <button
                                  title="Xoá"
                                  onClick={() => {
                                    const serviceWithNew =
                                      service as Partial<IVisitService> & {
                                        isNew?: boolean;
                                      };
                                    // Nếu là service mới (chưa lưu vào DB) thì xóa trực tiếp
                                    if (serviceWithNew.isNew) {
                                      setServices((prevServices) =>
                                        prevServices.filter(
                                          (s) => s.id !== service.id
                                        )
                                      );
                                    } else {
                                      // Service đã có trong DB, cần gọi API xóa
                                      setSelectedService(service);
                                      setIsConfirmDeleteServiceOpen(true);
                                    }
                                  }}
                                  className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* Sidebar - Right (30%) */}
        <div className="w-[300px] border-l border-gray-200 pl-6 flex flex-col">
          <div className="mb-4">
            <h4 className="font-medium text-gray-900">Tài liệu & Hình ảnh</h4>
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex-1 bg-gray-50 rounded-lg border border-dashed p-4 flex flex-col items-center justify-center text-center space-y-3 cursor-pointer transition-colors ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}`}
          >
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-500">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Tải lên file</p>
              <p className="text-xs text-gray-500 mt-1">
                Kéo thả hoặc click để tải lên hình ảnh/kết quả siêu âm
              </p>
            </div>
            <button className="border border-gray-400 px-3 py-2 rounded-lg flex items-center text-black hover:bg-gray-300">
              Chọn file
            </button>
          </div>
          <input
            disabled={mode === 'view'}
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={(e) => handleFileSelect(e.target.files)}
            className="hidden"
          />

          <div className="mt-4 space-y-2 max-h-[300px] overflow-y-auto">
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => {
                  handleFileClick(file.id);
                }}
                className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-md shadow-sm"
              >
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                  {file.mimeType.match(/image\/(jpg|jpeg|png|gif)/i) ? (
                    <ImageIcon className="w-5 h-5 text-blue-500" />
                  ) : (
                    <FileIcon className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name || 'Tên file không xác định'}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFile(file.id);
                  }}
                  className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {addedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center gap-3 p-2 bg-white border border-gray-200 rounded-md shadow-sm"
              >
                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                  {file.type === 'image' ? (
                    <ImageIcon className="w-5 h-5 text-blue-500" />
                  ) : (
                    <FileIcon className="w-5 h-5 text-gray-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name || 'Tên file không xác định'}
                  </p>
                  <p className="text-xs text-gray-500">{file.size}</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteAddedFile(file.id);
                  }}
                  className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
        <AddEditServiceModal
          initData={selectedService}
          isOpen={isAddServiceModalOpen}
          onClose={() => {
            setIsAddServiceModalOpen(false);
            setSelectedService(null);
          }}
          onAdd={(service) => {
            if (mode === 'create') {
              // Thêm service với đầy đủ thông tin
              const newService: Partial<IVisitService> & { isNew?: boolean } = {
                id: `temp-${Date.now()}`, // Temporary ID
                medicalServiceId: service.medicalServiceId,
                medicalService: service.medicalService,
                quantity: service.quantity || 1,
                status: EVisitServiceStatus.ORDERED,
                isNew: true,
              };
              setServices((prevServices) => [...prevServices, newService]);
            } else if (mode === 'edit') {
              addVisitServiceMutation.mutate({
                visitId,
                medicalServiceId: service.medicalServiceId!,
                quantity: service.quantity || 1,
              });
            }
          }}
          onEdit={(visitServiceId: string, quantity: number) => {
            if (mode === 'create') {
              setServices((prevServices) =>
                prevServices.map((s) =>
                  s.id === visitServiceId ? { ...s, quantity } : s
                )
              );
            } else if (mode === 'edit') {
              updateVisitServiceMutation.mutate({
                id: visitServiceId,
                payload: { quantity },
              });
            }
          }}
        />
        {/* Image Viewer Modal */}
        <ImageViewerModal
          isOpen={isImageViewerOpen}
          onClose={() => setIsImageViewerOpen(false)}
          images={imageFiles}
          initialIndex={selectedImageIndex}
        />
        <CommonModal
          open={isConfirmDeleteServiceOpen}
          onClose={() => setIsConfirmDeleteServiceOpen(false)}
          title="Xác nhận xoá dịch vụ"
        >
          <>
            <p>Bạn có chắc chắn muốn xoá dịch vụ này?</p>
            <div className="flex justify-end gap-4 mt-6">
              <button
                className="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-200"
                onClick={() => setIsConfirmDeleteServiceOpen(false)}
              >
                Hủy
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                onClick={async () => {
                  if (selectedService) {
                    await deleteVisitServiceMutation.mutateAsync(
                      selectedService.id!
                    );
                  }
                  setIsConfirmDeleteServiceOpen(false);
                }}
              >
                Xác nhận
              </button>
            </div>
          </>
        </CommonModal>
      </div>
    );
  }
);

DiagnosisTab.displayName = 'DiagnosisTab';
