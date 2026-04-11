import SideBar from '@components/SideBar';
import Footer from '@layouts/components/Footer';
import HomeSearchBar from '@layouts/components/HomeSearchBar';
import ICFavicon from '@components/Icon/ICFavicon';
import {
  Home,
  ClipboardList,
  Calendar,
  MessageSquare,
  LogOut,
  Info,
  BookOpenText,
  Stethoscope,
  Search,
  Phone,
  Menu,
  MessageCircleMore,
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
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@redux/store';
import { tryCatch } from '@utils/handleError';
import ApiAuth from '@api/ApiAuth';
import { toast } from 'react-toastify';
import { logout } from '@utils/auth';
import { useQuery } from '@tanstack/react-query';
import QUERY_KEY from '@src/api/QueryKey';
import ApiPatient from '@src/api/ApiPatient';
import { setPatient } from '@src/redux/slices/PatientSlice';
import clsx from 'clsx';

interface IPatientLayoutProps {
  children: React.ReactNode;
}

const PatientLayout = ({ children }: IPatientLayoutProps) => {
  const { isAuthenticated, user } = useSelector(
    (state: IRootState) => state.auth
  );
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width:768px)');
  const navigate = useNavigate();
  const pathName = useLocation().pathname;
  const sideBarItems = [
    {
      label: 'Trang chủ',
      to: '/',
      icon: <Home />,
      action: () => {
        navigate('/');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Giới thiệu',
      to: '/about',
      icon: <Info />,
      action: () => {
        navigate('/about');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Chuyên khoa',
      to: '/specialties',
      icon: <Stethoscope />,
      action: () => {
        navigate('/specialties');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Hồ sơ khám bệnh',
      to: '/patient/ehr',
      icon: <ClipboardList />,
      requireAuth: true,
      action: () => {
        navigate('/patient/ehr');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Quản lý lịch khám',
      to: '/patient/appointments',
      icon: <Calendar />,
      requireAuth: true,
      action: () => {
        navigate('/patient/appointments');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Chat với AI',
      to: '/patient/chat',
      icon: <MessageSquare />,
      requireAuth: true,
      action: () => {
        navigate('/patient/chat');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Chuyên mục sức khỏe',
      to: '/articles',
      icon: <BookOpenText />,
      action: () => {
        navigate('/articles');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Liên hệ - Hỗ trợ',
      to: '/contact',
      icon: <Phone />,
      action: () => {
        navigate('/contact');
        setDrawerOpen(false);
      },
    },
    {
      label: 'Phản hồi',
      to: '/patient/feedback',
      requireAuth: true,
      icon: <MessageCircleMore />,
      action: () => {
        navigate('/patient/feedback');
        setDrawerOpen(false);
      },
    },
  ];

  const { data: patientInformation, isSuccess } = useQuery({
    queryKey: [QUERY_KEY.PATIENT.GET_PATIENT_INFORMATION, user?.id],
    queryFn: () => ApiPatient.getPatientInformation(user?.id as string),
    enabled: !!user?.id && user.role.name === 'patient',
  });

  useEffect(() => {
    if (isSuccess) {
      dispatch(setPatient(patientInformation));
    }
  }, [isSuccess, patientInformation, dispatch]);

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
                    navigate('/');
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
                  onClick={() => navigate('/')}
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
            'pb-8': !pathName.includes('chat'),
          })}
        >
          {children}
        </div>
        {!pathName.includes('chat') && (
          <div
            className={clsx({
              'ml-[225px]': !isMobile,
            })}
          >
            <Footer />
          </div>
        )}
      </div>
      <ModalLogin />
    </>
  );
};

export default PatientLayout;
