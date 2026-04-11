import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  User,
  Stethoscope,
  Pill,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { CircularProgress } from '@mui/material';
import CommonButton from '@src/components/CommonButton';
import { useQuery } from '@tanstack/react-query';
import ApiInvoice from '@src/api/ApiInvoice';

export default function UnpaidService() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [searchedPatientId, setSearchedPatientId] = useState('');

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['unpaid-items', searchedPatientId],
    queryFn: () => ApiInvoice.getUnpaidItems(searchedPatientId),
    enabled: !!searchedPatientId,
  });

  const handleSearch = () => {
    setSearchedPatientId(searchValue.trim());
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Calculate totals
  const totals = useMemo(() => {
    if (isLoading || !data) {
      return { services: 0, prescriptions: 0, total: 0 };
    }
    const servicesTotal = data.unpaidVisitServices.reduce((total, service) => {
      return total + service.price * service.quantity;
    }, 0);

    const prescriptionsTotal = data.unpaidPrescriptions.reduce(
      (total, prescription) => {
        const prescriptionTotal = prescription?.medicineUsages?.reduce(
          (sum, usage) => {
            return sum + usage.price * usage.quantity;
          },
          0
        );
        return total + (prescriptionTotal ?? 0);
      },
      0
    );

    return {
      services: servicesTotal,
      prescriptions: prescriptionsTotal,
      total: servicesTotal + prescriptionsTotal,
    };
  }, [data, isLoading]);

  const handleCreateInvoice = () => {
    if (data?.patient.id) {
      navigate(`/admin/invoices/create-invoice/${data.patient.id}`);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Search Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Search className="w-5 h-5" />
          Tìm kiếm dịch vụ chưa thanh toán theo mã bệnh nhân
        </h2>
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nhập mã bệnh nhân (VD: PAT001)"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <CommonButton
            text="Tìm kiếm"
            onClick={handleSearch}
            isLoading={isFetching}
            color="#3B82F6"
            startIcon={<Search className="w-4 h-4" />}
          />
        </div>
        <p className="text-sm text-gray-500 mt-2">
          Nhập mã bệnh nhân để tìm kiếm các dịch vụ và đơn thuốc chưa thanh toán
        </p>
      </div>

      {/* Search Results */}
      {searchedPatientId && !isLoading && (
        <>
          {data ? (
            <div className="bg-white rounded-lg shadow p-6">
              {/* Patient Info Header */}
              <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {data.patient.fullName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Mã BN: {data.patient.patientId} | SĐT:{' '}
                      {data.patient.phone} | Email: {data.patient.email}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Ngày sinh</p>
                  <p className="font-medium">
                    {data.patient.birthday
                      ? new Date(data.patient.birthday).toLocaleDateString(
                          'vi-VN'
                        )
                      : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Services Section */}
              {data.unpaidVisitServices.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Stethoscope className="w-5 h-5 text-blue-600" />
                    Dịch vụ y tế chưa thanh toán (
                    {data.unpaidVisitServices.length})
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Tên dịch vụ
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            Ngày
                          </th>
                          <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                            SL
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            Đơn giá
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                            Thành tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {data.unpaidVisitServices.map((service) => (
                          <tr key={service.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">
                              {service.medicalService?.name}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500 text-center">
                              {new Date(service.orderedAt).toLocaleDateString(
                                'vi-VN'
                              )}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-center">
                              {service.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-900 text-right">
                              {service.price.toLocaleString('vi-VN')}đ
                            </td>
                            <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                              {(
                                service.price * service.quantity
                              ).toLocaleString('vi-VN')}
                              đ
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-gray-50">
                        <tr>
                          <td
                            colSpan={4}
                            className="px-4 py-3 text-sm font-semibold text-gray-900 text-right"
                          >
                            Tổng dịch vụ:
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-blue-600 text-right">
                            {totals.services.toLocaleString('vi-VN')}đ
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {/* Prescriptions Section */}
              {data.unpaidPrescriptions.length > 0 && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Pill className="w-5 h-5 text-green-600" />
                    Đơn thuốc chưa thanh toán ({data.unpaidPrescriptions.length}
                    )
                  </h4>
                  {data.unpaidPrescriptions.map((prescription, index) => (
                    <div
                      key={prescription.id}
                      className="mb-4 border border-gray-200 rounded-lg overflow-hidden"
                    >
                      <div className="bg-green-50 px-4 py-2 flex justify-between items-center">
                        <span className="font-medium text-gray-900">
                          Đơn thuốc #{index + 1}
                        </span>
                        <span className="text-sm text-gray-500">
                          Ngày:{' '}
                          {new Date(prescription.createdAt).toLocaleDateString(
                            'vi-VN'
                          )}
                        </span>
                      </div>
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Tên thuốc
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                              SL
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                              Đơn giá
                            </th>
                            <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">
                              Thành tiền
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {prescription.medicineUsages?.map(
                            (medicine, mIndex) => (
                              <tr key={mIndex} className="hover:bg-gray-50">
                                <td className="px-4 py-2 text-sm text-gray-900">
                                  {medicine.drugName}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900 text-center">
                                  {medicine.quantity}
                                </td>
                                <td className="px-4 py-2 text-sm text-gray-900 text-right">
                                  {(
                                    medicine.price ||
                                    medicine.medicine?.price ||
                                    0
                                  ).toLocaleString('vi-VN')}
                                  đ
                                </td>
                                <td className="px-4 py-2 text-sm font-medium text-gray-900 text-right">
                                  {(
                                    medicine.price * medicine.quantity
                                  ).toLocaleString('vi-VN')}
                                  đ
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                        <tfoot className="bg-gray-50">
                          <tr>
                            <td
                              colSpan={3}
                              className="px-4 py-2 text-sm font-semibold text-gray-900 text-right"
                            >
                              Tổng đơn thuốc:
                            </td>
                            <td className="px-4 py-2 text-sm font-bold text-green-600 text-right">
                              {totals.prescriptions.toLocaleString('vi-VN')}đ
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  ))}
                </div>
              )}

              {/* Total Summary */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Tổng dịch vụ y tế:</span>
                  <span className="font-medium">
                    {totals.services.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Tổng đơn thuốc:</span>
                  <span className="font-medium">
                    {totals.prescriptions.toLocaleString('vi-VN')}đ
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-lg font-semibold text-gray-900">
                    Tổng tạm tính:
                  </span>
                  <span className="text-xl font-bold text-red-600">
                    {totals.total.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              {/* Create Invoice Button */}
              <div className="mt-6 flex justify-end">
                <CommonButton
                  text="Tạo hóa đơn"
                  onClick={handleCreateInvoice}
                  color="#10B981"
                  startIcon={<FileText className="w-4 h-4" />}
                  className="!px-6"
                />
              </div>
            </div>
          ) : (
            /* No Results */
            <div className="bg-white rounded-lg shadow p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Không tìm thấy kết quả
              </h3>
              <p className="text-gray-500">
                Không tìm thấy bệnh nhân với mã "{searchedPatientId}". Vui lòng
                kiểm tra lại mã bệnh nhân.
              </p>
            </div>
          )}
        </>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <CircularProgress size={40} />
          <p className="mt-4 text-gray-500">Đang tìm kiếm...</p>
        </div>
      )}
    </div>
  );
}
