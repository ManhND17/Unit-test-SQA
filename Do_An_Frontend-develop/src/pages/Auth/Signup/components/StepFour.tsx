import { useEffect, useRef, useState } from 'react';
import {
  Button,
  CircularProgress,
  Typography,
  Box,
  TextField,
} from '@mui/material';
import { ShieldCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import ApiAuth, { IDataResponseByEmailPassword } from '@api/ApiAuth';
import ErrorMessage from '@components/ErrorMessage';
import { tryCatch } from '@utils/handleError';
import { useNavigate } from 'react-router-dom';

interface IStepFourProps {
  data: IDataResponseByEmailPassword;
}
export default function StepFour({ data }: IStepFourProps) {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSendOTPSuccess, setIsSendOTPSuccess] = useState(
    data.otpResult.success
  );
  const [timeLeft, setTimeLeft] = useState(data.otpResult.time);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '').slice(0, 6);
    setOtp(value);
  };

  const handleResendOTP = async () => {
    const [res, err] = await tryCatch(
      ApiAuth.requestResendOTP(data.data.user.email)
    );

    if (err) {
      toast.error(err.errorMessage || 'Gửi lại OTP thất bại');
      setIsSendOTPSuccess(false);
      return;
    }

    if (res) {
      toast.success('Đã gửi lại mã OTP');
      setIsSendOTPSuccess(true);
      setTimeLeft(res.time);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) {
              clearInterval(timerRef.current);
              timerRef.current = null;
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    if (timeLeft <= 0) {
      return;
    }
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, []);

  const handleSubmit = async () => {
    if (otp.length !== 6) {
      toast.warn('Mã OTP phải có 6 chữ số');
      return;
    }
    setIsVerifying(true);
    const [res, err] = await tryCatch(
      ApiAuth.verifyOTP(otp, data.data.user.email)
    );
    setIsVerifying(false);
    if (err) {
      toast.error(err.errorMessage || 'Mã OTP không hợp lệ');
      return;
    }
    if (res) {
      toast.success('Xác thực OTP thành công!');
      setTimeout(() => {
        navigate('/auth/login');
      }, 1000);
    }
  };

  return (
    <Box
      className="w-full max-w-md mx-auto bg-white/80 rounded-xl shadow-lg p-8 flex flex-col items-center gap-6 backdrop-blur-md"
      sx={{ mt: 4 }}
    >
      <ShieldCheck size={40} className="text-blue-500 mb-2" />
      <Typography variant="h6" className="font-semibold text-center">
        Xác thực OTP
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        className="text-center"
      >
        Vui lòng nhập mã OTP đã gửi về số điện thoại của bạn để hoàn tất đăng
        ký.
      </Typography>
      {!isSendOTPSuccess && (
        <ErrorMessage message="Gửi OTP thất bại. Vui lòng nhấn nút thử lại." />
      )}
      <Box className="w-full flex flex-col items-center gap-4">
        <div className="flex gap-2 w-full items-center">
          <TextField
            label="Mã OTP"
            value={otp}
            onChange={handleChange}
            inputProps={{
              maxLength: 6,
              inputMode: 'numeric',
              pattern: '[0-9]*',
            }}
            fullWidth
            variant="outlined"
            size="medium"
            sx={{
              letterSpacing: 8,
              textAlign: 'center',
              fontSize: 24,
              flex: 1,
            }}
          />
          <p className="text-red-500">{timeLeft} s</p>
        </div>
        <Button
          type="button"
          variant="contained"
          color="primary"
          disabled={isVerifying || otp.length !== 6}
          fullWidth
          size="large"
          sx={{ borderRadius: 2, fontWeight: 600 }}
          onClick={handleSubmit}
        >
          {isVerifying ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Xác nhận'
          )}
        </Button>
      </Box>
      <div>
        <p>
          Không nhận được mã OTP?{' '}
          <span
            className="text-blue-500 font-bold text-xl underline cursor-pointer hover:text-blue-600"
            onClick={handleResendOTP}
          >
            Gửi lại
          </span>
        </p>
      </div>
    </Box>
  );
}
