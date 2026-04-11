import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { EPaymentMethod, EPaymentStatus } from '@src/types';
import {
  ArrowLeftIcon,
  CreditCardIcon,
  BanknoteIcon,
  CheckCircle,
} from 'lucide-react';
import { CircularProgress } from '@mui/material';
import ApiPayment from '@src/api/ApiPayment';
import ApiInvoice from '@src/api/ApiInvoice';
import QUERY_KEY from '@src/api/QueryKey';
import { toast } from 'react-toastify';
import { tryCatch } from '@src/utils/handleError';

const FRONTEND_BASE_URL = import.meta.env.VITE_FRONTEND_BASE_URL as string;

export default function PaymentCheckoutPage() {
  const navigate = useNavigate();
  const { invoiceId } = useParams<{ invoiceId: string }>();

  const [paymentMethod, setPaymentMethod] = useState<EPaymentMethod | null>(
    null
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [cashReceived, setCashReceived] = useState<string>('');

  // Fetch invoice detail from API
  const {
    data: invoice,
    isLoading,
    isError,
  } = useQuery({
    queryKey: [QUERY_KEY.INVOICE.GET_INVOICE_BY_ID, invoiceId],
    queryFn: () => ApiInvoice.getDetailInvoice(invoiceId!),
    enabled: !!invoiceId,
  });

  const { servicesTotal, medicinesTotal } = invoice?.computedTotal
    ?.breakdown || {
    servicesTotal: 0,
    medicinesTotal: 0,
    serviceCount: 0,
    medicineCount: 0,
  };

  const totalAmount = invoice?.computedTotal?.totalAmount || 0;
  const insurancePayment = invoice?.computedTotal?.insuranceAmount || 0;
  const discount = invoice?.computedTotal?.discountAmount || 0;

  // Calculate change amount
  const cashReceivedNumber = parseFloat(cashReceived) || 0;
  const changeAmount = cashReceivedNumber - totalAmount;
  const isValidCashAmount = cashReceivedNumber >= totalAmount;

  const handlePaymentMethodChange = (method: EPaymentMethod) => {
    setPaymentMethod(method);
    // Reset cash input when changing method
    if (method !== EPaymentMethod.CASH_ON_DELIVERY) {
      setCashReceived('');
    }
  };

  const handleCashReceivedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (value === '' || /^\d+$/.test(value)) {
      setCashReceived(value);
    }
  };

  const handleCompletePayment = async () => {
    // Validate invoice
    if (!invoiceId) {
      toast.error('Không tìm thấy thông tin hóa đơn');
      return;
    }

    // Validate payment method
    if (!paymentMethod) {
      toast.warning('Vui lòng chọn phương thức thanh toán');
      return;
    }

    // Validate cash payment
    if (paymentMethod === EPaymentMethod.CASH_ON_DELIVERY) {
      if (!cashReceived || cashReceivedNumber < totalAmount) {
        toast.warning('Số tiền nhận phải lớn hơn hoặc bằng số tiền phải trả');
        return;
      }
    }

    setIsProcessing(true);

    try {
      // Call API to create payment
      await ApiPayment.createNewPayment({
        invoiceId: invoiceId,
        paymentMethod: paymentMethod,
      });
      toast.success('Thanh toán thành công!');
      navigate('/admin/invoices');
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          'Thanh toán thất bại. Vui lòng thử lại.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCancel = () => {
    const confirmCancel = window.confirm('Bạn có chắc muốn hủy thanh toán?');
    if (confirmCancel) {
      navigate(-1);
    }
  };

  const getLinkPaymentUrl = async () => {
    const [res, err] = await tryCatch(
      ApiPayment.getLinkPaymentUrl(
        invoiceId!,
        'vnpay',
        `${FRONTEND_BASE_URL}/payments/callback/status`
      )
    );
    if (err) {
      toast.error(
        'Đã có lỗi xảy ra với phương thức thanh toán này. Vui lòng thử lại sau hoặc chọn phương thức khác.'
      );
      return;
    }
    if (res) {
      if (res.paymentUrl) {
        window.location.href = res.paymentUrl;
      }
    }
  };

  const paymentMethods = [
    {
      value: EPaymentMethod.CASH_ON_DELIVERY,
      label: 'Tiền mặt',
      icon: <BanknoteIcon className="w-6 h-6" />,
      description: 'Thanh toán bằng tiền mặt tại quầy',
    },
    {
      value: EPaymentMethod.CREDIT_CARD,
      label: 'VN PAY',
      icon: <CreditCardIcon className="w-6 h-6" />,
      description: 'Thanh toán bằng VN PAY',
    },
  ];

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <CircularProgress size={40} />
      </div>
    );
  }

  // Error state
  if (isError || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Không tìm thấy thông tin hóa đơn</p>
          <button
            onClick={() => navigate('/admin/invoices')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại danh sách hóa đơn
          </button>
        </div>
      </div>
    );
  }

  // Check if already paid
  if (invoice.payment?.status === EPaymentStatus.COMPLETED) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Hóa đơn đã được thanh toán
          </h2>
          <p className="text-gray-500 mb-4">
            Hóa đơn này đã được thanh toán thành công trước đó.
          </p>
          <button
            onClick={() => navigate('/admin/invoices')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại danh sách hóa đơn
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeftIcon className="w-5 h-5 mr-2" />
            <span>Quay lại</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            Thanh toán hóa đơn
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin thanh toán
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã hóa đơn:</span>
                  <span className="font-medium text-gray-900">
                    {invoice.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã bệnh nhân:</span>
                  <span className="font-medium text-gray-900">
                    {invoice.patientId || '---'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tên bệnh nhân:</span>
                  <span className="font-medium text-gray-900">
                    {invoice.patient?.fullName || '---'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Số điện thoại:</span>
                  <span className="font-medium text-gray-900">
                    {invoice.patient?.phone || '---'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Chọn phương thức thanh toán
              </h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-start space-x-4 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      paymentMethod === method.value
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) =>
                        handlePaymentMethodChange(
                          e.target.value as EPaymentMethod
                        )
                      }
                      className="mt-1 w-5 h-5 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div
                          className={
                            paymentMethod === method.value
                              ? 'text-blue-600'
                              : 'text-gray-600'
                          }
                        >
                          {method.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {method.label}
                          </p>
                          <p className="text-sm text-gray-500">
                            {method.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Cash Payment Details */}
            {paymentMethod === EPaymentMethod.CASH_ON_DELIVERY && (
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Chi tiết thanh toán tiền mặt
                </h2>

                <div className="space-y-4">
                  {/* Amount to pay */}
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">
                      Số tiền phải trả
                    </p>
                    <p className="text-2xl font-bold text-blue-600">
                      {totalAmount.toLocaleString('vi-VN')}đ
                    </p>
                  </div>

                  {/* Cash received input */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số tiền khách đưa <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cashReceived}
                        onChange={handleCashReceivedChange}
                        placeholder="Nhập số tiền..."
                        className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 transition-colors ${
                          cashReceived && !isValidCashAmount
                            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                            : 'border-gray-300 focus:border-blue-500 focus:ring-blue-200'
                        }`}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                        đ
                      </span>
                    </div>
                    {cashReceived && !isValidCashAmount && (
                      <p className="mt-2 text-sm text-red-600">
                        Số tiền nhận phải lớn hơn hoặc bằng số tiền phải trả
                      </p>
                    )}
                  </div>

                  {/* Change amount */}
                  {cashReceived && isValidCashAmount && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">
                        Tiền thừa trả khách
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {changeAmount.toLocaleString('vi-VN')}đ
                      </p>
                    </div>
                  )}

                  {/* Quick amount buttons */}
                  <div className="pt-2">
                    <p className="text-sm font-medium text-gray-700 mb-3">
                      Chọn nhanh số tiền:
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        totalAmount,
                        Math.ceil(totalAmount / 100000) * 100000,
                        Math.ceil(totalAmount / 500000) * 500000,
                        Math.ceil(totalAmount / 1000000) * 1000000,
                      ]
                        .filter(
                          (value, index, self) => self.indexOf(value) === index
                        ) // Remove duplicates
                        .slice(0, 6) // Limit to 6 buttons
                        .map((amount) => (
                          <button
                            key={amount}
                            onClick={() => setCashReceived(amount.toString())}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 hover:border-gray-400 transition-colors"
                          >
                            {amount.toLocaleString('vi-VN')}đ
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 lg:sticky lg:top-20">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Chi tiết thanh toán
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tiền dịch vụ:</span>
                  <span className="font-medium text-gray-900">
                    {servicesTotal.toLocaleString('vi-VN')}đ
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tiền thuốc:</span>
                  <span className="font-medium text-gray-900">
                    {medicinesTotal.toLocaleString('vi-VN')}đ
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-900">Tổng cộng:</span>
                    <span className="text-gray-900">
                      {totalAmount.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                </div>

                {insurancePayment > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">BHYT chi trả:</span>
                    <span className="font-medium text-green-600">
                      -{insurancePayment.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                )}

                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-600">Giảm giá:</span>
                    <span className="font-medium text-orange-600">
                      -{discount.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                )}

                <div className="border-t-2 border-gray-300 pt-4">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 mb-2">
                      Số tiền phải trả
                    </p>
                    <p className="text-3xl font-bold text-blue-600">
                      {totalAmount.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>

                {invoice.healthInsurance && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-xs text-green-700">
                      Đã áp dụng BHYT: {invoice.healthInsurance.insuranceId}
                    </p>
                    <p className="text-xs text-green-600">
                      Mức chi trả: {invoice.insuranceCoverageAmount}%
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-6 space-y-3">
                {paymentMethod === EPaymentMethod.CASH_ON_DELIVERY ? (
                  <button
                    onClick={handleCompletePayment}
                    disabled={!paymentMethod || isProcessing}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-lg"
                  >
                    {isProcessing ? 'Đang xử lý...' : 'Xác nhận thanh toán'}
                  </button>
                ) : (
                  <button
                    onClick={getLinkPaymentUrl}
                    disabled={!paymentMethod}
                    className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-lg"
                  >
                    Tiến hành thanh toán
                  </button>
                )}

                <button
                  onClick={handleCancel}
                  disabled={isProcessing}
                  className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 transition-colors font-medium"
                >
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
