import ICGoogle from '@components/Icon/ICGoogle';
import { Button, CircularProgress, Divider } from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ErrorMessage from '@components/ErrorMessage';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { loginUser } from '@redux/slices/AuthSlice';
import ApiAuth from '@api/ApiAuth';
import { LoginDto, LoginDataDto } from '@dto/auth.dto';
import { IDataError, ValidationErrorDetail } from '@api/Fetcher';
import { useMutation } from '@tanstack/react-query';
import CommonInput from '@components/CommonInput';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import clsx from 'clsx';
import { EUserRole } from 'src/types';
import ModelGetUrl from './components/ModalGetUrl';
import { openModalLogin } from '@redux/slices/ModalSlice';

interface ILoginProps {
  className?: string;
  onSucees?: () => void;
}

export default function Login({ className, onSucees }: ILoginProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [validationErrs, setValidationErrs] = useState<Record<string, string>>(
    {}
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginDataDto>({
    resolver: zodResolver(LoginDto),
  });
  const isAfterPostMessage = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) {
        return;
      }

      const { type, data, error } = event.data;

      if (type === 'GOOGLE_LOGIN_SUCCESS' || type === 'GOOGLE_LOGIN_ERROR') {
        isAfterPostMessage.current = true;
        setIsLoading(false);
      }

      if (type === 'GOOGLE_LOGIN_SUCCESS') {
        dispatch(loginUser(data));
        dispatch(openModalLogin(false));
        toast.success('Đăng nhập thành công!');
        const role = data.user.role?.name;
        setTimeout(() => {
          switch (role) {
            case EUserRole.PATIENT:
              navigate('/', { replace: true });
              break;
            case EUserRole.ADMIN:
              navigate('/admin', { replace: true });
              break;
            case EUserRole.DOCTOR:
              navigate('/doctor', { replace: true });
              break;
            default:
              navigate('/', { replace: true });
          }
        }, 500);
      } else if (type === 'GOOGLE_LOGIN_ERROR') {
        toast.error(error?.message || 'Đăng nhập Google thất bại!');
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [dispatch, navigate]);

  const { mutate, isPending } = useMutation({
    mutationFn: ApiAuth.loginByEmailPassword,
    onMutate: () => {
      setValidationErrs({});
    },
    onSuccess: async (data) => {
      dispatch(loginUser(data));
      onSucees?.();
      toast.success('Đăng nhập thành công!');
      const role = data.user.role?.name;

      setTimeout(() => {
        switch (role) {
          case EUserRole.PATIENT:
            navigate('/', { replace: true });
            break;
          case EUserRole.ADMIN:
            navigate('/admin', { replace: true });
            break;
          case EUserRole.DOCTOR:
            navigate('/doctor', { replace: true });
            break;
          default:
            navigate('/', { replace: true });
        }
      }, 100);
    },
    onError: (error: IDataError<ValidationErrorDetail>) => {
      if (error.errors && error.errors.length > 0) {
        const errorMap: Record<string, string> = {};
        error.errors.forEach((err) => {
          errorMap[err.field] = err.message;
        });
        setValidationErrs(errorMap);
      } else {
        toast.error(error.errorMessage || 'Đăng nhập thất bại');
      }
    },
  });

  const onSubmit = (data: LoginDataDto) => {
    mutate(data);
  };

  const handleLoginGoogle = (url: string) => {
    setIsLoading(true);
    isAfterPostMessage.current = false;

    const windowWidth = window.innerWidth
      ? window.innerWidth
      : document.documentElement.clientWidth
        ? document.documentElement.clientWidth
        : screen.width;

    const windowHeight = window.innerHeight
      ? window.innerHeight
      : document.documentElement.clientHeight
        ? document.documentElement.clientHeight
        : screen.height;

    const popupWidth = Math.min(1200, windowWidth - 20);
    const popupHeight = Math.min(800, windowHeight - 20);

    const left = Math.round((windowWidth - popupWidth) / 2);
    const top = Math.round((windowHeight - popupHeight) / 2);

    const popup = window.open(
      url,
      '_blank',
      `width=${popupWidth},height=${popupHeight},top=${top},left=${left},resizable=yes,scrollbars=yes`
    );

    if (!popup || typeof popup.closed === 'undefined') {
      toast.error('Popup bị chặn! Vui lòng cho phép popup trong trình duyệt.');
      setIsLoading(false);
      return;
    }

    const checkPopup = setInterval(() => {
      if (popup?.closed) {
        if (!isAfterPostMessage.current) {
          setIsLoading(false);
          toast.error('Đăng nhập thất bại. Vui lòng thử lại!');
        }
        clearInterval(checkPopup);
      }
    }, 500);
  };

  return (
    <div
      className={clsx(
        'w-[90%] max-w-[600px] p-8 rounded-lg shadow-[2px_2px_8px_rgba(0,0,0,0.1),-2px_-2px_8px_rgba(0,0,0,0.1)] space-y-6',
        className
      )}
    >
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-800">Đăng nhập</h2>
        <p className="text-gray-600 mt-2">Vui lòng đăng nhập để tiếp tục</p>
      </div>
      <div className="flex flex-col gap-2">
        <CommonInput
          icon={EmailIcon}
          label="Email"
          type="email"
          placeholder="Nhập email"
          {...register('email')}
          error={!!errors.email}
        />

        <ErrorMessage
          message={errors.email?.message || validationErrs['email']}
        />
      </div>
      <div className="flex flex-col gap-2">
        <CommonInput
          icon={LockIcon}
          label="Mật khẩu"
          type="password"
          placeholder="Nhập mật khẩu"
          showPassword
          {...register('password')}
          error={!!errors.password}
        />

        <ErrorMessage
          message={errors.password?.message || validationErrs['password']}
        />
      </div>
      <Divider>
        <p className="text-[16px]">Hoặc</p>
      </Divider>
      <div className="flex flex-col gap-4">
        <Button
          variant="outlined"
          sx={{
            borderColor: '#d1d5db',
            textTransform: 'none',
          }}
          onClick={() => setOpen(true)}
        >
          <span className="flex">
            <ICGoogle />
            <span className="ml-2 text-black">Đăng nhập với Google</span>
            {isLoading && (
              <CircularProgress size={20} className="ml-2" color="inherit" />
            )}
          </span>
        </Button>
      </div>
      <div className="flex items-center justify-end">
        <Link to="/auth/forgot-password">
          <p className="text-[#2563eb] font-[500]">Quên mật khẩu?</p>
        </Link>
      </div>
      <Button
        variant="contained"
        fullWidth
        sx={{
          backgroundColor: '#2563eb',
          textTransform: 'none',
        }}
        loading={isPending ?? null}
        onClick={handleSubmit(onSubmit)}
      >
        Đăng nhập
      </Button>
      <div className="text-center">
        <p className="text-gray-600">
          Chưa có tài khoản?{' '}
          <Link
            to="/auth/register"
            className="text-blue-600 hover:underline font-medium"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
      <ModelGetUrl
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={handleLoginGoogle}
      />
    </div>
  );
}
