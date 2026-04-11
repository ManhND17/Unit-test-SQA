import SideBar, { ISideBarItem } from '@components/SideBar';
import Footer from '@layouts/components/Footer';
import HomeSearchBar from '@layouts/components/HomeSearchBar';
import ICFavicon from '@components/Icon/ICFavicon';
import {
  Home,
  Calendar,
  Stethoscope,
  ClipboardList,
  LogOut,
  Menu,
  Search,
  BookOpenText,
  Layers,
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
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@redux/store';
import { tryCatch } from '@utils/handleError';
import ApiAuth from '@api/ApiAuth';
import { toast } from 'react-toastify';
import { logout } from '@utils/auth';
import { useQuery } from '@tanstack/react-query';
import QUERY_KEY from '@src/api/QueryKey';
import { ApiUser } from '@src/api/ApiUser';
import { updateUser } from '@src/redux/slices/AuthSlice';
import clsx from 'clsx';

interface IPatientLayoutProps {
  children: React.ReactNode;
  exceptPath?: string[];
}

const DoctorLayout = ({ children, exceptPath }: IPatientLayoutProps) => {
  const { isAuthenticated, user } = useSelector(
    (state: IRootState) => state.auth
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const sideBarItems: ISideBarItem[] = [
    {
      label: 'Dashboard',
      to: '/doctor',
      icon: <Home />,
      action: () => {
        navigate('/doctor');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Lịch làm việc',
      to: '/doctor/schedules',
      icon: <Calendar />,
      action: () => {
        navigate('/doctor/schedules');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Lịch hẹn',
      to: '/doctor/appointments',
      icon: <ClipboardList />,
      action: () => {
        navigate('/doctor/appointments');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Ca khám',
      to: '/doctor/visits',
      icon: <Layers />,
      action: () => {
        navigate('/doctor/visits');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Kết quả khám',
      to: '/doctor/medical-records',
      icon: <Stethoscope />,
      action: () => {
        navigate('/doctor/medical-records');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Bài viết',
      to: '/doctor/articles',
      icon: <BookOpenText />,
      action: () => {
        navigate('/doctor/articles');
        setDrawerOpen(false);
      },
    },
  ];

  const { data: doctorInformation, isSuccess } = useQuery({
    queryKey: [QUERY_KEY.USER.GET_USER_BY_ID, user?.id],
    queryFn: ApiUser.getUser,
  });

  useEffect(() => {
    if (doctorInformation && isSuccess) {
      dispatch(updateUser(doctorInformation));
    }
  }, [isSuccess, doctorInformation, dispatch]);

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

  if (exceptPath && exceptPath.includes(location.pathname)) {
    return <>{children}</>;
  }

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
                    navigate('/doctor');
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
                  onClick={() => navigate('/doctor')}
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

export default DoctorLayout;
