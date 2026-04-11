import SideBar, { ISideBarItem } from '@components/SideBar';
import Footer from '@layouts/components/Footer';
import HomeSearchBar from '@layouts/components/HomeSearchBar';
import ICFavicon from '@components/Icon/ICFavicon';
import {
  Home,
  Calendar,
  LogOut,
  Info,
  BookOpenText,
  Stethoscope,
  Search,
  Phone,
  Menu,
  UsersRound,
  User,
  CreditCard,
  Ticket,
} from 'lucide-react';
import {
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Drawer,
  IconButton,
  useMediaQuery,
  Box,
} from '@mui/material';
import ModalLogin from '@components/ModalLogin';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { IRootState } from '@redux/store';
import { tryCatch } from '@utils/handleError';
import ApiAuth from '@api/ApiAuth';
import { toast } from 'react-toastify';
import { logout } from '@utils/auth';
import clsx from 'clsx';

interface IAdminLayoutProps {
  children: React.ReactNode;
  exceptPath?: string[];
}

const AdminLayout = ({ children, exceptPath }: IAdminLayoutProps) => {
  const { isAuthenticated } = useSelector((state: IRootState) => state.auth);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');
  const navigate = useNavigate();
  const location = useLocation();
  if (exceptPath && exceptPath.includes(location.pathname)) {
    return <>{children}</>;
  }
  const sideBarItems: ISideBarItem[] = [
    {
      label: 'Trang chủ',
      to: '/admin',
      icon: <Home />,
      action: () => {
        navigate('/admin');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Thăm khám',
      to: '/admin/visits',
      icon: <Ticket />,
      action: () => {
        navigate('/admin/visits');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Quản lý khoa, phòng',
      to: '/admin/room-departments',
      icon: <Info />,
      action: () => {
        navigate('/admin/room-departments');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Quản lý dịch vụ y tế',
      to: '/admin/medical-services',
      icon: <Stethoscope />,
      action: () => {
        navigate('/admin/medical-services');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Quản lý nhân viên',
      to: '/admin/staffs',
      icon: <UsersRound />,
      requireAuth: true,
      action: () => {
        navigate('/admin/staffs');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Quản lý bệnh nhân',
      to: '/admin/patients',
      icon: <User />,
      requireAuth: true,
      action: () => {
        navigate('/admin/patients');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Quản lý lịch làm việc',
      to: '/admin/schedules',
      icon: <Calendar />,
      requireAuth: true,
      action: () => {
        navigate('/admin/schedules');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Quản lý lịch hẹn',
      to: '/admin/appointments',
      icon: <Calendar />,
      requireAuth: true,
      action: () => {
        navigate('/admin/appointments');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Quản lý chuyên mục sức khỏe',
      to: '/admin/articles',
      icon: <BookOpenText />,
      action: () => {
        navigate('/admin/articles');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Hóa đơn & Thanh toán',
      to: '/admin/invoices',
      icon: <CreditCard />,
      action: () => {
        navigate('/admin/invoices');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Liên hệ - Hỗ trợ',
      to: '/admin/contacts',
      icon: <Phone />,
      action: () => {
        navigate('/admin/contacts');
        setDrawerOpen(false);
      },
    },
  ];

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

  return (
    <>
      <div className="relative">
        <HomeSearchBar>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="between"
            className="w-full"
          >
            {isMobile && (
              <IconButton
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
                sx={{ ml: 1, mr: 2 }}
              >
                <Menu size={28} />
              </IconButton>
            )}
            <Box className={isMobile ? 'w-full' : 'w-2/3 max-w-[500px]'}>
              <div className="relative w-full">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Tìm kiếm bác sĩ, chuyên khoa, dịch vụ..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </Box>
          </Box>
        </HomeSearchBar>

        {isMobile ? (
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            PaperProps={{ sx: { width: 225 } }}
          >
            <SideBar
              items={sideBarItems}
              header={
                <div
                  className="flex gap-3 items-center px-4 mb-5"
                  onClick={() => {
                    setDrawerOpen(false);
                    navigate('/admin');
                  }}
                >
                  <ICFavicon />
                  <p className="text-md lg:text-lg xl:text-xl font-bold">
                    Bệnh viện Bắc Hưng
                  </p>
                </div>
              }
              footer={
                isAuthenticated ? (
                  <ListItem disablePadding onClick={handleLogout}>
                    <ListItemButton>
                      <ListItemIcon>
                        <LogOut color="red" />
                      </ListItemIcon>
                      <ListItemText primary="Đăng xuất" />
                    </ListItemButton>
                  </ListItem>
                ) : null
              }
            />
          </Drawer>
        ) : (
          <div className="fixed left-0 top-0 bottom-0">
            <SideBar
              items={sideBarItems}
              header={
                <div
                  className="flex gap-3 items-center justify-center cursor-pointer h-[75px]"
                  onClick={() => navigate('/admin')}
                >
                  <ICFavicon />
                  <p className="text-md lg:text-lg xl:text-xl font-bold">
                    Bệnh viện Bắc Hưng
                  </p>
                </div>
              }
              footer={
                isAuthenticated ? (
                  <ListItem disablePadding onClick={handleLogout}>
                    <ListItemButton>
                      <ListItemIcon>
                        <LogOut color="red" />
                      </ListItemIcon>
                      <ListItemText primary="Đăng xuất" />
                    </ListItemButton>
                  </ListItem>
                ) : null
              }
            />
          </div>
        )}

        <div
          className={clsx({
            'mt-[75px] min-h-[calc(100vh-75px)]': isMobile,
            'ml-[225px] mt-[75px] min-h-[calc(100vh-75px)]': !isMobile,
          })}
        >
          {children}
        </div>
        <div
          className={clsx({
            'ml-[225px]': !isMobile,
          })}
        >
          <Footer />
        </div>
      </div>
      <ModalLogin />
    </>
  );
};

export default AdminLayout;
