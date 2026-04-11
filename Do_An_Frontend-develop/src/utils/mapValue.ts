import { IAddress } from '@src/types';

export const mapGender = (gender?: string) => {
  if (!gender) return '......';
  switch (gender) {
    case 'male':
      return 'Nam';
    case 'female':
      return 'Nữ';
    case 'other':
      return 'Khác';
    default:
      return 'Không xác định';
  }
};

export const formatGender = (g?: string | null) => {
  if (!g) return '—';
  const s = g.toLowerCase().trim();
  if (s === 'male') return 'Nam';
  if (s === 'female') return 'Nữ';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const mapAddress = (address?: IAddress) => {
  if (!address) return '......';
  return `${address.detail}, ${address.ward}, ${address.district}, ${address.city}`;
};
