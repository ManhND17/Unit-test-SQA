import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPatient } from '@src/types';

interface IPatientState {
  patient?: IPatient;
}

const initialState: IPatientState = {};

type PatientUpdatePayload = Partial<Omit<IPatient, 'patientId'>> & {
  patientId?: string;
};

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    setPatient: (state, action: PayloadAction<IPatient>) => {
      state.patient = action.payload;
    },
    clearPatient: (state) => {
      state.patient = undefined;
    },
    updatePatient: (state, action: PayloadAction<PatientUpdatePayload>) => {
      if (state.patient) {
        return {
          ...state,
          patient: {
            ...state.patient,
            ...action.payload,
          },
        };
      }
    },
  },
});

export const { setPatient, clearPatient, updatePatient } = patientSlice.actions;
export default patientSlice.reducer;
