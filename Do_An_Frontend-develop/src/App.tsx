import React, { useEffect, useState } from 'react';
import {
  Routes,
  Route,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@redux/store';
import { EUserRole } from './types';
import PatientLayout from './layouts/Patient';
import AuthLayout from './layouts/Auth';
import AdminLayout from './layouts/Admin';
import DoctorLayout from './layouts/Doctor';
import NotFound from '@components/NotFound';
import ProtectedRoute from 'src/routes/ProtectedRoute';
import { queryClient } from './config/queryClient';
import ApiAuth from '@api/ApiAuth';
import { updateAuthStore, logoutUser } from '@redux/slices/AuthSlice';
import LoadingScreen from '@components/LoadingScreen';
import { toast } from 'react-toastify';
import Profile from '@pages/Patient/Profile';
import ChangePassword from '@pages/ChangePassword';
const InvoiceDetailPage = React.lazy(
  () => import('@pages/Admin/Payment/DetailInvoice')
);
const PreviewArticle = React.lazy(() => import('./pages/Preview'));
const AdminAddEditArticles = React.lazy(
  () => import('./pages/Admin/Article/CreateEditArticle')
);
const DoctorAddEditArticles = React.lazy(
  () => import('./pages/Doctor/Article/CreateEditArticle')
);
const ManagePayment = React.lazy(() => import('./pages/Admin/Payment'));
const PaymentCheckoutPage = React.lazy(
  () => import('@pages/Admin/Payment/Checkout')
);
const PaymentDetailPage = React.lazy(
  () => import('@pages/Admin/Payment/PaymentDetail')
);
const DetailSpecialty = React.lazy(
  () => import('@pages/Patient/Specialties/DetailSpecialty')
);

const Login = React.lazy(() => import('./pages/Auth/Login'));
const SignUp = React.lazy(() => import('./pages/Auth/Signup'));
const ForgotPassword = React.lazy(() => import('./pages/Auth/ForgotPassword'));
const GoogleCallback = React.lazy(
  () => import('./pages/Auth/Login/GoogleCallback')
);
const PatientHome = React.lazy(() => import('@pages/Patient/Home'));
const HospitalAbout = React.lazy(() => import('@pages/Patient/About'));
const HospitalSpecialties = React.lazy(
  () => import('@pages/Patient/Specialties')
);
const PatientContact = React.lazy(() => import('@pages/Patient/Contact'));
const ArticleHome = React.lazy(() => import('@pages/Patient/Article/Home'));
const DetailArticle = React.lazy(
  () => import('@pages/Patient/Article/DetailArticle')
);
const SearchArticle = React.lazy(() => import('@pages/Patient/Article/Search'));
const ArticleByCategory = React.lazy(
  () => import('@pages/Patient/Article/ArticleByCategory')
);
const Chat = React.lazy(() => import('@pages/Patient/Chat'));
const EHR = React.lazy(() => import('@pages/Patient/EHR'));
const PatientManagementAppointment = React.lazy(
  () => import('@pages/Patient/ManagementAppointment')
);
const AdminManageArticles = React.lazy(() => import('@pages/Admin/Article'));
const AdminVisitPage = React.lazy(() => import('@pages/Admin/Visit'));
const AdminRoomDepartment = React.lazy(
  () => import('@pages/Admin/RoomDepartment')
);
const AdminHome = React.lazy(() => import('@pages/Admin/Home'));
const AdminSchedule = React.lazy(() => import('@pages/Admin/Schedule'));
const PatientManagement = React.lazy(
  () => import('@pages/Admin/PatientManagement')
);
const StaffManagement = React.lazy(
  () => import('@pages/Admin/StaffManagement')
);
const DoctorHome = React.lazy(() => import('@pages/Doctor/Home'));
const SchedulePage = React.lazy(() => import('@pages/Doctor/Schedules'));
const DoctorVisitPage = React.lazy(() => import('@pages/Doctor/Visit'));
const MedicalResultPage = React.lazy(
  () => import('@pages/Doctor/MedicalResult')
);
const AdminContact = React.lazy(() => import('@pages/Admin/Contact'));
const AdminMedicalServices = React.lazy(
  () => import('@pages/Admin/MedicalServices/index')
);
const MedicalServiceDetail = React.lazy(
  () => import('@src/pages/Admin/MedicalServices/DetailMedicalService/Detail')
);
const MedicalServiceEdit = React.lazy(
  () => import('@src/pages/Admin/MedicalServices/EditMedicalService/Edit')
);
const BookingForm = React.lazy(() => import('@pages/Patient/Appointment'));
import { connectSocket, disconnectSocket } from './config/socket';
import CreateInvoicePage from './pages/Admin/Payment/CreateInvoice';
const PatientFeedback = React.lazy(() => import('@pages/Patient/Feedback'));
const DoctorArticles = React.lazy(() => import('@src/pages/Doctor/Article'));
const PaymentStatus = React.lazy(() => import('@pages/PaymentStatus'));
const AdminManageAppointment = React.lazy(
  () => import('@src/pages/Admin/Appointment')
);
const DoctorManageAppointment = React.lazy(
  () => import('@src/pages/Doctor/Appointment')
);
const DetailVisitDoctorPage = React.lazy(
  () => import('@src/pages/Doctor/Visit/DetailVisit')
);
const CreateNewMedicalRecord = React.lazy(
  () => import('@src/pages/Doctor/Visit/CreateNewMedicalRecord')
);
const PatientMedicalResultDetail = React.lazy(
  () => import('@src/pages/Patient/MedicalResult')
);

function App() {
  const { accessToken, isAuthenticated } = useSelector(
    (state: IRootState) => state.auth
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [isLoadingUser, setIsLoadingUser] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      connectSocket();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    });
  }, [location.pathname]);

  useEffect(() => {
    if (accessToken) {
      queryClient.invalidateQueries({ type: 'active' });
    }
  }, [accessToken]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (accessToken && !isAuthenticated && !isLoadingUser) {
        try {
          setIsLoadingUser(true);
          const userData = await ApiAuth.getMe();
          dispatch(
            updateAuthStore({
              user: userData,
              isAuthenticated: true,
            })
          );
        } catch {
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          dispatch(logoutUser());
        } finally {
          setIsLoadingUser(false);
        }
      }
    };

    fetchUserData();
  }, [accessToken, isAuthenticated]);

  if (accessToken && isLoadingUser) {
    return <LoadingScreen />;
  }

  return (
    <Routes>
      {/* Patient routes */}
      <Route
        path="/"
        element={
          <PatientLayout>
            <Outlet />
          </PatientLayout>
        }
      >
        <Route index element={<PatientHome />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute allowedRoles={[EUserRole.PATIENT]}>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="change-password"
          element={
            <ProtectedRoute allowedRoles={[EUserRole.PATIENT]}>
              <ChangePassword />
            </ProtectedRoute>
          }
        />
        <Route path="about" element={<HospitalAbout />} />
        <Route path="contact" element={<PatientContact />} />
        <Route path="specialties" element={<HospitalSpecialties />} />
        <Route path="specialties/:id" element={<DetailSpecialty />} />
        <Route path="articles" element={<ArticleHome />} />
        <Route path="articles/search" element={<SearchArticle />} />
        <Route path="articles/category/:slug" element={<ArticleByCategory />} />
        <Route path="articles/:slug" element={<DetailArticle />} />
        <Route
          path="patient/chat"
          element={
            <ProtectedRoute allowedRoles={[EUserRole.PATIENT]}>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="patient/chat/:conversationId"
          element={
            <ProtectedRoute allowedRoles={[EUserRole.PATIENT]}>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route
          path="patient/ehr"
          element={
            <ProtectedRoute allowedRoles={[EUserRole.PATIENT]}>
              <EHR />
            </ProtectedRoute>
          }
        />
        <Route
          path="patient/ehr/visits/:id"
          element={
            <ProtectedRoute allowedRoles={[EUserRole.PATIENT]}>
              <PatientMedicalResultDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="patient/appointments"
          element={
            <ProtectedRoute allowedRoles={[EUserRole.PATIENT]}>
              <PatientManagementAppointment />
            </ProtectedRoute>
          }
        />
        <Route
          path="patient/create-appointment"
          element={
            <ProtectedRoute allowedRoles={[EUserRole.PATIENT]}>
              <BookingForm onClose={() => navigate('/')} />
            </ProtectedRoute>
          }
        />
        <Route
          path="patient/feedback"
          element={
            <ProtectedRoute allowedRoles={[EUserRole.PATIENT]}>
              <PatientFeedback />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound fallbackUrl="/" />} />
      </Route>

      <Route
        path="/preview-article"
        element={
          <ProtectedRoute allowedRoles={[EUserRole.ADMIN, EUserRole.DOCTOR]}>
            <PreviewArticle />
          </ProtectedRoute>
        }
      />

      {/* Auth routes */}
      <Route
        path="/auth"
        element={
          <ProtectedRoute requireAuth={false} guestOnly={true}>
            <AuthLayout>
              <Outlet />
            </AuthLayout>
          </ProtectedRoute>
        }
      >
        <Route path="login" element={<Login />} />
        <Route path="register" element={<SignUp />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
      </Route>
      <Route path="login/google/callback" element={<GoogleCallback />} />

      {/* Payment callback route - standalone without layout */}
      <Route path="/payments/callback/status" element={<PaymentStatus />} />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={[EUserRole.ADMIN]}>
            <AdminLayout exceptPath={['/admin/articles/create-edit']}>
              <Outlet />
            </AdminLayout>
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="visits" element={<AdminVisitPage />} />
        <Route path="profile" element={<Profile />} />
        <Route path="appointments" element={<AdminManageAppointment />} />
        <Route path="invoices" element={<ManagePayment />} />
        <Route
          path="invoices/create-invoice/:patientId"
          element={<CreateInvoicePage />}
        />
        <Route
          path="payment/checkout/:invoiceId"
          element={<PaymentCheckoutPage />}
        />
        <Route path="payment/:paymentId" element={<PaymentDetailPage />} />
        <Route path="invoices/:id" element={<InvoiceDetailPage />} />
        <Route path="contacts" element={<AdminContact />} />
        <Route path="articles" element={<AdminManageArticles />} />
        <Route path="articles/create-edit" element={<AdminAddEditArticles />} />
        <Route path="room-departments" element={<AdminRoomDepartment />} />
        <Route path="medical-services" element={<AdminMedicalServices />} />
        <Route
          path="medical-services/detail"
          element={<MedicalServiceDetail />}
        />
        <Route path="schedules" element={<AdminSchedule />} />
        <Route path="patients" element={<PatientManagement />} />
        <Route path="staffs" element={<StaffManagement />} />
        <Route path="medical-services/edit" element={<MedicalServiceEdit />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="*" element={<NotFound fallbackUrl="/admin" />} />
      </Route>

      {/* Doctor routes */}
      <Route
        path="/doctor"
        element={
          <ProtectedRoute allowedRoles={[EUserRole.DOCTOR]}>
            <DoctorLayout exceptPath={['/doctor/articles/create-edit']}>
              <Outlet />
            </DoctorLayout>
          </ProtectedRoute>
        }
      >
        <Route index element={<DoctorHome />} />
        <Route path="profile" element={<Profile />} />
        <Route path="visits" element={<DoctorVisitPage />} />
        <Route path="schedules" element={<SchedulePage />} />
        <Route path="articles" element={<DoctorArticles />} />
        <Route path="appointments" element={<DoctorManageAppointment />} />
        <Route
          path="articles/create-edit"
          element={<DoctorAddEditArticles />}
        />
        <Route path="medical-records" element={<MedicalResultPage />} />
        <Route
          path="visits/:id/create-medical-record"
          element={<CreateNewMedicalRecord />}
        />
        <Route path="visits/:id" element={<DetailVisitDoctorPage />} />
        <Route path="change-password" element={<ChangePassword />} />
        <Route path="*" element={<NotFound fallbackUrl="/doctor" />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<NotFound fallbackUrl="/" />} />
    </Routes>
  );
}

export default App;
