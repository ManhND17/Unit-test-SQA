import { DateTime } from 'luxon';

export const calculateAge = (birthDate: string) => {
  const birth = DateTime.fromISO(birthDate);
  const now = DateTime.now();

  const diff = now.diff(birth, ['years', 'months', 'days']).toObject();

  return {
    years: Math.floor(diff.years ?? 0),
    months: Math.floor(diff.months ?? 0),
    days: Math.floor(diff.days ?? 0),
  };
};

export const formatAge = (birthDate: string): string => {
  const age = calculateAge(birthDate);
  let ageString = '';

  if (age.years > 0) {
    ageString += `${age.years} tuổi `;
  } else if (age.months > 0) {
    ageString = `${age.months} tháng `;
  } else if (age.days > 0 && age.years === 0) {
    ageString = `${age.days} ngày`;
  }

  return ageString.trim();
};
