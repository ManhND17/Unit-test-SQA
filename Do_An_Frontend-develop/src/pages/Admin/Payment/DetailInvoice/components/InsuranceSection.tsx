import { CheckCircleIcon, XIcon } from 'lucide-react';
import { IHealthInsurance } from '@src/types';
import { useQuery } from '@tanstack/react-query';
import QUERY_KEY from '@src/api/QueryKey';
import ApiHealthInsurance from '@src/api/ApiHealthInsurance';
import { CircularProgress } from '@mui/material';

interface IInsuranceSectionProps {
  selectedInsurance: Partial<IHealthInsurance> | null;
  onInsuranceChange: (insurance: Partial<IHealthInsurance> | null) => void;
  userId?: string;
  disableEdit?: boolean;
}

export function InsuranceSection({
  onInsuranceChange,
  userId,
  selectedInsurance,
  disableEdit,
}: IInsuranceSectionProps) {
  const { data: insurancesData, isLoading } = useQuery({
    queryKey: [QUERY_KEY.INSURANCE.GET_INSURANCES_BY_USER, userId],
    queryFn: () => ApiHealthInsurance.getInsurancesByUser(userId!),
    enabled: !!userId,
  });

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Áp dụng quyền lợi bảo hiểm
      </h2>

      {/* Insurance Options */}
      <div className="space-y-3 mb-4">
        {isLoading ? (
          <div className="flex justify-center w-full h-[200px]">
            <CircularProgress />
          </div>
        ) : insurancesData?.data.length === 0 ? (
          <p className="text-sm text-gray-500 flex justify-center w-full h-[200px]">
            Không có thông tin bảo hiểm y tế.
          </p>
        ) : (
          insurancesData?.data.map((insurance) => (
            <label
              key={insurance.id}
              className="flex items-start space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
            >
              <input
                disabled={disableEdit}
                type="radio"
                name="insurance"
                value={insurance.id}
                checked={selectedInsurance?.id === insurance.id}
                onChange={() => onInsuranceChange(insurance)}
                className="mt-1 w-4 h-4 text-blue-600 focus:ring-blue-500"
              />
              <div className="flex-1 space-y-2">
                <p className="text-sm font-medium text-gray-900">
                  Mã: {insurance.insuranceId}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Mức hưởng: {insurance.coverage}%
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Nơi KCB ban đầu: {insurance.initial_kcb_name}
                </p>
              </div>
            </label>
          ))
        )}
      </div>

      {selectedInsurance && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg relative">
          <div className="flex items-start space-x-2 pr-8">
            <CheckCircleIcon className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-green-800">
                Đã áp dụng BHYT - Mã: {selectedInsurance.insuranceId}
              </p>
              <p className="text-xs text-green-700 mt-1">
                Mức hưởng: {selectedInsurance.coverage}%
              </p>
            </div>
          </div>

          {/* Close button */}
          <button
            disabled={disableEdit}
            onClick={() => onInsuranceChange(null)}
            className="absolute top-2 right-2 p-1 rounded-full hover:bg-green-100 transition-colors group"
            title="Bỏ áp dụng BHYT"
          >
            <XIcon className="w-4 h-4 text-green-600 group-hover:text-green-800" />
          </button>
        </div>
      )}
    </div>
  );
}
