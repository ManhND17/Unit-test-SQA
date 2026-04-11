import { fetcher } from './Fetcher';

const path = {
  emergencyContact: '/emergency-contacts',
};

type EmergencyContactDto = {
  fullName: string;
  relationship: string;
  phone: string;
  email?: string;
};

const addEmergencyContact = async (
  userId: string,
  contactData: EmergencyContactDto
) => {
  return fetcher(
    {
      url: `${path.emergencyContact}/${userId}`,
      method: 'POST',
      data: contactData,
    },
    {
      displayError: false,
    }
  );
};

const updateEmergencyContact = async (
  userId: string,
  contactData: EmergencyContactDto
) => {
  return fetcher(
    {
      url: `${path.emergencyContact}/${userId}`,
      method: 'PATCH',
      data: contactData,
    },
    {
      displayError: false,
    }
  );
};

const deleteEmergencyContact = async (userId: string) => {
  return fetcher(
    {
      url: `${path.emergencyContact}/${userId}`,
      method: 'DELETE',
    },
    {
      displayError: false,
    }
  );
};

export default {
  addEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
};
