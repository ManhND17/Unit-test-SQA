import { useState } from 'react';

type IAdvancedFiltersProps = {
  doctor?: string;
  patientId?: string;
  gender?: string;
  fromDate?: string;
  toDate?: string;
};

type ISearchFilterProps = {
  onQueryChange: (v: string) => void;
  onAdvancedChange?: (
    filters: IAdvancedFiltersProps,
    isApplying: boolean
  ) => void;
};

export default function SearchFilter({
  onQueryChange,
  onAdvancedChange,
}: ISearchFilterProps) {
  const [query, setQuery] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const applyAdvanced = () => {
    // Validate date range
    if (fromDate && toDate && new Date(fromDate) > new Date(toDate)) {
      alert('Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc');
      return;
    }

    if (!patientId?.trim()) {
      alert('Vui lòng nhập mã bệnh nhân');
      return;
    }

    onAdvancedChange?.(
      {
        patientId: patientId?.trim() || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      },
      true
    ); // isApplying = true
  };

  const resetAdvanced = () => {
    setPatientId('');
    setFromDate('');
    setToDate('');
    onAdvancedChange?.({}, false); // isApplying = false
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="relative flex-1">
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              onQueryChange(e.target.value);
            }}
            type="text"
            placeholder="Tìm kiếm theo tên bệnh nhân, mã bệnh án, chẩn đoán..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 flex items-center justify-center">
            <i className="ri-search-line text-gray-400"></i>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowAdvanced((s) => !s)}
            className="px-4 py-3 bg-secondary text-white rounded-button font-medium hover:bg-green-700 transition-colors whitespace-nowrap text-sm"
          >
            <i className="ri-filter-3-line mr-2"></i>
            {showAdvanced ? 'Đóng nâng cao' : 'Tìm nâng cao'}
          </button>
        </div>
      </div>

      {showAdvanced && (
        <div className="mt-4 border-t pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-gray-500">
              Mã bệnh nhân <span className="text-red-500">*</span>
            </label>
            <input
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="VD: PAT001"
              className="w-full mt-1 p-2 border rounded text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Từ ngày</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              max={toDate || undefined}
              className="w-full mt-1 p-2 border rounded text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500">Đến ngày</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              min={fromDate || undefined}
              className="w-full mt-1 p-2 border rounded text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={applyAdvanced}
              disabled={!patientId?.trim()}
              className="px-4 py-2 bg-primary text-white rounded-button text-sm hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Áp dụng
            </button>
            <button
              onClick={resetAdvanced}
              className="px-4 py-2 bg-white border text-gray-700 rounded-button text-sm hover:bg-gray-100 transition-colors"
            >
              Đặt lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
