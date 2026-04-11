export interface Service {
  id: string;
  name: string;
  unitPrice: number;
  quantity: number;
  total: number;
  insurancePays: number;
  patientPays: number;
}

interface ServicesTableProps {
  services: Service[];
  disableEdit?: boolean;
}

export function UsedMedicalServices({ services }: ServicesTableProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Các dịch vụ đã sử dụng
      </h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="w-4 h-4 text-blue-600 rounded cursor-not-allowed opacity-50"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tên dịch vụ
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đơn giá
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                SL
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
            {services.map((service) => (
              <tr key={service.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked
                    disabled
                    className="w-4 h-4 text-blue-600 rounded cursor-not-allowed opacity-50"
                  />
                </td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900 min-w-[200px]">
                  {service.name}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  {service.unitPrice.toLocaleString('vi-VN')}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                  {service.quantity}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                  {service.total.toLocaleString('vi-VN')}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 font-medium text-right">
                  {service.insurancePays.toLocaleString('vi-VN')}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-blue-600 font-medium text-right">
                  {service.patientPays.toLocaleString('vi-VN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
