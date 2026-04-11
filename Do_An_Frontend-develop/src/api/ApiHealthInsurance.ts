import { IHealthInsurance } from '@src/types';
import { fetcher, IDataWithMeta } from './Fetcher';

const path = {
  healthInsurance: '/health-insurances',
};

type HealthInsuranceDto = {
  type: string;
  insuranceId: string;
  startAt: string;
  endAt: string;
  level_of_benefit?: number | null;
  province_code?: string | null;
  initial_kcb_code?: string | null;
  initial_kcb_name?: string | null;
};

const getInsurancesByUser = async (userId: string) => {
  return fetcher<IDataWithMeta<IHealthInsurance[]>>({
    url: `${path.healthInsurance}/user/${userId}`,
    method: 'GET',
  });
};

const addHealthInsurance = async (userId: string, data: HealthInsuranceDto) => {
  return fetcher(
    {
      url: `${path.healthInsurance}/${userId}`,
      method: 'POST',
      data,
    },
    {
      displayError: false,
    }
  );
};

const updateHealthInsurance = async (
  userId: string,
  data: HealthInsuranceDto
) => {
  return fetcher(
    {
      url: `${path.healthInsurance}/${userId}`,
      method: 'PATCH',
      data,
    },
    {
      displayError: false,
    }
  );
};

const deleteHealthInsurance = async (userId: string) => {
  return fetcher(
    {
      url: `${path.healthInsurance}/${userId}`,
      method: 'DELETE',
    },
    {
      displayError: false,
    }
  );
};

export default {
  getInsurancesByUser,
  addHealthInsurance,
  updateHealthInsurance,
  deleteHealthInsurance,
};
