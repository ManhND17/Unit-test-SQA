import { ArrowLeftIcon, CheckCircle, XCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EInvoiceStatus, IPayment } from '@src/types';

interface PaymentSummaryProps {
  servicesTotal: number;
  medicineTotal: number;
  insurancePayment: number;
  discount: number;
  patientTotal: number;
  handlePayment: () => Promise<void>;
  status?: EInvoiceStatus;
  payment?: IPayment | null;
}

export function PaymentSummary({
  servicesTotal,
  medicineTotal,
  insurancePayment,
  discount,
  patientTotal,
  handlePayment,
  status,
  payment,
}: PaymentSummaryProps) {
  const grandTotal = servicesTotal + medicineTotal;
  const navigate = useNavigate();

  const isPaid = status === 'paid';
  const isCancelled = status === 'cancelled';
  const isPending = status === 'pending';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Tóm tắt Hóa đơn
      </h2>

      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tổng tiền Dịch vụ:</span>
          <span className="font-medium text-gray-900">
            {servicesTotal.toLocaleString('vi-VN')}đ
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tổng tiền Thuốc (đã chọn):</span>
          <span className="font-medium text-gray-900">
            {medicineTotal.toLocaleString('vi-VN')}đ
          </span>
        </div>

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between text-sm font-medium">
            <span className="text-gray-900">TỔNG CỘNG (A):</span>
            <span className="text-gray-900">
              {grandTotal.toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-green-600">BHYT chi trả (B):</span>
          <span className="font-medium text-green-600">
            {insurancePayment.toLocaleString('vi-VN')}đ
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Giảm giá khác (C):</span>
          <span className="font-medium text-gray-900">
            {discount.toLocaleString('vi-VN')}đ
          </span>
        </div>

        <div className="border-t-2 border-gray-300 pt-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">
              TỔNG TIỀN BỆNH NHÂN TRẢ
            </p>
            <p className="text-sm text-gray-500 mb-1">(A - B - C)</p>
            <p className="text-4xl font-bold text-blue-600">
              {patientTotal.toLocaleString('vi-VN')}đ
            </p>
          </div>
        </div>
        {/* Payment Info - Show when paid */}
        {isPaid && payment && (
          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Thông tin thanh toán
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Phương thức:</span>
                <span className="font-medium text-gray-900">
                  {payment.paymentMethod === 'cash_on_delivery'
                    ? 'Tiền mặt'
                    : payment.paymentMethod === 'credit_card'
                      ? 'VN Pay'
                      : payment.paymentMethod === 'bank_transfer'
                        ? 'Chuyển khoản'
                        : 'Khác'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Thời gian:</span>
                <span className="font-medium text-gray-900">
                  {new Date(payment.createdAt).toLocaleString('vi-VN')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Số tiền:</span>
                <span className="font-medium text-green-600">
                  {payment.amount.toLocaleString('vi-VN')}đ
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate(-1)}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
            <span className="font-medium">Quay lại</span>
          </button>

          {/* Show payment button only when pending */}
          {isPending && (
            <button
              onClick={handlePayment}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
            >
              Thanh toán {patientTotal.toLocaleString('vi-VN')}đ
            </button>
          )}

          {/* Show paid status */}
          {isPaid && (
            <div className="w-full px-6 py-3 bg-green-50 border-2 border-green-500 text-green-700 rounded-lg flex items-center justify-center gap-2 font-medium text-lg">
              <CheckCircle className="w-5 h-5" />
              Đã thanh toán
            </div>
          )}

          {/* Show cancelled status */}
          {isCancelled && (
            <div className="w-full px-6 py-3 bg-red-50 border-2 border-red-500 text-red-700 rounded-lg flex items-center justify-center gap-2 font-medium text-lg">
              <XCircle className="w-5 h-5" />
              Đã hủy
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
