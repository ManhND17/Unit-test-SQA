import ApiEmergencyContact from '@src/api/ApiEmergencyContact';
import QUERY_KEY from '@src/api/QueryKey';
import CommonButton from '@src/components/CommonButton';
import { IEmergencyContact } from '@src/types';
import { useQueryClient } from '@tanstack/react-query';
import { Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ModalAddEditEmergencyContact from './components/ModalAddEditEmergencyContact';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface IEmergencyContactProps {
  data?: IEmergencyContact[];
}

export default function EmergencyContactSection({
  data,
}: IEmergencyContactProps) {
  const [isExpand, setIsExpand] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const hasMore = data && data.length > 2;
  const [formData, setFormData] = useState<IEmergencyContact | undefined>(
    undefined
  );
  const queryClient = useQueryClient();
  const displayData =
    data && data.length > 2 && !isExpand ? data.slice(0, 2) : data;

  return (
    <>
      <div className="mt-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Danh sách người liên hệ khẩn cấp
          </h3>
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
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium">{item.fullName}</div>
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
                        ApiEmergencyContact.deleteEmergencyContact(item.id);
                        queryClient.invalidateQueries({
                          queryKey: [
                            QUERY_KEY.PATIENT.GET_PATIENT_INFORMATION,
                            data?.[0]?.patientId,
                          ],
                        });
                      }}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">
                  {item.relationship}
                </span>
                <div className="text-sm text-gray-500">{item.phone}</div>
              </div>
              <div className="text-sm text-gray-500">{item.email}</div>
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
        <ModalAddEditEmergencyContact
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          id={formData ? formData.id : data?.[0]?.patientId || ''}
          data={formData}
          onSuccess={() => {
            setIsModalOpen(false);
            queryClient.invalidateQueries({
              queryKey: [
                QUERY_KEY.PATIENT.GET_PATIENT_INFORMATION,
                data?.[0]?.patientId,
              ],
            });
          }}
        />
      )}
    </>
  );
}
