import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import CommonInput from '@src/components/CommonInput';
import CommonAutoComplete from '@src/components/CommonAutoComplete';
import { useQuery } from '@tanstack/react-query';
import ApiMedicalService from '@src/api/ApiMedicalService';
import QUERY_KEY from '@src/api/QueryKey';
import { IMedicalService, IVisitService } from '@src/types';

interface AddEditServiceModalProps {
  initData: Partial<IVisitService> | null;
  isOpen: boolean;
  onClose: () => void;
  onAdd: (service: {
    medicalServiceId: string;
    medicalService: IMedicalService;
    quantity: number;
  }) => void | Promise<IVisitService>;
  onEdit: (
    visitServiceId: string,
    quantity: number
  ) => void | Promise<IVisitService>;
}

export function AddEditServiceModal({
  initData,
  isOpen,
  onClose,
  onAdd,
  onEdit,
}: AddEditServiceModalProps) {
  const [selectedService, setSelectedService] =
    useState<IMedicalService | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { data: medicalServices } = useQuery({
    queryKey: [QUERY_KEY.MEDICAL_SERVICE.GET_LIST_MEDICAL_SERVICE],
    queryFn: () =>
      ApiMedicalService.getMedicalServices({
        isActive: 1,
      }),
    enabled: isOpen,
  });

  useEffect(() => {
    if (initData && isOpen) {
      setQuantity(initData.quantity || 1);
      if (initData.medicalService) {
        setSelectedService(initData.medicalService);
      }
    } else {
      setSelectedService(null);
      setQuantity(1);
    }
  }, [initData, isOpen]);

  const handleClose = () => {
    setSelectedService(null);
    setQuantity(1);
    onClose();
  };

  const handleSubmit = async () => {
    if (!initData && selectedService) {
      await onAdd({
        medicalServiceId: selectedService.id,
        medicalService: selectedService,
        quantity,
      });
      handleClose();
    } else if (initData && initData.id) {
      await onEdit(initData.id, quantity);
      handleClose();
    }
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-blue-700">
            {initData ? 'CHỈNH SỬA DỊCH VỤ' : 'THÊM DỊCH VỤ'}
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Service Name with Autocomplete */}
          <div className="space-y-2 relative">
            <label className="text-sm font-medium text-gray-700">
              Tên dịch vụ <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <CommonAutoComplete
                value={{
                  id: selectedService?.id || '',
                  name: selectedService?.name || '',
                }}
                options={
                  medicalServices?.data?.map((service) => {
                    return { id: service.id, name: service.name };
                  }) || []
                }
                placeholder="Nhập tên dịch vụ..."
                onChange={(e) => {
                  if (e && e?.id) {
                    const selectedId = e.id;
                    const service = medicalServices?.data.find(
                      (svc) => svc.id === selectedId
                    );
                    setSelectedService(service || null);
                    return;
                  }
                  setSelectedService(null);
                }}
              />
            </div>
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Số lượng <span className="text-red-500">*</span>
            </label>
            <CommonInput
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              placeholder="Nhập số lượng..."
            />
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 flex gap-3 justify-end bg-gray-50">
          <button
            className="bg-gray-100 px-3 py-2 rounded-lg flex items-center text-black hover:bg-gray-300"
            onClick={handleClose}
          >
            HỦY
          </button>
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white rounded-lg px-3 py-2 flex items-center"
            disabled={!selectedService}
            onClick={handleSubmit}
          >
            {initData ? 'CẬP NHẬT' : 'THÊM DỊCH VỤ'}
          </button>
        </div>
      </div>
    </div>
  );
}
