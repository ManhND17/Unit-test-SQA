import GeneralInfor from './components/GeneralInfor';
import ContactInfor from './components/ContactInfor';
import HealthInfor from './components/HealthInfor';
import HealthInsurance from './components/HealthInsurance';
import { IRootState } from '@src/redux/store';
import { useSelector } from 'react-redux';

export default function PatientInformation() {
  const { patient } = useSelector((state: IRootState) => state.patient);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Thông tin cơ bản */}
      <GeneralInfor />

      {/* Thông tin liên hệ */}
      <ContactInfor />

      {/* Bảo hiểm y tế */}

      <HealthInsurance data={patient?.healthInsurances} />

      {/* Thông tin y tế */}
      <HealthInfor />
    </div>
  );
}
