import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Divider,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { CheckCircle, XCircle, Home, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import ApiPayment from '@src/api/ApiPayment';
import { VNPayReturnResponse } from '@src/dto/payment.dto';
import { IRootState } from '@src/redux/store';

const PaymentStatus = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const userRole = useSelector(
    (state: IRootState) => state.auth.user?.role?.name
  );

  const composedQueryParams = {
    vnp_Amount: searchParams.get('vnp_Amount') || '',
    vnp_BankCode: searchParams.get('vnp_BankCode') || undefined,
    vnp_BankTranNo: searchParams.get('vnp_BankTranNo') || undefined,
    vnp_CardType: searchParams.get('vnp_CardType') || undefined,
    vnp_OrderInfo: searchParams.get('vnp_OrderInfo') || '',
    vnp_PayDate: searchParams.get('vnp_PayDate') || '',
    vnp_ResponseCode: searchParams.get('vnp_ResponseCode') || '',
    vnp_TmnCode: searchParams.get('vnp_TmnCode') || '',
    vnp_TransactionNo: searchParams.get('vnp_TransactionNo') || undefined,
    vnp_TransactionStatus: searchParams.get('vnp_TransactionStatus') || '',
    vnp_TxnRef: searchParams.get('vnp_TxnRef') || '',
    vnp_SecureHash: searchParams.get('vnp_SecureHash') || '',
  };

  const vnpTxnRef = composedQueryParams.vnp_TxnRef;
  const vnpSecureHash = composedQueryParams.vnp_SecureHash;

  const {
    data: paymentData,
    isLoading,
    error: queryError,
  } = useQuery<VNPayReturnResponse, Error>({
    queryKey: ['payment', vnpTxnRef, vnpSecureHash],
    queryFn: () => ApiPayment.handleVNPayReturn(composedQueryParams),
    enabled: Boolean(vnpTxnRef && vnpSecureHash),
  });

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr.length !== 14) return dateStr;
    // Format: YYYYMMDDHHmmss -> DD/MM/YYYY HH:mm:ss
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.substring(8, 10);
    const minute = dateStr.substring(10, 12);
    const second = dateStr.substring(12, 14);
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };

  // Xử lý điều hướng về trang chủ
  const handleGoHome = () => {
    if (userRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  // Render icon và màu sắc theo trạng thái
  const getStatusDisplay = () => {
    if (!paymentData) return null;

    const statusConfig = {
      completed: {
        icon: <CheckCircle size={64} className="text-green-500" />,
        title: 'Thanh toán thành công!',
        color: 'success' as const,
        bgColor: 'bg-green-50',
      },
      failed: {
        icon: <XCircle size={64} className="text-red-500" />,
        title: 'Thanh toán thất bại',
        color: 'error' as const,
        bgColor: 'bg-red-50',
      },
      pending: {
        icon: <Clock size={64} className="text-yellow-500" />,
        title: 'Thanh toán đang xử lý',
        color: 'warning' as const,
        bgColor: 'bg-yellow-50',
      },
      cancelled: {
        icon: <XCircle size={64} className="text-gray-500" />,
        title: 'Thanh toán đã bị hủy',
        color: 'info' as const,
        bgColor: 'bg-gray-50',
      },
    };

    const key = paymentData.status as keyof typeof statusConfig;
    return statusConfig[key] || statusConfig.failed;
  };

  // Loading state
  if (isLoading) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CircularProgress size={60} />
            <Typography variant="h6" className="mt-4">
              Đang xác thực giao dịch...
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  // Error state
  if (queryError) {
    return (
      <Box className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-8">
            <XCircle size={64} className="text-red-500 mb-4" />
            <Typography variant="h5" className="mb-4 text-center">
              Xác thực thất bại
            </Typography>
            <Alert severity="error" className="w-full mb-6">
              {queryError?.message || String(queryError)}
            </Alert>
            <Button
              variant="contained"
              color="primary"
              onClick={handleGoHome}
              startIcon={<Home size={20} />}
              fullWidth
              size="large"
            >
              Về trang chủ
            </Button>
          </CardContent>
        </Card>
      </Box>
    );
  }

  const statusDisplay = getStatusDisplay();

  return (
    <Box className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardContent className="p-8">
          {/* Header với icon và trạng thái */}
          <Box
            className={`flex flex-col items-center mb-6 p-6 rounded-lg ${statusDisplay?.bgColor}`}
          >
            {statusDisplay?.icon}
            <Typography variant="h4" className="mt-4 font-bold text-center">
              {statusDisplay?.title}
            </Typography>
            {paymentData?.message && (
              <Typography
                variant="body1"
                className="mt-2 text-center text-gray-600"
              >
                {paymentData.message}
              </Typography>
            )}
          </Box>

          <Divider className="my-6" />

          {/* Chi tiết giao dịch */}
          <Box className="space-y-4 my-3">
            <Typography variant="h6" className="font-semibold mb-4">
              Chi tiết giao dịch
            </Typography>

            <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Box>
                <Typography variant="body2" className="text-gray-500">
                  Mã giao dịch
                </Typography>
                <Typography variant="body1" className="!font-semibold">
                  {paymentData?.metadata.vnp_TxnRef || 'N/A'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" className="text-gray-500">
                  Số tiền
                </Typography>
                <Typography
                  variant="body1"
                  className="!font-semibold text-lg text-blue-600"
                >
                  {paymentData ? formatAmount(paymentData.amount) : 'N/A'}
                </Typography>
              </Box>

              {paymentData?.metadata.vnp_TransactionNo && (
                <Box>
                  <Typography variant="body2" className="text-gray-500">
                    Mã giao dịch VNPay
                  </Typography>
                  <Typography variant="body1" className="!font-semibold">
                    {paymentData.metadata.vnp_TransactionNo}
                  </Typography>
                </Box>
              )}

              {paymentData?.bankCode && (
                <Box>
                  <Typography variant="body2" className="text-gray-500">
                    Ngân hàng
                  </Typography>
                  <Typography variant="body1" className="!font-semibold">
                    {paymentData.bankCode}
                  </Typography>
                </Box>
              )}

              <Box>
                <Typography variant="body2" className="text-gray-500">
                  Thời gian thanh toán
                </Typography>
                <Typography variant="body1" className="!font-semibold">
                  {paymentData ? formatDate(paymentData.payDate) : 'N/A'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" className="text-gray-500">
                  Mã phản hồi
                </Typography>
                <Typography variant="body1" className="!font-semibold">
                  {paymentData?.responseCode || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider className="my-6" />

          {/* Action buttons */}
          <Box className="flex flex-col sm:flex-row gap-4 justify-center mt-5">
            <Button
              variant="contained"
              color="primary"
              onClick={handleGoHome}
              startIcon={<Home size={20} />}
              size="large"
              sx={{ minWidth: '200px' }}
            >
              Về trang chủ
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default PaymentStatus;
