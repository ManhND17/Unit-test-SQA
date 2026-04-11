import { fetcherWithMetadata, IDataWithMeta, QueryParam } from './Fetcher';

export interface IAutoFill {
  id?: string;
  name?: string;
  avatar?: string;
  type?: number;
}

export interface IParamsAutofill extends QueryParam {
  name?: string;
}

const path = {
  autoDoctor: '/autofill/doctors',
};

function autoDoctor(
  params: IParamsAutofill
): Promise<IDataWithMeta<IAutoFill>> {
  return fetcherWithMetadata({
    url: path.autoDoctor,
    method: 'GET',
    params,
  });
}

export default {
  autoDoctor,
};
