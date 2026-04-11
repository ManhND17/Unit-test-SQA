import ApiHealthInsurance from '@src/api/ApiHealthInsurance';
import QUERY_KEY from '@src/api/QueryKey';
import CommonButton from '@src/components/CommonButton';
import { IHealthInsurance } from '@src/types';
import { useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ModalAddEditHealthInsurance } from './components/ModalAddEditHealthInsurance';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface IHealthInsuranceProps {
  data?: IHealthInsurance[];
}

export default function HealthInsurance({ data }: IHealthInsuranceProps) {
  const [isExpand, setIsExpand] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasMore = data && data.length > 2;
  const [formData, setFormData] = useState<IHealthInsurance | undefined>(
    undefined
  );
  const queryClient = useQueryClient();
  const displayData =
    data && data.length > 2 && !isExpand ? data.slice(0, 2) : data;

  return (
    <>
      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Bảo hiểm y tế</h3>
          <CommonButton
            color="#ccc"
            text="Thêm"
            onClick={() => {
              setFormData(undefined);
              setIsModalOpen(true);
            }}
            className="!h-8 !px-3 !py-1"
            textClassName="!text-sm"
          />
        </div>
        <ul className="space-y-4">
          {displayData?.map((item) => (
            <li
              key={item.id}
              className="border border-gray-200 py-2 rounded-lg p-4"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-medium text-gray-700">Mã: </span>
                  <span className="text-gray-500">{item.insuranceId}</span>
                </div>
                <div className="flex gap-2">
                  <div>
                    <Pencil
                      size={16}
                      className="cursor-pointer"
                      onClick={() => {
                        setFormData(item);
                        setIsModalOpen(true);
                      }}
                    />
                  </div>
                  <div>
                    <Trash2
                      size={16}
                      className="cursor-pointer"
                      onClick={() => {
                        ApiHealthInsurance.deleteHealthInsurance(item.id);
                        queryClient.invalidateQueries({
                          queryKey: [
                            QUERY_KEY.PATIENT.GET_PATIENT_INFORMATION,
                            data?.[0]?.user?.userId,
                          ],
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <span className="font-medium text-gray-700">Loại: </span>
                <span className="text-gray-500">{item.type}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Ngày bắt đầu:{' '}
                </span>
                <span className="text-gray-500">
                  {new Date(item.startAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Ngày kết thúc:{' '}
                </span>
                <span className="text-gray-500">
                  {new Date(item.endAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">
                  Nơi đăng ký KCB ban đầu:{' '}
                </span>
                <span className="text-gray-500">{item.initial_kcb_name}</span>
              </div>
            </li>
          ))}
        </ul>
        {hasMore && (
          <div className="flex justify-center">
            <button
              className="mt-2 text-blue-500 flex items-center gap-1"
              onClick={() => setIsExpand(!isExpand)}
            >
              {isExpand ? (
                <>
                  Ẩn bớt
                  <ChevronUp size={16} />
                </>
              ) : (
                <>
                  Xem thêm
                  <ChevronDown size={16} />
                </>
              )}
            </button>
          </div>
        )}
      </div>
      {isModalOpen && (
        <ModalAddEditHealthInsurance
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          id={formData ? formData.id : data?.[0]?.user?.userId || ''}
          data={formData}
          onSuccess={() => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({
              queryKey: [
                QUERY_KEY.PATIENT.GET_PATIENT_INFORMATION,
                data?.[0]?.user?.userId,
              ],
            });
          }}
        />
      )}
    </>
  );
}
