import CommonSelect from '@components/CommonSelect';
import React from 'react';
interface DoctorFiltersProps {
  filters: {
    level: string;
    gender: string;
  };
  setFilters: React.Dispatch<
    React.SetStateAction<{
      level: string;
      gender: string;
    }>
  >;
}
const DoctorFilters = ({ filters, setFilters }: DoctorFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <p className="text-gray-700 self-center mr-2">Lọc theo:</p>
      <div className="relative">
        <CommonSelect
          values={[
            { name: 'Học vị/Chức danh', id: 'all' },
            { name: 'Giáo sư', id: 'GS' },
            { name: 'Phó giáo sư', id: 'PGS' },
            { name: 'Tiến sĩ', id: 'TS' },
            { name: 'Bác sĩ CKII', id: 'BSCK2' },
            { name: 'Bác sĩ CKI', id: 'BSCK1' },
            { name: 'Thạc sĩ', id: 'ThS' },
          ]}
          value={filters.level}
          onChange={(selected) =>
            setFilters({
              ...filters,
              level: selected,
            })
          }
        />
      </div>
      <div className="relative">
        <CommonSelect
          values={[
            { name: 'Giới tính', id: 'all' },
            { name: 'Nam', id: 'male' },
            { name: 'Nữ', id: 'female' },
            { name: 'Khác', id: 'other' },
          ]}
          value={filters.gender}
          onChange={(selected) =>
            setFilters({
              ...filters,
              gender: selected,
            })
          }
        />
      </div>
    </div>
  );
};
export default DoctorFilters;
