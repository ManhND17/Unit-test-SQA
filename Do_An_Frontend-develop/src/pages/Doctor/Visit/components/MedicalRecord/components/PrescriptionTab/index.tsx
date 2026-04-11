import {
  useState,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useRef,
} from 'react';
import { Plus } from 'lucide-react';
import { IPrescription } from '@src/types';
import { useMutation } from '@tanstack/react-query';
import ApiPrescription, {
  CreateMedicineUsagePayload,
} from '@src/api/ApiPrescription';
import { toast } from 'react-toastify';
import type { QueryParam } from '@src/api/Fetcher';
import ApiMedicine from '@src/api/ApiMedicine';
import { TablePrescription } from './TablePrescription';
import { Medicine, PrescriptionWithEditing } from './types';

interface IPrescriptionTabProps {
  initData: IPrescription[];
  initMode: 'view' | 'edit' | 'create';
  visitId: string;
  onSaveSuccess?: () => void;
}

export interface PrescriptionTabRef {
  save: () => Promise<boolean>;
  getData: () => PrescriptionWithEditing[];
}

export const PrescriptionTab = forwardRef<
  PrescriptionTabRef,
  IPrescriptionTabProps
>(({ initData, initMode, visitId, onSaveSuccess }, ref) => {
  useState(false);
  const [prescriptions, setPrescriptions] = useState<PrescriptionWithEditing[]>(
    initData.map((p) => ({
      id: p.id,
      paid: p.paid,
      createdAt: p.createdAt,
      createdByUserId: p.createdByUserId,
      createdBy: p.createdBy,
      medicines:
        p.medicineUsages?.map((m) => ({
          id: m.medicine?.id || '',
          medicineId: m.medicine?.id || '',
          name: m.medicine?.name || '',
          quantity: m.quantity,
          unit: m.medicine?.unit || '',
          notes: m.note || '',
        })) || [],
      isEditing: false,
      isNew: false,
    }))
  );

  // Chỉ sync prescriptions khi visitId thay đổi (khi chuyển sang visit khác)
  // Không sync khi chỉ chuyển tab để tránh mất dữ liệu đang nhập
  const prevVisitIdRef = useRef<string | null>(null);
  const prevPrescriptionIdsRef = useRef<string>('');

  useEffect(() => {
    // Tạo signature từ prescription IDs để detect thay đổi
    const currentPrescriptionIds = initData
      .map((p) => p.id)
      .sort()
      .join(',');
    const shouldUpdate =
      prevVisitIdRef.current === null || // Lần đầu load
      prevVisitIdRef.current !== visitId || // Chuyển visit khác
      prevPrescriptionIdsRef.current !== currentPrescriptionIds; // InitData thay đổi

    if (shouldUpdate) {
      setPrescriptions(
        initData.map((p) => ({
          id: p.id,
          paid: p.paid,
          createdAt: p.createdAt,
          createdByUserId: p.createdByUserId,
          createdBy: p.createdBy,
          medicines:
            p.medicineUsages?.map((m) => ({
              id: m.medicine?.id || '',
              medicineId: m.medicine?.id || '',
              name: m.medicine?.name || '',
              quantity: m.quantity,
              unit: m.medicine?.unit || '',
              notes: m.note || '',
            })) || [],
          isEditing: false,
          isNew: false,
        }))
      );
      prevVisitIdRef.current = visitId;
      prevPrescriptionIdsRef.current = currentPrescriptionIds;
    }
  }, [visitId, initData]);

  const toggleEdit = (prescriptionId: string) => {
    setPrescriptions((prev) =>
      prev.map((prescription) =>
        prescription.id === prescriptionId
          ? { ...prescription, isEditing: !prescription.isEditing }
          : prescription
      )
    );
  };

  const addNewMedicine = (prescriptionId: string) => {
    setPrescriptions((prev) =>
      prev.map((p) => {
        if (p.id === prescriptionId) {
          const newMedicine: Medicine = {
            id: Date.now().toString(),
            name: '',
            quantity: 1,
            unit: 'Viên',
            notes: '',
          };
          return {
            ...p,
            medicines: [...(p.medicines || []), newMedicine],
          };
        }
        return p;
      })
    );
  };

  const deleteMedicine = (prescriptionId: string, medicineId: string) => {
    setPrescriptions((prev) =>
      prev.map((p) => {
        if (p.id === prescriptionId) {
          return {
            ...p,
            medicines: p.medicines?.filter((m) => m.id !== medicineId),
          };
        }
        return p;
      })
    );
  };

  // Update multiple fields at once (for AutoComplete selection)
  const updateMedicineMultipleFields = (
    prescriptionId: string,
    medicineId: string,
    updates: Partial<Medicine>
  ) => {
    setPrescriptions((prev) =>
      prev.map((p) => {
        if (p.id === prescriptionId) {
          return {
            ...p,
            medicines: p.medicines?.map((m) =>
              m.id === medicineId
                ? {
                    ...m,
                    ...updates,
                  }
                : m
            ),
          };
        }
        return p;
      })
    );
  };

  const createNewPrescription = () => {
    const newPrescription: PrescriptionWithEditing = {
      id: Date.now().toString(),
      isEditing: true,
      medicines: [],
      isNew: true,
      createdAt: new Date().toISOString(),
    };
    setPrescriptions((prev) => [...prev, newPrescription]);
  };

  const deletePrescription = (prescriptionId: string) => {
    setPrescriptions((prev) => prev.filter((p) => p.id !== prescriptionId));
  };

  // Mutations
  const createPrescriptionMutation = useMutation({
    mutationFn: (payload: {
      visitId: string;
      medicines: CreateMedicineUsagePayload[];
    }) => ApiPrescription.createPrescription(payload),
    onError: () => {
      toast.error('Tạo đơn thuốc thất bại');
    },
    onSuccess: (data, variables) => {
      // Tìm prescription tạm (isNew) và cập nhật bằng data thật từ server
      setPrescriptions((prev) =>
        prev.map((p) => {
          // Tìm prescription vừa tạo (có cùng medicines)
          const isSamePrescription =
            p.isNew && p.medicines?.length === variables.medicines.length;
          if (isSamePrescription) {
            return {
              ...data,
              medicines:
                data.medicineUsages?.map((m) => ({
                  id: m.medicine?.id || '',
                  medicineId: m.medicine?.id || '',
                  name: m.medicine?.name || '',
                  quantity: m.quantity,
                  unit: m.medicine?.unit || '',
                  notes: m.note || '',
                })) || [],
              isEditing: false,
              isNew: false,
            };
          }
          return p;
        })
      );
    },
  });

  const updatePrescriptionMutation = useMutation({
    mutationFn: (payload: {
      prescriptionId: string;
      medicines: CreateMedicineUsagePayload[];
    }) =>
      ApiPrescription.updatePrescriptionWithMedicines(
        payload.prescriptionId,
        payload.medicines
      ),
    onError: () => {
      toast.error('Cập nhật đơn thuốc thất bại');
    },
    onSuccess: (data) => {
      setPrescriptions((prev) =>
        prev.map((p) =>
          p.id === data.id
            ? {
                ...p,
                ...data,
                medicines:
                  data.medicineUsages?.map((m) => ({
                    id: m.medicine?.id || '',
                    medicineId: m.medicine?.id || '',
                    name: m.medicine?.name || '',
                    quantity: m.quantity,
                    unit: m.medicine?.unit || '',
                    notes: m.note || '',
                  })) || [],
                isEditing: false,
                isNew: false,
              }
            : p
        )
      );
    },
  });

  const deletePrescriptionMutation = useMutation({
    mutationFn: (id: string) => ApiPrescription.deletePrescription(id),
    onError: () => {
      toast.error('Xóa đơn thuốc thất bại');
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  // Save a single prescription
  const savePrescription = async (
    prescription: PrescriptionWithEditing
  ): Promise<boolean> => {
    // Validation
    if (!prescription.medicines || prescription.medicines.length === 0) {
      toast.error('Vui lòng thêm ít nhất một loại thuốc');
      return false;
    }

    const hasInvalidMedicine = prescription.medicines.some(
      (m) => !m.name || m.quantity <= 0
    );
    if (hasInvalidMedicine) {
      toast.error('Vui lòng điền đầy đủ thông tin thuốc');
      return false;
    }

    // Ở chế độ 'create', chỉ toggle edit, không gọi API
    if (initMode === 'create') {
      toggleEdit(prescription.id);
      return true;
    }

    // Ở chế độ 'edit', gọi API để lưu
    const medicines: CreateMedicineUsagePayload[] = prescription.medicines.map(
      (m) => ({
        medicineId: m.medicineId || undefined,
        drugName: m.name,
        quantity: m.quantity,
        note: m.notes,
      })
    );

    try {
      if (prescription.isNew) {
        await createPrescriptionMutation.mutateAsync({
          visitId,
          medicines,
        });
      } else {
        await updatePrescriptionMutation.mutateAsync({
          prescriptionId: prescription.id,
          medicines,
        });
      }
      return true;
    } catch {
      return false;
    }
  };

  // Save all prescriptions that are in editing mode or new
  const handleSaveAll = async (): Promise<boolean> => {
    setIsSaving(true);
    try {
      const prescriptionsToSave = prescriptions.filter(
        (p) => p.isNew || p.isEditing
      );

      for (const prescription of prescriptionsToSave) {
        const success = await savePrescription(prescription);
        if (!success) {
          setIsSaving(false);
          return false;
        }
      }

      toast.success('Lưu đơn thuốc thành công');
      onSaveSuccess?.();
      setIsSaving(false);
      return true;
    } catch {
      setIsSaving(false);
      return false;
    }
  };

  // Handle delete with API call for existing prescriptions
  const handleDeletePrescription = async (
    prescriptionId: string,
    isNew: boolean
  ) => {
    if (!isNew) {
      try {
        await deletePrescriptionMutation.mutateAsync(prescriptionId);
        toast.success('Xóa đơn thuốc thành công');
      } catch {
        return;
      }
    }
    deletePrescription(prescriptionId);
  };

  // Handle save single prescription (when clicking save button on a prescription)
  const handleSavePrescription = async (
    prescription: PrescriptionWithEditing
  ) => {
    const success = await savePrescription(prescription);
    if (success) {
      // Chỉ hiển thị toast khi ở chế độ 'edit' (có gọi API)
      if (initMode === 'edit') {
        if (prescription.isNew) {
          toast.success('Tạo đơn thuốc thành công');
        } else {
          toast.success('Cập nhật đơn thuốc thành công');
        }
      }
      onSaveSuccess?.();
    }
  };

  // Expose methods via ref
  useImperativeHandle(ref, () => ({
    save: handleSaveAll,
    getData: () => prescriptions,
  }));

  const getListMedicines = async (params: QueryParam) => {
    const res = await ApiMedicine.getMedicines(params);
    return {
      ...res,
      data: res.data.map((medicine) => ({
        id: medicine.id,
        name: medicine.name,
        unit: medicine.unit || 'Viên',
      })),
    };
  };

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex justify-end gap-2">
        <button
          className="border border-gray-400 text-white bg-gray-950 h-8 px-3 rounded-md flex items-center disabled:opacity-50"
          onClick={createNewPrescription}
          disabled={isSaving || initMode === 'view'}
        >
          <Plus className="w-4 h-4 mr-2" /> Tạo đơn mới
        </button>
      </div>
      {prescriptions.length === 0 ? (
        <p className="text-xl">Chưa có đơn thuốc nào được kê.</p>
      ) : (
        prescriptions.map((prescription, prescriptionIndex) => (
          <TablePrescription
            key={prescription.id}
            prescription={prescription}
            prescriptionIndex={prescriptionIndex}
            initMode={initMode}
            isSaving={isSaving}
            deletePrescriptionMutation={deletePrescriptionMutation}
            onToggleEdit={() => toggleEdit(prescription.id)}
            onSave={() => handleSavePrescription(prescription)}
            onDelete={() =>
              handleDeletePrescription(prescription.id, prescription.isNew)
            }
            onAddMedicine={() => addNewMedicine(prescription.id)}
            onUpdateMedicine={(medicineId, updates) =>
              updateMedicineMultipleFields(prescription.id, medicineId, updates)
            }
            onDeleteMedicine={(medicineId) =>
              deleteMedicine(prescription.id, medicineId)
            }
            getListMedicines={getListMedicines}
          />
        ))
      )}
    </div>
  );
});

PrescriptionTab.displayName = 'PrescriptionTab';
