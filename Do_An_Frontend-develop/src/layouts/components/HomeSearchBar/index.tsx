import AvatarDropdown from '@components/AvatarDropdown';
import CommonButton from '@src/components/CommonButton';
import { openModalLogin } from '@src/redux/slices/ModalSlice';
import { IRootState } from '@src/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import NotificationPopover from '@components/NotificationPopover';

interface IHomeSearchBarProps {
  children?: React.ReactNode;
}
function HomeSearchBar({ children }: IHomeSearchBarProps) {
  const { isAuthenticated } = useSelector((state: IRootState) => state.auth);
  const dispatch = useDispatch();
  const user = useSelector((state: IRootState) => state.auth.user);

  return (
    <header className="bg-white border-b border-gray-200 px-3 md:px-8 py-4 fixed md:left-[225px] left-0 right-0 top-0 z-10">
      <div className="flex justify-between items-center gap-3">
        {children}
        <div className="flex items-center space-x-4">
          {!isAuthenticated && (
            <CommonButton
              text="Đăng nhập"
              onClick={() => dispatch(openModalLogin(true))}
              className="!bg-blue w-[100px] hover:!bg-blue-800"
            />
          )}
          {isAuthenticated && (
            <>
              {user?.role?.name === 'doctor' && (
                <p className="text-sm font-bold whitespace-nowrap">
                  BS {user?.name?.firstName} {user?.name?.lastName}
                </p>
              )}
              <NotificationPopover />
              <AvatarDropdown />
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default HomeSearchBar;
