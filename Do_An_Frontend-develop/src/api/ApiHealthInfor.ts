import { fetcher } from './Fetcher';

type HealthInforUpdateData = {
  weight?: number;
  height?: number;
  bloodType?: string;
  has_allergies?: boolean;
  has_high_blood_pressure?: boolean;
  has_diabetes?: boolean;
  has_cancer?: boolean;
};

const updateHealthInfor = async (
  userId: string,
  data: HealthInforUpdateData
) => {
  return fetcher<HealthInforUpdateData & { id: string; patientId: string }>({
    url: `/medical-records/patient/${userId}/health-info`,
    method: 'PUT',
    data,
  });
};

export default {
  updateHealthInfor,
};
