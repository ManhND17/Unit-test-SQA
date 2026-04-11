import { useState, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon, FileText, User, Pill, Stethoscope } from 'lucide-react';
import { CircularProgress } from '@mui/material';
import { IHealthInsurance } from '@src/types';
import ApiInvoice, { CreateInvoiceBody } from '@src/api/ApiInvoice';
import { toast } from 'react-toastify';
import QUERY_KEY from '@src/api/QueryKey';
import ApiHealthInsurance from '@src/api/ApiHealthInsurance';

export default function CreateInvoicePage() {
  const navigate = useNavigate();
  const { patientId } = useParams();

  // State
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedPrescriptions, setSelectedPrescriptions] = useState<string[]>(
    []
  );
  const [selectedInsurance, setSelectedInsurance] =
    useState<Partial<IHealthInsurance> | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountReason, setDiscountReason] = useState('');

  const { data: unpaidItems, isLoading } = useQuery({
    queryKey: ['unpaid-items', patientId],
    queryFn: () => ApiInvoice.getUnpaidItems(patientId!),
    enabled: !!patientId,
  });

  const { data: insurancesData } = useQuery({
    queryKey: [
      QUERY_KEY.INSURANCE.GET_INSURANCES_BY_USER,
      unpaidItems?.patient.id,
    ],
    queryFn: () =>
      ApiHealthInsurance.getInsurancesByUser(unpaidItems!.patient.id),
    enabled: !!unpaidItems?.patient.id,
  });

  // Create invoice mutation
  const createInvoiceMutation = useMutation({
    mutationFn: (data: CreateInvoiceBody) =>
      ApiInvoice.createInvoiceManually(data),
    onSuccess: (response) => {
      toast.success('Tạo hóa đơn thành công!');
      navigate(`/admin/payment/checkout/${response.id}`);
    },
    onError: () => {
      toast.error('Có lỗi xảy ra khi tạo hóa đơn!');
    },
  });

  // Toggle single prescription selection (for each prescription card checkbox)
  const handleTogglePrescription = useCallback((prescriptionId: string) => {
    setSelectedPrescriptions((prev) =>
      prev.includes(prescriptionId)
        ? prev.filter((id) => id !== prescriptionId)
        : [...prev, prescriptionId]
    );
  }, []);

  // Select all services
  const handleSelectAllServices = useCallback(() => {
    if (selectedServices.length === unpaidItems?.unpaidVisitServices.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(
        unpaidItems?.unpaidVisitServices.map((s) => s.id) || []
      );
    }
  }, [selectedServices.length, unpaidItems?.unpaidVisitServices]);

  // Select all prescriptions
  const handleSelectAllPrescriptions = useCallback(() => {
    if (
      selectedPrescriptions.length === unpaidItems?.unpaidPrescriptions.length
    ) {
      setSelectedPrescriptions([]);
    } else {
      setSelectedPrescriptions(
        unpaidItems?.unpaidPrescriptions.map((p) => p.id) || []
      );
    }
  }, [selectedPrescriptions.length, unpaidItems?.unpaidPrescriptions]);

  // Calculate totals with insurance coverage
  const calculations = useMemo(() => {
    const coveragePercent = selectedInsurance?.coverage ?? 0;

    // Services total
    const selectedServiceItems = unpaidItems?.unpaidVisitServices.filter((s) =>
      selectedServices.includes(s.id)
    );
    const servicesSubtotal =
      selectedServiceItems?.reduce((sum, s) => sum + s.price * s.quantity, 0) ||
      0;
    const servicesInsurance =
      selectedServiceItems?.reduce((sum, s) => {
        const insuranceRate =
          Math.min(
            s.medicalService?.percentApplyHealthInsurance ?? 0,
            coveragePercent
          ) / 100;
        return sum + s.price * s.quantity * insuranceRate;
      }, 0) || 0;

    // Prescriptions total
    const selectedPrescriptionItems = unpaidItems?.unpaidPrescriptions.filter(
      (p) => selectedPrescriptions.includes(p.id)
    );
    const prescriptionsSubtotal =
      selectedPrescriptionItems?.reduce(
        (sum, p) =>
          sum +
          (p.medicineUsages?.reduce(
            (mSum, m) =>
              mSum + (m.price || m.medicine?.price || 0) * m.quantity,
            0
          ) ?? 0),
        0
      ) || 0;
    const prescriptionsInsurance =
      selectedPrescriptionItems?.reduce((sum, p) => {
        return (
          sum +
          (p.medicineUsages?.reduce((mSum, m) => {
            const insuranceRate = coveragePercent / 100;
            return (
              mSum +
              (m.price || m.medicine?.price || 0) * m.quantity * insuranceRate
            );
          }, 0) ?? 0)
        );
      }, 0) || 0;

    const grandTotal = servicesSubtotal + prescriptionsSubtotal;
    const totalInsurance = servicesInsurance + prescriptionsInsurance;
    const patientPays = Math.max(
      0,
      grandTotal - totalInsurance - discountAmount
    );

    return {
      servicesSubtotal,
      servicesInsurance,
      prescriptionsSubtotal,
      prescriptionsInsurance,
      grandTotal,
      totalInsurance,
      patientPays,
    };
  }, [
    unpaidItems?.unpaidVisitServices,
    selectedServices,
    unpaidItems?.unpaidPrescriptions,
    selectedPrescriptions,
    selectedInsurance,
    discountAmount,
  ]);

  // Handle create invoice
  const handleCreateInvoice = async () => {
    if (selectedServices.length === 0 && selectedPrescriptions.length === 0) {
      toast.warning('Vui lòng chọn ít nhất một dịch vụ hoặc đơn thuốc!');
      return;
    }

    const patientIdValue = unpaidItems?.patient?.id;
    if (!patientIdValue) {
      toast.error('Không tìm thấy thông tin bệnh nhân. Vui lòng thử lại sau.');
      return;
    }

    const body: CreateInvoiceBody = {
      patientId: patientIdValue,
      discountAmount,
      serviceUsageIds: selectedServices,
      prescriptionIds: selectedPrescriptions,
      discountReason: discountReason || undefined,
      healthInsuranceId: selectedInsurance?.id,
    };

    createInvoiceMutation.mutate(body);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2" />
          <span>Quay lại</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Tạo hóa đơn mới
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Patient Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Thông tin bệnh nhân
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Mã bệnh nhân</p>
                <p className="text-base font-medium text-gray-900">
                  {unpaidItems?.patient.patientId}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Họ và tên</p>
                <p className="text-base font-medium text-gray-900">
                  {unpaidItems?.patient.fullName}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Số điện thoại</p>
                <p className="text-base font-medium text-gray-900">
                  {unpaidItems?.patient.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-base font-medium text-gray-900">
                  {unpaidItems?.patient.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Ngày sinh</p>
                <p className="text-base font-medium text-gray-900">
                  {unpaidItems?.patient.birthday
                    ? new Date(unpaidItems.patient.birthday).toLocaleDateString(
                        'vi-VN'
                      )
                    : '---'}
                </p>
              </div>
            </div>
          </div>

          {/* Services Table */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Dịch vụ y tế chưa thanh toán
              </h2>
              <button
                onClick={handleSelectAllServices}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                {selectedServices.length ===
                unpaidItems?.unpaidVisitServices.length
                  ? 'Bỏ chọn tất cả'
                  : 'Chọn tất cả'}
              </button>
            </div>
            {unpaidItems?.unpaidVisitServices.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                Không có dịch vụ chưa thanh toán
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Tên dịch vụ
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Đơn giá
                      </th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                        SL
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        Thành tiền
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                        % BHYT
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {unpaidItems?.unpaidVisitServices.map((service) => {
                      const isSelected = selectedServices.includes(service.id);
                      return (
                        <tr
                          key={service.id}
                          className={`${isSelected ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                        >
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">
                            {service.medicalService?.name}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900 text-right">
                            {service.price.toLocaleString('vi-VN')}đ
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900 text-center">
                            {service.quantity}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-900 text-right">
                            {(service.price * service.quantity).toLocaleString(
                              'vi-VN'
                            )}
                            đ
                          </td>
                          <td className="px-4 py-4 text-sm text-green-600 text-right">
                            {
                              service.medicalService
                                ?.percentApplyHealthInsurance
                            }
                            %
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Prescriptions Tables */}
          {unpaidItems?.unpaidPrescriptions.length === 0 ? (
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Pill className="w-5 h-5" />
                Đơn thuốc chưa thanh toán
              </h2>
              <p className="text-gray-500 text-center py-8">
                Không có đơn thuốc chưa thanh toán
              </p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Pill className="w-5 h-5" />
                  Đơn thuốc chưa thanh toán (
                  {unpaidItems?.unpaidPrescriptions.length} đơn)
                </h2>
                <button
                  onClick={handleSelectAllPrescriptions}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  {selectedPrescriptions.length ===
                  unpaidItems?.unpaidPrescriptions.length
                    ? 'Bỏ chọn tất cả'
                    : 'Chọn tất cả đơn'}
                </button>
              </div>

              {unpaidItems?.unpaidPrescriptions.map((prescription, index) => {
                const isSelected = selectedPrescriptions.includes(
                  prescription.id
                );
                const totalAmount =
                  prescription.medicineUsages?.reduce(
                    (sum, m) =>
                      sum + (m.price || m.medicine?.price || 0) * m.quantity,
                    0
                  ) || 0;

                return (
                  <div
                    key={prescription.id}
                    className={`bg-white rounded-lg shadow p-6 border-2 transition-colors ${
                      isSelected ? 'border-blue-500' : 'border-transparent'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() =>
                            handleTogglePrescription(prescription.id)
                          }
                          className="w-5 h-5 text-blue-600 rounded"
                        />
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Đơn thuốc #{index + 1}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Ngày tạo:{' '}
                            {new Date(
                              prescription.createdAt
                            ).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Tổng tiền</p>
                        <p className="font-semibold text-gray-900">
                          {totalAmount.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Tên thuốc
                            </th>
                            <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">
                              Đơn vị
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
                          {prescription.medicineUsages?.map((medicine) => {
                            const medicinePrice =
                              medicine.price || medicine.medicine?.price || 0;
                            return (
                              <tr
                                key={medicine.id}
                                className="hover:bg-gray-50"
                              >
                                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                                  {medicine.drugName}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 text-center">
                                  {medicine.medicine?.unit || 'viên'}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 text-center">
                                  {medicine.quantity}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900 text-right">
                                  {medicinePrice.toLocaleString('vi-VN')}đ
                                </td>
                                <td className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                                  {(
                                    medicinePrice * medicine.quantity
                                  ).toLocaleString('vi-VN')}
                                  đ
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Insurance Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Áp dụng quyền lợi bảo hiểm
            </h2>

            <div className="space-y-3">
              {insurancesData?.data.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Không có thông tin bảo hiểm y tế
                </p>
              ) : (
                insurancesData?.data.map((insurance) => (
                  <label
                    key={insurance.id}
                    className={`flex items-start space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                      selectedInsurance?.id === insurance.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="insurance"
                      checked={selectedInsurance?.id === insurance.id}
                      onChange={() => setSelectedInsurance(insurance)}
                      className="mt-1 w-4 h-4 text-blue-600"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        Mã: {insurance.insuranceId}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Mức hưởng: {insurance.coverage}%
                      </p>
                      <p className="text-xs text-gray-500">
                        Nơi KCB: {insurance.initial_kcb_name}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>

            {selectedInsurance && (
              <button
                onClick={() => setSelectedInsurance(null)}
                className="mt-3 text-sm text-red-600 hover:text-red-800"
              >
                Bỏ áp dụng BHYT
              </button>
            )}
          </div>

          {/* Discount Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Giảm giá
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số tiền giảm (VNĐ)
                </label>
                <input
                  type="number"
                  value={discountAmount}
                  onChange={(e) =>
                    setDiscountAmount(Number(e.target.value) || 0)
                  }
                  min={0}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lý do giảm giá
                </label>
                <input
                  type="text"
                  value={discountReason}
                  onChange={(e) => setDiscountReason(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập lý do (tùy chọn)"
                />
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Tóm tắt hóa đơn
            </h2>

            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Dịch vụ ({selectedServices.length} mục):
                </span>
                <span className="font-medium text-gray-900">
                  {calculations.servicesSubtotal.toLocaleString('vi-VN')}đ
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Thuốc ({selectedPrescriptions.length} đơn):
                </span>
                <span className="font-medium text-gray-900">
                  {calculations.prescriptionsSubtotal.toLocaleString('vi-VN')}đ
                </span>
              </div>

              <div className="border-t pt-3">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-900">TỔNG CỘNG (A):</span>
                  <span className="text-gray-900">
                    {calculations.grandTotal.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-green-600">BHYT chi trả (B):</span>
                <span className="font-medium text-green-600">
                  -{calculations.totalInsurance.toLocaleString('vi-VN')}đ
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Giảm giá (C):</span>
                <span className="font-medium text-gray-900">
                  -{discountAmount.toLocaleString('vi-VN')}đ
                </span>
              </div>

              <div className="border-t-2 border-gray-300 pt-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-1">
                    BỆNH NHÂN TRẢ (A-B-C)
                  </p>
                  <p className="text-3xl font-bold text-blue-600">
                    {calculations.patientPays.toLocaleString('vi-VN')}đ
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  onClick={() => navigate(-1)}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                  <span className="font-medium">Quay lại</span>
                </button>

                <button
                  onClick={handleCreateInvoice}
                  disabled={
                    createInvoiceMutation.isPending ||
                    (selectedServices.length === 0 &&
                      selectedPrescriptions.length === 0)
                  }
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {createInvoiceMutation.isPending ? (
                    <span className="flex items-center justify-center gap-2">
                      <CircularProgress size={20} color="inherit" />
                      Đang xử lý...
                    </span>
                  ) : (
                    `Tạo hóa đơn - ${calculations.patientPays.toLocaleString('vi-VN')}đ`
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
