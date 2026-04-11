import { Edit, Save, Trash, Plus } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { MedicineRow } from './MedicineRow';
import type { QueryParam } from '@src/api/Fetcher';
import { UseMutationResult } from '@tanstack/react-query';
import { Medicine, Prescription } from './types';

interface TablePrescriptionProps {
  prescription: Prescription;
  prescriptionIndex: number;
  initMode: 'view' | 'edit' | 'create';
  isSaving: boolean;
  deletePrescriptionMutation: UseMutationResult<void, Error, string, unknown>;
  onToggleEdit: () => void;
  onSave: () => void;
  onDelete: () => void;
  onAddMedicine: () => void;
  onUpdateMedicine: (medicineId: string, updates: Partial<Medicine>) => void;
  onDeleteMedicine: (medicineId: string) => void;
  getListMedicines: (params: QueryParam) => Promise<{
    data: { id: string; name: string; unit: string }[];
  }>;
}

export function TablePrescription({
  prescription,
  prescriptionIndex,
  initMode,
  isSaving,
  deletePrescriptionMutation,
  onToggleEdit,
  onSave,
  onDelete,
  onAddMedicine,
  onUpdateMedicine,
  onDeleteMedicine,
  getListMedicines,
}: TablePrescriptionProps) {
  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">
            ĐƠN THUỐC #{prescriptionIndex + 1} (Ngày{' '}
            {new Date(prescription.createdAt || '').toLocaleDateString()})
          </h3>
          {prescription.isNew && (
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Mới
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {initMode !== 'view' && (
            <button
              onClick={prescription.isEditing ? onSave : onToggleEdit}
              disabled={isSaving}
              className="border border-gray-400 text-black h-8 px-3 rounded-md flex items-center hover:bg-gray-300 disabled:opacity-50"
            >
              {prescription.isEditing ? (
                <>
                  <Save className="w-4 h-4 mr-2" /> Lưu thay đổi
                </>
              ) : (
                <>
                  <Edit className="w-4 h-4 mr-2" /> Chỉnh sửa
                </>
              )}
            </button>
          )}
          {initMode !== 'view' && (
            <button
              onClick={onDelete}
              disabled={isSaving || deletePrescriptionMutation.isPending}
              className="border border-gray-400 text-black h-8 px-3 rounded-md flex items-center hover:bg-gray-300 disabled:opacity-50"
            >
              <Trash className="w-4 h-4 mr-2" /> Xóa
            </button>
          )}
        </div>
      </div>

      {/* Prescription Table */}
      <div className="border rounded-md overflow-hidden bg-white shadow-sm">
        <Table>
          <TableHead>
            <TableRow className="bg-gray-50/50">
              <TableCell className="w-[50px]">STT</TableCell>
              <TableCell className="w-[30%]">Tên thuốc</TableCell>
              <TableCell className="w-[15%]">Số lượng</TableCell>
              <TableCell>Liều dùng (Ghi chú)</TableCell>
              {prescription.isEditing && (
                <TableCell className="w-[80px]">Thao tác</TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {prescription.medicines?.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center text-gray-500 py-8"
                >
                  Chưa có thuốc nào. Nhấn "Thêm dòng thuốc" để bắt đầu.
                </TableCell>
              </TableRow>
            ) : (
              prescription.medicines?.map((med, index) => (
                <MedicineRow
                  key={`${prescription.id}-medicine-${med.id}-${index}`}
                  medicine={med}
                  index={index}
                  isEditing={prescription.isEditing}
                  onUpdate={onUpdateMedicine}
                  onDelete={onDeleteMedicine}
                  getListMedicines={getListMedicines}
                />
              ))
            )}
            {prescription.isEditing && (
              <TableRow>
                <TableCell colSpan={5}>
                  <button
                    onClick={onAddMedicine}
                    className="bg-gray-400 text-black h-8 px-3 rounded-md flex items-center hover:bg-gray-500"
                  >
                    <Plus className="w-4 h-4 mr-2" /> Thêm dòng thuốc
                  </button>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Summary/Footer */}
      <div className="mt-auto pt-4 text-sm text-gray-500 flex justify-between items-center">
        <p>Tổng số loại thuốc: {prescription.medicines?.length || 0}</p>
        <p className="italic">
          * Vui lòng kiểm tra kỹ tương tác thuốc trước khi kê đơn
        </p>
      </div>
    </div>
  );
}
