import CommonSelect from '@src/components/CommonSelect';
import { IDepartment } from '@src/types';
import { BuildingIcon } from 'lucide-react';

interface DepartmentSelectProps {
  departments: IDepartment[];
  selectedId: number | null;
  onChange: (id: number) => void;
  error?: string;
}
export default function DepartmentSelect({
  departments,
  selectedId,
  onChange,
  error,
}: DepartmentSelectProps) {
  return (
    <div className="space-y-2">
      <label
        htmlFor="department-select"
        className="block text-sm font-semibold text-gray-800"
      >
        Chuyên khoa <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <BuildingIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <CommonSelect
          values={departments.map((dept) => ({
            name: dept.name,
            id: dept.id + '',
          }))}
          value={selectedId ? selectedId + '' : ''}
          onChange={(value) => {
            const numValue = Number(value);
            if (!isNaN(numValue)) {
              onChange(numValue);
            }
          }}
          className="w-full"
          selectProps={{
            sx: {
              paddingLeft: '2.5rem',
            },
          }}
          placeholder="Chọn chuyên khoa khám bệnh"
        />
      </div>

      {error && (
        <p
          id="department-error"
          className="text-sm text-red-600 flex items-center gap-1"
        >
          <span aria-hidden="true">⚠</span> {error}
        </p>
      )}
    </div>
  );
}
