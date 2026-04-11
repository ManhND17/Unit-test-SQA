import { IEHR } from '@src/types';
import { fetcher } from './Fetcher';

const path = {
  ehr: '/ehr',
  createEHR: '/ehr/create',
};

const getEhrById = (ehrId: string | number) => {
  return fetcher<IEHR>({
    url: `${path.ehr}/${ehrId}`,
    method: 'GET',
  });
};

const createEHR = (patientId: string) => {
  return fetcher<IEHR>({
    url: path.createEHR,
    method: 'POST',
    data: { patientId },
  });
};

export default {
  getEhrById,
  createEHR,
};
