import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import QUERY_KEY from '@src/api/QueryKey';
import ApiPayment from '@src/api/ApiPayment';
import ApiInvoice from '@src/api/ApiInvoice';
import { EPaymentMethod, EPaymentStatus } from '@src/types';
import {
  ArrowLeftIcon,
  UserIcon,
  CalendarIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  BanknoteIcon,
  BuildingIcon,
  FileTextIcon,
  PillIcon,
  ActivityIcon,
} from 'lucide-react';
import { Skeleton } from '@mui/material';

export default function PaymentDetailPage() {
  const { paymentId } = useParams<{ paymentId: string }>();
  const navigate = useNavigate();

  // Fetch payment detail
  const { data: paymentData, isLoading: isLoadingPayment } = useQuery({
    queryKey: [QUERY_KEY.PAYMENT.GET_PAYMENT_BY_ID, paymentId],
    queryFn: () => ApiPayment.getPaymentDetailById(paymentId!),
    enabled: !!paymentId,
  });

  // Fetch invoice detail to get services and medicines
  const invoiceId = paymentData?.invoiceId;
  const { data: invoiceData, isLoading: isLoadingInvoice } = useQuery({
    queryKey: [QUERY_KEY.INVOICE.GET_INVOICE_BY_ID, invoiceId],
    queryFn: () => ApiInvoice.getDetailInvoice(invoiceId!),
    enabled: !!invoiceId,
  });

  const isLoading = isLoadingPayment || isLoadingInvoice;

  // Get payment method info
  const getPaymentMethodInfo = (method: EPaymentMethod) => {
    switch (method) {
      case EPaymentMethod.CASH_ON_DELIVERY:
        return {
          label: 'Tiền mặt',
          icon: <BanknoteIcon className="w-5 h-5" />,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      case EPaymentMethod.CREDIT_CARD:
        return {
          label: 'Thẻ tín dụng / Thẻ ghi nợ',
          icon: <CreditCardIcon className="w-5 h-5" />,
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
        };
      case EPaymentMethod.BANK_TRANSFER:
        return {
          label: 'Chuyển khoản ngân hàng',
          icon: <BuildingIcon className="w-5 h-5" />,
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
        };
      default:
        return {
          label: 'Không xác định',
          icon: <CreditCardIcon className="w-5 h-5" />,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        };
    }
  };

  // Get payment status info
  const getPaymentStatusInfo = (status: EPaymentStatus) => {
    switch (status) {
      case EPaymentStatus.COMPLETED:
        return {
          label: 'Đã thanh toán',
          icon: <CheckCircleIcon className="w-5 h-5" />,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
        };
      case EPaymentStatus.PENDING:
        return {
          label: 'Đang chờ',
          icon: <ClockIcon className="w-5 h-5" />,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
        };
      case EPaymentStatus.FAILED:
        return {
          label: 'Thất bại',
          icon: <XCircleIcon className="w-5 h-5" />,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
        };
      default:
        return {
          label: 'Không xác định',
          icon: <ClockIcon className="w-5 h-5" />,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
        };
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const year = date.getFullYear();
      return `${hours}:${minutes} - ${day}/${month}/${year}`;
    } catch {
      return dateString;
    }
  };

  // Calculate totals
  const calculateTotals = () => {
    if (!invoiceData)
      return {
        servicesTotal: 0,
        medicinesTotal: 0,
        insurancePayment: 0,
        discount: 0,
      };

    const servicesTotal =
      invoiceData.visitServices?.reduce(
        (sum, service) => sum + service.price,
        0
      ) || 0;

    const medicinesTotal =
      invoiceData.prescriptions?.reduce((sum, prescription) => {
        const prescriptionTotal =
          prescription.medicineUsages?.reduce(
            (medSum, med) => medSum + med.price * med.quantity,
            0
          ) || 0;
        return sum + prescriptionTotal;
      }, 0) || 0;

    // Get insurance and discount from computedTotal if available
    const insurancePayment = invoiceData.computedTotal?.insuranceAmount || 0;
    const discount =
      invoiceData.computedTotal?.discountAmount ||
      invoiceData.discountAmount ||
      0;

    return { servicesTotal, medicinesTotal, insurancePayment, discount };
  };

  const totals = calculateTotals();
  const paymentMethodInfo = paymentData?.paymentMethod
    ? getPaymentMethodInfo(paymentData.paymentMethod)
    : null;
  const statusInfo = paymentData?.status
    ? getPaymentStatusInfo(paymentData.status)
    : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton variant="rectangular" height={60} />
          <Skeleton variant="rectangular" height={200} />
          <Skeleton variant="rectangular" height={300} />
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Không tìm thấy thanh toán
          </h2>
          <button
            onClick={() => navigate('/admin/invoices')}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay về danh sách
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            <span>Quay lại</span>
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Chi tiết thanh toán
              </h1>
              <p className="text-gray-600 mt-1">Mã thanh toán: {paymentId}</p>
            </div>
            {statusInfo && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor}`}
              >
                <span className={statusInfo.color}>{statusInfo.icon}</span>
                <span className={`font-semibold ${statusInfo.color}`}>
                  {statusInfo.label}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <UserIcon className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Thông tin bệnh nhân
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Họ và tên</p>
                  <p className="text-base font-semibold text-gray-900">
                    {paymentData.invoice?.patient?.fullName || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-base font-semibold text-gray-900">
                    {paymentData.invoice?.patient?.email || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mã bệnh nhân</p>
                  <p className="text-base font-semibold text-gray-900">
                    {invoiceData?.patientId || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Mã hóa đơn</p>
                  <p className="text-base font-semibold text-gray-900">
                    {paymentData.invoiceId}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileTextIcon className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Thông tin thanh toán
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-2">
                    Phương thức thanh toán
                  </p>
                  {paymentMethodInfo && (
                    <div
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${paymentMethodInfo.bgColor} ${paymentMethodInfo.borderColor} w-fit`}
                    >
                      <span className={paymentMethodInfo.color}>
                        {paymentMethodInfo.icon}
                      </span>
                      <span
                        className={`font-medium ${paymentMethodInfo.color}`}
                      >
                        {paymentMethodInfo.label}
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nhân viên thu ngân</p>
                  <p className="text-base font-semibold text-gray-900">
                    {paymentData.userName || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Ngày tạo</p>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    <p className="text-base font-semibold text-gray-900">
                      {formatDate(paymentData.createdAt)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cập nhật lần cuối</p>
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-gray-500" />
                    <p className="text-base font-semibold text-gray-900">
                      {formatDate(paymentData.updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Services Used */}
            {invoiceData?.visitServices &&
              invoiceData.visitServices.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <ActivityIcon className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Dịch vụ sử dụng
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                            Tên dịch vụ
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                            Đơn giá
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                            SL
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                            Thành tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceData.visitServices.map((service, index) => (
                          <tr
                            key={service.id || index}
                            className="border-b border-gray-100 hover:bg-gray-50"
                          >
                            <td className="py-3 px-4 text-sm text-gray-900">
                              {service.medicalService?.name || 'Dịch vụ'}
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900 text-right">
                              {service.price.toLocaleString('vi-VN')}đ
                            </td>
                            <td className="py-3 px-4 text-sm text-gray-900 text-center">
                              1
                            </td>
                            <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                              {service.price.toLocaleString('vi-VN')}đ
                            </td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td
                            colSpan={3}
                            className="py-3 px-4 text-sm font-semibold text-gray-900 text-right"
                          >
                            Tổng tiền dịch vụ:
                          </td>
                          <td className="py-3 px-4 text-sm font-bold text-blue-600 text-right">
                            {totals.servicesTotal.toLocaleString('vi-VN')}đ
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

            {/* Medicines Used */}
            {invoiceData?.prescriptions &&
              invoiceData.prescriptions.length > 0 && (
                <div className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <PillIcon className="w-6 h-6 text-blue-600" />
                    <h2 className="text-xl font-semibold text-gray-900">
                      Thuốc sử dụng
                    </h2>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">
                            Tên thuốc
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                            Đơn vị
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                            Đơn giá
                          </th>
                          <th className="text-center py-3 px-4 text-sm font-semibold text-gray-700">
                            SL
                          </th>
                          <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">
                            Thành tiền
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoiceData.prescriptions.flatMap((prescription) =>
                          (prescription?.medicineUsages || []).map(
                            (medicine, index) => (
                              <tr
                                key={medicine.id || index}
                                className="border-b border-gray-100 hover:bg-gray-50"
                              >
                                <td className="py-3 px-4 text-sm text-gray-900">
                                  {medicine.medicine?.name || 'Thuốc'}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900 text-center">
                                  {medicine.medicine?.unit || 'Viên'}
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900 text-right">
                                  {medicine.price.toLocaleString('vi-VN')}đ
                                </td>
                                <td className="py-3 px-4 text-sm text-gray-900 text-center">
                                  {medicine.quantity}
                                </td>
                                <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                                  {(
                                    medicine.price * medicine.quantity
                                  ).toLocaleString('vi-VN')}
                                  đ
                                </td>
                              </tr>
                            )
                          )
                        )}
                        <tr className="bg-gray-50">
                          <td
                            colSpan={4}
                            className="py-3 px-4 text-sm font-semibold text-gray-900 text-right"
                          >
                            Tổng tiền thuốc:
                          </td>
                          <td className="py-3 px-4 text-sm font-bold text-blue-600 text-right">
                            {totals.medicinesTotal.toLocaleString('vi-VN')}đ
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
          </div>

          {/* Sidebar - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 lg:sticky lg:top-20">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Tóm tắt thanh toán
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tiền dịch vụ:</span>
                  <span className="font-medium text-gray-900">
                    {totals.servicesTotal.toLocaleString('vi-VN')}đ
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tiền thuốc:</span>
                  <span className="font-medium text-gray-900">
                    {totals.medicinesTotal.toLocaleString('vi-VN')}đ
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-900">Tổng cộng:</span>
                    <span className="text-gray-900">
                      {(
                        totals.servicesTotal + totals.medicinesTotal
                      ).toLocaleString('vi-VN')}
                      đ
                    </span>
                  </div>
                </div>

                {totals.insurancePayment > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">BHYT chi trả:</span>
                    <span className="font-medium text-green-600">
                      -{totals.insurancePayment.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                )}

                {totals.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-600">Giảm giá:</span>
                    <span className="font-medium text-orange-600">
                      -{totals.discount.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                )}

                <div className="border-t-2 border-gray-300 pt-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Số tiền đã thanh toán
                    </p>
                    <p className="text-3xl font-bold text-green-600">
                      {paymentData.amount.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => window.print()}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  In hóa đơn
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
