import { IPatient } from '@src/types';
import { fetcher, fetcherWithMetadata, QueryParam } from './Fetcher';

const path = {
  patient: '/patients',
};

const getPatientInformation = async (id: string) => {
  return fetcher<IPatient>({
    url: `${path.patient}/${id}/detail`,
    method: 'GET',
  });
};

const getPatients = async (params: QueryParam = {}) => {
  return fetcherWithMetadata<IPatient[]>({
    url: `${path.patient}/search`,
    method: 'GET',
    params,
  });
};

export default {
  getPatientInformation,
  getPatients,
};
