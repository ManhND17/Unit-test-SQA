import { IMedicine } from '@src/types';
import { fetcherWithMetadata, QueryParam } from './Fetcher';

const path = {
  medicine: '/medicines',
};

const getMedicines = async (params: QueryParam) => {
  return fetcherWithMetadata<IMedicine[]>({
    url: path.medicine,
    method: 'GET',
    params,
  });
};

export default {
  getMedicines,
};
