export interface Medicine {
  id: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  total: number;
  insurancePays: number;
  patientPays: number;
  isPurchased: boolean;
  prescriptionId: string;
}

interface MedicineTableProps {
  medicines: Medicine[];
  selectedMedicines: string[];
  onMedicineToggle: (medicineId: string) => void;
  disableEdit?: boolean;
}

export function MedicineTable({
  medicines,
  selectedMedicines,
  onMedicineToggle,
  disableEdit,
}: MedicineTableProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        Đơn thuốc (Tùy chọn mua tại quầy)
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Chọn các loại thuốc bệnh nhân muốn mua
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                Chọn
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên thuốc
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đơn vị
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                SL
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đơn giá
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thành tiền
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                BHYT trả
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bệnh nhân trả
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {medicines.map((medicine) => {
              const isSelected = selectedMedicines.includes(medicine.id);
              return (
                <tr
                  key={medicine.id}
                  className={`hover:bg-gray-50 ${isSelected ? 'bg-blue-50' : ''}`}
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <input
                      disabled={disableEdit}
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onMedicineToggle(medicine.id)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500 cursor-pointer"
                    />
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-gray-900">
                    {medicine.name}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {medicine.unit}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {medicine.quantity}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                    {medicine.unitPrice.toLocaleString('vi-VN')}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                    {isSelected ? medicine.total.toLocaleString('vi-VN') : '0'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium text-right">
                    {isSelected
                      ? medicine.insurancePays.toLocaleString('vi-VN')
                      : '0'}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-medium text-right">
                    {isSelected
                      ? medicine.patientPays.toLocaleString('vi-VN')
                      : '0'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
