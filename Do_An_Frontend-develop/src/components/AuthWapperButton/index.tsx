import { openModalLogin } from '@redux/slices/ModalSlice';
import { IRootState } from '@redux/store';
import { MouseEventHandler } from 'react';
import { useDispatch, useSelector } from 'react-redux';

interface IAuthButtonWrapperProps {
  action?: MouseEventHandler;
  children?: React.ReactNode;
  className?: string;
  isRequiredAuth?: boolean;
}

function AuthButton({
  action,
  children,
  className,
  isRequiredAuth = false,
}: IAuthButtonWrapperProps) {
  const { isAuthenticated } = useSelector((state: IRootState) => state.auth);
  const dispatch = useDispatch();
  const handleClick = () => {
    dispatch(openModalLogin(true));
  };
  return (
    <div
      onClick={isAuthenticated || !isRequiredAuth ? action : handleClick}
      className={className}
    >
      {children}
    </div>
  );
}

export default AuthButton;
