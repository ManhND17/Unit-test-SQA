import { Tooltip } from '@mui/material';
import { forwardRef, ReactNode } from 'react';

interface InnerElementProps {
  children: ReactNode;
  [key: string]: any;
}

const InnerElement = forwardRef<HTMLDivElement, InnerElementProps>(
  ({ children, ...props }, ref) => {
    return (
      <div {...props} ref={ref}>
        {children}
      </div>
    );
  }
);

InnerElement.displayName = 'InnerElement';

interface IButtonTooltipProps {
  children: React.ReactNode;
  title: string;
}

export default function ButtonTooltip({
  children,
  title,
}: IButtonTooltipProps) {
  return (
    <Tooltip title={title} enterDelay={0} leaveDelay={0}>
      <InnerElement>{children}</InnerElement>
    </Tooltip>
  );
}
