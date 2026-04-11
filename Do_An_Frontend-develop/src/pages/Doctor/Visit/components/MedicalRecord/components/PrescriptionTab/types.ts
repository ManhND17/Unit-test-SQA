import { IUser } from '@src/types';

export interface Medicine {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  notes: string;
  medicineId?: string;
}

export interface Prescription {
  id: string;
  paid?: boolean;
  createdAt?: string;
  createdByUserId?: string;
  createdBy?: IUser;
  medicines?: Medicine[];
  isEditing: boolean;
  isNew: boolean;
}

export type PrescriptionWithEditing = Prescription & {
  isEditing?: boolean;
  isNew: boolean;
};
