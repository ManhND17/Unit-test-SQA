import { TableCell, TableRow } from '@mui/material';
import { Trash } from 'lucide-react';
import AutoCompleteAutofill from '@src/components/AutoCompleteAutofill';
import CommonInput from '@src/components/CommonInput';
import clsx from 'clsx';

interface Medicine {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  notes: string;
  medicineId?: string;
}

interface MedicineRowProps {
  medicine: Medicine;
  index: number;
  isEditing: boolean;
  onUpdate: (medicineId: string, updates: Partial<Medicine>) => void;
  onDelete: (medicineId: string) => void;
  getListMedicines: (params: any) => Promise<any>;
}

interface IValue {
  id: string;
  label: string;
  unit?: string;
}

export const MedicineRow: React.FC<MedicineRowProps> = ({
  medicine,
  index,
  isEditing,
  onUpdate,
  onDelete,
  getListMedicines,
}) => {
  const handleMedicineSelect = (
    val: string | string[] | IValue | IValue[] | null
  ) => {
    // Xử lý khi xóa thuốc (clear input)
    if (val === null || val === '') {
      onUpdate(medicine.id, {
        name: '',
        medicineId: undefined,
        unit: 'Viên',
      });
      return;
    }

    // Xử lý khi chọn thuốc từ dropdown (object)
    if (typeof val === 'object' && !Array.isArray(val)) {
      onUpdate(medicine.id, {
        medicineId: val.id,
        name: val.label,
        unit: val.unit || medicine.unit || 'Viên',
      });
    }
    // Xử lý khi nhập tự do (string)
    else if (typeof val === 'string') {
      onUpdate(medicine.id, {
        name: val,
        medicineId: undefined,
      });
    }
  };

  return (
    <TableRow key={medicine.id}>
      <TableCell className="font-medium text-gray-500">{index + 1}</TableCell>
      <TableCell>
        {isEditing ? (
          <AutoCompleteAutofill
            placeHolder="Nhập tên thuốc"
            name={`autofill-medicine-${medicine.id}`}
            suggestionAPI={getListMedicines}
            value={
              medicine.medicineId
                ? {
                    id: medicine.medicineId,
                    label: medicine.name,
                  }
                : null
            }
            onChange={handleMedicineSelect}
            renderOption={(props, option: IValue) => {
              const isSelected = medicine.medicineId === option.id;
              return (
                <li
                  {...props}
                  className={clsx(
                    'w-full p-2 hover:cursor-pointer hover:bg-gray-100 transition-colors',
                    {
                      'bg-blue-50 hover:bg-blue-100': isSelected,
                    }
                  )}
                >
                  <div>
                    <span className="truncate text-gray-900">
                      {option.label}
                    </span>
                  </div>
                </li>
              );
            }}
          />
        ) : (
          <span className="font-medium text-gray-900">{medicine.name}</span>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <div className="flex items-center gap-2">
            <CommonInput
              type="number"
              value={medicine.quantity}
              className="h-8 w-20"
              min={1}
              onChange={(e) =>
                onUpdate(medicine.id, {
                  quantity: parseInt(e.target.value) || 1,
                })
              }
            />
            <span className="text-sm text-gray-500">{medicine.unit}</span>
          </div>
        ) : (
          <span>
            {medicine.quantity} {medicine.unit}
          </span>
        )}
      </TableCell>
      <TableCell>
        {isEditing ? (
          <CommonInput
            value={medicine.notes}
            className="h-8"
            onChange={(e) =>
              onUpdate(medicine.id, {
                notes: e.target.value,
              })
            }
            placeholder="Nhập liều dùng"
          />
        ) : (
          <span className="text-gray-600">{medicine.notes}</span>
        )}
      </TableCell>
      {isEditing && (
        <TableCell>
          <button
            onClick={() => onDelete(medicine.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50"
          >
            <Trash className="w-4 h-4" />
          </button>
        </TableCell>
      )}
    </TableRow>
  );
};
