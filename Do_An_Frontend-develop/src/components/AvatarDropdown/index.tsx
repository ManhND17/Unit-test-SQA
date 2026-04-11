import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IRootState } from '@redux/store';
import { User, LogOut, Key } from 'lucide-react';
import { Menu, MenuItem, Avatar, Box } from '@mui/material';
import ApiAuth from '@src/api/ApiAuth';
import { tryCatch } from '@src/utils/handleError';
import { toast } from 'react-toastify';
import { logout } from '@utils/auth';

interface IAvatarDropdownProps {
  className?: string;
}

const AvatarDropdown = ({ className }: IAvatarDropdownProps) => {
  const { user, isAuthenticated } = useSelector(
    (state: IRootState) => state.auth
  );
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    switch (user?.role?.name) {
      case 'patient':
        navigate('/profile');
        break;
      case 'doctor':
        navigate('/doctor/profile');
        break;
      case 'admin':
        navigate('/admin/profile');
        break;
      default:
        navigate('/profile');
    }
    handleClose();
  };

  const handleChangePasswordClick = () => {
    switch (user?.role?.name) {
      case 'patient':
        navigate('/change-password');
        break;
      case 'doctor':
        navigate('/doctor/change-password');
        break;
      case 'admin':
        navigate('/admin/change-password');
        break;
      default:
        navigate('/change-password');
    }
    handleClose();
  };

  const handleLogout = async () => {
    const [res, err] = await tryCatch(ApiAuth.logOut());
    if (err) {
      toast.error(err.errorMessage || 'Đăng xuất thất bại');
      return;
    }
    if (res) {
      logout();
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <Box className={className}>
      <Avatar
        src={user.avatar}
        alt={user.name?.firstName || 'User'}
        onClick={handleClick}
        sx={{
          width: 32,
          height: 32,
          cursor: 'pointer',
          border: '2px solid #e5e7eb',
          '&:hover': {
            border: '2px solid #3b82f6',
          },
        }}
      >
        {!user.avatar && (
          <span className="text-sm font-medium">
            {user.name?.firstName?.charAt(0) ||
              user.email.charAt(0).toUpperCase()}
          </span>
        )}
      </Avatar>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfileClick}>
          <User className="mr-2" size={16} />
          Thông tin cá nhân
        </MenuItem>
        <MenuItem onClick={handleChangePasswordClick}>
          <Key className="mr-2" size={16} />
          Đổi mật khẩu
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <LogOut className="mr-2" size={16} />
          Đăng xuất
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AvatarDropdown;
