import CommonSelect from '@src/components/CommonSelect';
import { IMedicalService } from '@src/types';
import { ClipboardPlus } from 'lucide-react';

interface ServiceTypeSelectProps {
  selectedId?: string;
  onChange: (serviceId: string) => void;
  data: IMedicalService[];
}

export default function MedicalServiceSelect({
  selectedId,
  onChange,
  data,
}: ServiceTypeSelectProps) {
  return (
    <fieldset className="space-y-3">
      <legend className="block text-sm font-semibold text-gray-800 mb-2">
        Dịch vụ khám <span className="text-red-500">*</span>
      </legend>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
          <ClipboardPlus className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <CommonSelect
          values={data.map((service) => ({
            name: service.name,
            id: service.id + '',
          }))}
          value={selectedId ? selectedId + '' : ''}
          onChange={(value) => {
            onChange(value);
          }}
          className="w-full"
          selectProps={{
            sx: {
              paddingLeft: '2.5rem',
            },
          }}
          placeholder="Chọn dịch vụ khám bệnh"
        />
      </div>
    </fieldset>
  );
}
