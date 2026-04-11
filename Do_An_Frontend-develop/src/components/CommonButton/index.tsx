import { CircularProgress } from '@mui/material';
import clsx from 'clsx';
import React from 'react';

interface CommonButtonProps {
  text: string;
  onClick?: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  color?: string;
  textClassName?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  className?: string;
  styles?: React.CSSProperties;
}

const CommonButton: React.FC<CommonButtonProps> = ({
  text,
  onClick,
  isLoading = false,
  disabled = false,
  color = '#FF4319',
  textClassName = 'text-white',
  startIcon,
  endIcon,
  className,
  styles,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative cursor-pointer select-none ${disabled || isLoading ? 'opacity-50' : ''} px-4 py-2 ${className} rounded-lg font-medium`}
      style={{
        backgroundColor: color,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '40px',
        ...styles,
      }}
    >
      <>
        {startIcon && <div className="mr-2">{startIcon}</div>}
        <span className={clsx('text-sm', textClassName)}>
          {text}{' '}
          {isLoading && (
            <CircularProgress
              size={12}
              style={{ color: 'white', marginLeft: '10px' }}
            />
          )}
        </span>
        {endIcon && <div className="ml-2">{endIcon}</div>}
      </>
    </div>
  );
};

export default CommonButton;
