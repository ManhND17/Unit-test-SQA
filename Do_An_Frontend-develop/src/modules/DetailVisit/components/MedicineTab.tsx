import { Card } from '@mui/material';
import ModalMedicine from '@src/components/ModalMedicine';
import { IMedicine, IPrescription } from '@src/types';
import { ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface MedicationsTabProps {
  prescriptions: IPrescription[];
}
export function MedicineTab({ prescriptions }: MedicationsTabProps) {
  const [selectedMedicine, setSelectedMedicine] = useState<IMedicine | null>(
    null
  );
  const handleOpenDetailMedicine = (medicine?: IMedicine) => {
    if (medicine) {
      setSelectedMedicine(medicine);
    }
  };
  if (prescriptions.length === 0) {
    return <p className="text-xl">Không có đơn thuốc nào được kê.</p>;
  }
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-6">Danh sách đơn thuốc</h2>
      {prescriptions.length === 0 && (
        <p className="text-xl">Không có đơn thuốc nào được kê.</p>
      )}
      {prescriptions.map((prescription, index) => (
        <Card key={prescription.id || index}>
          <div className="p-6 bg-blue-50 border-b border-blue-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Đơn Thuốc #{index + 1}
            </h3>
            <p className="text-sm text-gray-600">
              Bác sĩ kê đơn:{' '}
              {prescription.createdBy?.name
                ? `${prescription.createdBy.name.firstName} ${prescription.createdBy.name.lastName}`
                : 'N/A'}
            </p>
          </div>

          {/* Medications List */}
          <div className="p-6">
            <div className="space-y-4">
              {prescription.medicineUsages?.map((med, index) => (
                <div
                  key={index}
                  className="border-l-4 border-blue-600 pl-4 py-2"
                >
                  <div className="font-semibold text-gray-900 mb-1 flex items-center">
                    <p>
                      {med.drugName ||
                        med.medicine?.name ||
                        'Thuốc không xác định'}{' '}
                    </p>
                    <span
                      className="ml-4 cursor-pointer"
                      onClick={() => handleOpenDetailMedicine(med.medicine)}
                    >
                      <ExternalLink className="w-4 h-4 text-blue-500" />
                    </span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>
                      <span className="font-medium">Số lượng:</span>{' '}
                      {`${med.quantity} ${med.medicine?.unit || ''}`}
                    </div>
                    <div>
                      <span className="font-medium">Hướng dẫn:</span>{' '}
                      {med.note || 'Không có hướng dẫn cụ thể'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      ))}
      <ModalMedicine
        open={selectedMedicine !== null}
        onClose={() => setSelectedMedicine(null)}
        medicine={selectedMedicine}
      />
    </div>
  );
}
