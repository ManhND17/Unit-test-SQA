import { ContactDataDto } from '@dto/contact.dto';
import { fetcher, fetcherWithMetadata, QueryParam } from './Fetcher';
import { IContact } from 'src/types';

const path = {
  baseContact: '/contacts',
  sendContact: '/contacts',
  adminGetContacts: '/contacts',
};

const sendContact = (data: ContactDataDto) => {
  return fetcher<IContact>({
    url: path.sendContact,
    method: 'POST',
    data,
  });
};

const adminGetContacts = (params: QueryParam & { isRead?: string }) => {
  return fetcherWithMetadata<IContact[]>({
    url: path.adminGetContacts,
    method: 'GET',
    params,
  });
};

const replyContact = (id: string, message: string) => {
  return fetcher<IContact>({
    url: `${path.baseContact}/${id}/reply`,
    method: 'POST',
    data: { message },
  });
};

const getMyContacts = (params?: QueryParam & { isRead?: string }) => {
  return fetcherWithMetadata<IContact[]>({
    url: `${path.baseContact}/my`,
    method: 'GET',
    params,
  });
};

export default {
  sendContact,
  adminGetContacts,
  replyContact,
  getMyContacts,
};
