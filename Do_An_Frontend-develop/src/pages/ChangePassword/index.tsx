import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Eye, Key, Lock, User, Mail, EyeOff } from 'lucide-react';
import { ApiUser } from '@api/ApiUser';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@redux/store';
import ApiAuth from '@api/ApiAuth';
import { logoutUser } from '@redux/slices/AuthSlice';

interface IPasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword = () => {
  const { user } = useSelector((state: IRootState) => state.auth);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    level: 0,
    text: '',
    color: 'bg-gray-300',
    width: 'w-[0px]',
  });
  const dispatch = useDispatch();

  const passwordForm = useForm<IPasswordFormData>({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const watchedPassword = passwordForm.watch('newPassword');

  useEffect(() => {
    const password = watchedPassword;

    if (!password) {
      setPasswordStrength({
        level: 0,
        text: '',
        color: 'bg-gray-300',
        width: 'w-[0px]',
      });
      return;
    }

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const strengthConfig = [
      { level: 0, text: 'Rất yếu', color: 'bg-red-500', width: 'w-1/5' },
      { level: 1, text: 'Yếu', color: 'bg-orange-500', width: 'w-2/5' },
      { level: 2, text: 'Trung bình', color: 'bg-yellow-500', width: 'w-3/5' },
      { level: 3, text: 'Mạnh', color: 'bg-blue-500', width: 'w-4/5' },
      { level: 4, text: 'Rất mạnh', color: 'bg-green-500', width: 'w-full' },
    ];

    const config = strengthConfig[strength - 1] || strengthConfig[0];
    setPasswordStrength(config);
  }, [watchedPassword]);

  const onPasswordSubmit = async (data: IPasswordFormData) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    if (data.newPassword.length < 8) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    setIsChangingPassword(true);
    try {
      await ApiUser.changePassword(data);
      toast.success('Đổi mật khẩu thành công');
      await ApiAuth.logOut();
      dispatch(logoutUser());
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'errors' in error &&
        Array.isArray((error as any).errors)
      ) {
        (error as any).errors.forEach((err: any) => {
          toast.error(err.message);
        });
      } else {
        toast.error((error as any)?.message || 'Đổi mật khẩu thất bại');
      }
    }
    setIsChangingPassword(false);
  };

  const handleCancelPassword = () => {
    passwordForm.reset();
    setPasswordStrength({
      level: 0,
      text: '',
      color: 'bg-gray-300',
      width: 'w-[0px]',
    });
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      <div className="bg-white rounded-lg border border-gray-200 p-6 md:p-8">
        <div className="mb-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            Tài khoản & Bảo mật
          </h3>
          <p className="text-gray-600">
            Xem và thay đổi thông tin tài khoản, quản lý mật khẩu
          </p>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 flex-shrink-0">
                <User className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-sm font-medium text-gray-700 block">
                  Tên đăng nhập
                </label>
                <p className="text-gray-900 font-medium truncate">
                  {user?.username}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 flex-shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-sm font-medium text-gray-700 block">
                  Email
                </label>
                <p className="text-gray-900 font-medium truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Change Password Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h4 className="text-xl font-bold text-gray-900 mb-6">Đổi mật khẩu</h4>
          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-6"
          >
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu hiện tại
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  {...passwordForm.register('currentPassword', {
                    required: 'Vui lòng nhập mật khẩu hiện tại',
                  })}
                  className="w-full pr-10 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="........"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:text-gray-600 transition-colors"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  {...passwordForm.register('newPassword', {
                    required: 'Vui lòng nhập mật khẩu mới',
                    minLength: {
                      value: 8,
                      message: 'Mật khẩu phải có ít nhất 8 ký tự',
                    },
                  })}
                  className="w-full pr-10 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Mật khẩu mới"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:text-gray-600 transition-colors"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordForm.formState.errors.newPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận mật khẩu mới
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  {...passwordForm.register('confirmPassword', {
                    required: 'Vui lòng nhập lại mật khẩu',
                  })}
                  className="w-full pr-10 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nhập lại mật khẩu"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer hover:text-gray-600 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Password Strength Indicator */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Độ mạnh mật khẩu mới
              </label>
              <div className="space-y-2">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.color} ${passwordStrength.width}`}
                  ></div>
                </div>
                {passwordStrength.text && (
                  <p className="text-sm text-gray-600">
                    {passwordStrength.text}
                  </p>
                )}
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Yêu cầu mật khẩu:</p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>Ít nhất 8 ký tự</li>
                    <li>Bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/50"
              >
                <Key className="w-5 h-5" />
                {isChangingPassword ? 'Đang lưu...' : 'Lưu mật khẩu'}
              </button>
              <button
                type="button"
                onClick={handleCancelPassword}
                className="px-5 py-2.5 rounded-lg font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
