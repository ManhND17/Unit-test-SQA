import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EPaymentMethod, EPaymentStatus, IHealthInsurance } from '@src/types';

export interface PaymentState {
  // Invoice Information
  invoiceId: string | null;
  patientId: string | null;
  patientName: string | null;

  // Financial Details
  servicesTotal: number;
  medicineTotal: number;
  subtotal: number; // servicesTotal + medicineTotal
  insurancePayment: number;
  discount: number;
  totalAmount: number; // Số tiền bệnh nhân phải trả

  // Insurance Information
  selectedInsurance: Partial<IHealthInsurance> | null;
  insuranceId: string | null;
  insuranceCoverage: number;

  // Medicine Selection (IDs of selected medicines)
  selectedMedicineIds: string[];

  // Payment Details
  paymentMethod: EPaymentMethod | null;
  paymentStatus: EPaymentStatus;

  // Additional Information
  notes: string | null;
  discountReason: string | null;

  // Metadata
  createdAt: string | null;
  updatedAt: string | null;
}

const initialState: PaymentState = {
  // Invoice Information
  invoiceId: null,
  patientId: null,
  patientName: null,

  // Financial Details
  servicesTotal: 0,
  medicineTotal: 0,
  subtotal: 0,
  insurancePayment: 0,
  discount: 0,
  totalAmount: 0,

  // Insurance Information
  selectedInsurance: null,
  insuranceId: null,
  insuranceCoverage: 0,

  // Medicine Selection
  selectedMedicineIds: [],

  // Payment Details
  paymentMethod: null,
  paymentStatus: EPaymentStatus.PENDING,

  // Additional Information
  notes: null,
  discountReason: null,

  // Metadata
  createdAt: null,
  updatedAt: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    /**
     * Set full payment information
     * Sử dụng khi chuyển từ màn chi tiết hóa đơn sang màn thanh toán
     */
    setPaymentInfo: (state, action: PayloadAction<Partial<PaymentState>>) => {
      return {
        ...state,
        ...action.payload,
        updatedAt: new Date().toISOString(),
      };
    },

    /**
     * Set invoice basic information
     */
    setInvoiceInfo: (
      state,
      action: PayloadAction<{
        invoiceId: string;
        patientId: string;
        patientName: string;
      }>
    ) => {
      state.invoiceId = action.payload.invoiceId;
      state.patientId = action.payload.patientId;
      state.patientName = action.payload.patientName;
      state.updatedAt = new Date().toISOString();
    },

    /**
     * Set financial totals
     */
    setFinancialTotals: (
      state,
      action: PayloadAction<{
        servicesTotal: number;
        medicineTotal: number;
        insurancePayment: number;
        discount: number;
        totalAmount: number;
      }>
    ) => {
      state.servicesTotal = action.payload.servicesTotal;
      state.medicineTotal = action.payload.medicineTotal;
      state.subtotal =
        action.payload.servicesTotal + action.payload.medicineTotal;
      state.insurancePayment = action.payload.insurancePayment;
      state.discount = action.payload.discount;
      state.totalAmount = action.payload.totalAmount;
      state.updatedAt = new Date().toISOString();
    },

    /**
     * Set insurance information
     */
    setInsuranceInfo: (
      state,
      action: PayloadAction<IHealthInsurance | null>
    ) => {
      state.selectedInsurance = action.payload;
      state.insuranceId = action.payload?.id || null;
      state.insuranceCoverage = action.payload?.coverage || 0;
      state.updatedAt = new Date().toISOString();
    },

    /**
     * Set selected medicine IDs
     */
    setSelectedMedicines: (state, action: PayloadAction<string[]>) => {
      state.selectedMedicineIds = action.payload;
      state.updatedAt = new Date().toISOString();
    },

    /**
     * Toggle medicine selection
     */
    toggleMedicineSelection: (state, action: PayloadAction<string>) => {
      const medicineId = action.payload;
      const index = state.selectedMedicineIds.indexOf(medicineId);

      if (index > -1) {
        state.selectedMedicineIds.splice(index, 1);
      } else {
        state.selectedMedicineIds.push(medicineId);
      }
      state.updatedAt = new Date().toISOString();
    },

    /**
     * Set payment method
     */
    setPaymentMethod: (state, action: PayloadAction<EPaymentMethod>) => {
      state.paymentMethod = action.payload;
      state.updatedAt = new Date().toISOString();
    },

    /**
     * Set payment status
     */
    setPaymentStatus: (state, action: PayloadAction<EPaymentStatus>) => {
      state.paymentStatus = action.payload;
      state.updatedAt = new Date().toISOString();
    },

    /**
     * Set discount information
     */
    setDiscount: (
      state,
      action: PayloadAction<{ amount: number; reason?: string }>
    ) => {
      state.discount = action.payload.amount;
      state.discountReason = action.payload.reason || null;
      state.updatedAt = new Date().toISOString();
    },

    /**
     * Set notes
     */
    setNotes: (state, action: PayloadAction<string>) => {
      state.notes = action.payload;
      state.updatedAt = new Date().toISOString();
    },

    /**
     * Clear all payment information
     * Sử dụng sau khi thanh toán thành công hoặc hủy
     */
    clearPaymentInfo: () => {
      return initialState;
    },

    /**
     * Reset to initial state
     */
    resetPayment: () => initialState,
  },
});

// Export actions
export const {
  setPaymentInfo,
  setInvoiceInfo,
  setFinancialTotals,
  setInsuranceInfo,
  setSelectedMedicines,
  toggleMedicineSelection,
  setPaymentMethod,
  setPaymentStatus,
  setDiscount,
  setNotes,
  clearPaymentInfo,
  resetPayment,
} = paymentSlice.actions;

// Export reducer
export default paymentSlice.reducer;

// Selectors
export const selectPaymentState = (state: { payment: PaymentState }) =>
  state.payment;
export const selectInvoiceInfo = (state: { payment: PaymentState }) => ({
  invoiceId: state.payment.invoiceId,
  patientId: state.payment.patientId,
  patientName: state.payment.patientName,
});
export const selectFinancialTotals = (state: { payment: PaymentState }) => ({
  servicesTotal: state.payment.servicesTotal,
  medicineTotal: state.payment.medicineTotal,
  subtotal: state.payment.subtotal,
  insurancePayment: state.payment.insurancePayment,
  discount: state.payment.discount,
  totalAmount: state.payment.totalAmount,
});
export const selectInsuranceInfo = (state: { payment: PaymentState }) => ({
  selectedInsurance: state.payment.selectedInsurance,
  insuranceId: state.payment.insuranceId,
  insuranceCoverage: state.payment.insuranceCoverage,
});
export const selectPaymentMethod = (state: { payment: PaymentState }) =>
  state.payment.paymentMethod;
export const selectPaymentStatus = (state: { payment: PaymentState }) =>
  state.payment.paymentStatus;
export const selectTotalAmount = (state: { payment: PaymentState }) =>
  state.payment.totalAmount;
