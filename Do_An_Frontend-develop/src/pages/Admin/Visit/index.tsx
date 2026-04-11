import { Users, CalendarDays, Plus, Ticket } from 'lucide-react';
import { useState } from 'react';
import PatientSearch from './components/tabs/PatientSearch';
import TodayAppointments from './components/tabs/TodayAppointments';
import CommonButton from '@src/components/CommonButton';
import { PatientFormModal } from '../PatientManagement/components/AddEditPatient';
import { EUserGender, IUser } from '@src/types';
import { toast } from 'react-toastify';
import ApiAdminUser from '@src/api/ApiAdminUser';
import ModalAddEditVisit from '@src/components/ModalAddEditVisit';

type TabId = 'search' | 'appointments';
export default function AdminVisitPage() {
  const [activeTab, setActiveTab] = useState<TabId>('search');
  const [isPatientFormOpen, setIsPatientFormOpen] = useState(false);
  const [isVisitFormOpen, setIsVisitFormOpen] = useState(false);
  const tabs = [
    {
      id: 'search' as TabId,
      label: 'Tìm kiếm BN',
      icon: Users,
      component: PatientSearch,
    },
    {
      id: 'appointments' as TabId,
      label: 'Lịch hẹn hôm nay',
      icon: CalendarDays,
      component: TodayAppointments,
    },
  ];

  const handleSubmitForm = async (formData: Partial<IUser>) => {
    // Create new patient
    const newStaff: any = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      birthday: formData.birthday,
      gender: formData.gender || EUserGender.MALE,
      phone: formData.phone,
      name: {
        firstName: formData.name?.firstName,
        lastName: formData.name?.lastName,
      },
      address: {
        detail: formData.address?.detail,
        city: formData.address?.city,
        district: formData.address?.district,
        ward: formData.address?.ward,
        country: 'Vietnam',
      },
    };
    try {
      await ApiAdminUser.createPatient(newStaff);
      toast.success('Thêm bệnh nhân mới thành công');
      setIsPatientFormOpen(false);
    } catch (error) {
      toast.error('Đã có lỗi xảy ra khi thêm bệnh nhân mới');
    }
  };

  return (
    <>
      <div className="hidden sm:flex space-x-3 justify-end mr-8 py-4">
        <CommonButton
          text="Tạo lượt khám"
          startIcon={<Ticket size={16} stroke="#fff" />}
          styles={{
            backgroundColor: '#4CBA87',
          }}
          onClick={() => setIsVisitFormOpen(true)}
        />
        <CommonButton
          text="Thêm BN mới"
          onClick={() => setIsPatientFormOpen(true)}
          startIcon={<Plus size={16} stroke="#fff" />}
        />
      </div>
      <div className="w-full flex flex-col h-full">
        <div className="border-b bg-background">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200
                    ${isActive ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30'}
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    className={`
                    -ml-0.5 mr-2 h-5 w-5
                    ${isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground'}
                  `}
                  />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="flex-1 bg-muted/10 min-h-[500px]">
          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
            {tabs.map((tab) => (
              <div
                key={tab.id}
                className={activeTab === tab.id ? 'block' : 'hidden'}
              >
                <tab.component />
              </div>
            ))}
          </div>
        </div>
      </div>
      <PatientFormModal
        isOpen={isPatientFormOpen}
        onClose={() => setIsPatientFormOpen(false)}
        onSubmit={handleSubmitForm}
      />
      <ModalAddEditVisit
        isOpen={isVisitFormOpen}
        onClose={() => setIsVisitFormOpen(false)}
        onSubmit={() => {}}
      />
    </>
  );
}
