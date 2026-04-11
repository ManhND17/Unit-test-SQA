import {
  EInvoiceStatus,
  EPaymentStatus,
  IHealthInsurance,
  IPayment,
  IPrescription,
  IVisitService,
} from '@src/types';
import {
  fetcher,
  fetcherWithMetadata,
  IDataWithMeta,
  QueryParam,
} from './Fetcher';

const path = {
  invoice: '/invoices',
  getListVoices: '/invoices',
};

export type InvoicePatient = {
  id: string;
  userId: string;
  status: EInvoiceStatus;
  createdAt: string;
  updatedAt: string;
  patient: {
    patientId: string;
    userId: string;
    fullName: string;
    birthday?: string | null;
  };
  computedTotal: {
    total: number;
  };
  payment: {
    id: string;
    amount: number;
    status: EPaymentStatus;
    createdAt: string;
  } | null;
};

export type ComputedTotal = {
  subtotal: number;
  discountAmount: number;
  insuranceCoverageAmount: number;
  insuranceAmount: number;
  totalAmount: number;
  breakdown?: {
    servicesTotal: number;
    medicinesTotal: number;
    serviceCount: number;
    medicineCount: number;
  };
  healthInsuranceId?: string | null;
};

export type InvoiceDetail = {
  id: string;
  userId: string;
  patientId: string;
  healthInsuranceId?: string | null;
  status: EInvoiceStatus;
  subtotal: number;
  discountAmount: number;
  discountReason?: string | null;
  insuranceCoverageAmount: number;
  insuranceAmount: number;
  totalAmount: number;
  notes?: string | null;
  issuedBy: string | null;
  createdAt: string;
  updatedAt: string;
  patient: {
    patientId: string;
    userId: string;
    fullName: string;
    email: string;
    phone: string;
    birthday?: string | null;
  };
  healthInsurance?: Partial<IHealthInsurance>;
  visitServices: IVisitService[];
  prescriptions: IPrescription[];
  payment?: IPayment | null;
  computedTotal?: ComputedTotal;
};

export type CreateInvoiceResponse = {
  id: string;
  patientId: string;
  healthInsuranceId?: string;
  status: EInvoiceStatus;
  // Financial breakdown
  subtotal: number;
  discountAmount: number;
  discountReason?: string;
  insuranceCoveragePercent: number;
  insuranceAmount: number;
  totalAmount: number;
  // Metadata
  notes?: string;
  issuedBy?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateInvoiceBody = {
  patientId: string;
  discountAmount: number;
  serviceUsageIds?: string[];
  prescriptionIds?: string[];
  discountReason?: string;
  issuedBy?: string;
  healthInsuranceId?: string;
};

export type UpdatePurchasedMedicinesBody = {
  medicineUsageIds: string[];
};

export type CancelServiceBody = {
  serviceUsageIds: string[];
  reason: string;
};

// Types for unbilled items
// export type UnbilledService = {
//   id: string;
//   visitId: string;
//   medicalServiceId: string;
//   medicalService: {
//     id: string;
//     name: string;
//     price: number;
//     percentApplyHealthInsurance: number;
//   };
//   quantity: number;
//   price: number;
//   status: string;
//   orderedAt: string;
// };

// export type UnbilledPrescription = {
//   id: string;
//   visitId: string;
//   paid: boolean;
//   createdAt: string;
//   medicineUsages: {
//     id: string;
//     drugName: string;
//     quantity: number;
//     price: number;
//     unit?: string;
//   }[];
// };

function getListInvoices(
  params: QueryParam & { status?: EInvoiceStatus; createdAt?: string }
): Promise<IDataWithMeta<InvoicePatient[]>> {
  return fetcherWithMetadata({
    url: path.getListVoices,
    method: 'GET',
    params,
  });
}

function getDetailInvoice(invoiceId: string): Promise<InvoiceDetail> {
  return fetcher({
    url: `${path.invoice}/${invoiceId}`,
    method: 'GET',
  });
}

function sendInvoiceToEmail(
  invoiceId: string,
  email: string
): Promise<{ success: boolean }> {
  return fetcher({
    url: `${path.invoice}/${invoiceId}/send-email`,
    method: 'POST',
    data: { email },
  });
}

function createInvoiceManually(
  data: CreateInvoiceBody
): Promise<CreateInvoiceResponse> {
  return fetcher({
    url: path.invoice,
    method: 'POST',
    data,
  });
}

function cancelServiceUsage(
  invoicedId: string,
  data: CancelServiceBody
): Promise<{ success: boolean }> {
  return fetcher({
    url: `${path.invoice}/${invoicedId}/items/service/cancel`,
    method: 'POST',
    data,
  });
}

export type UnpaidItemsResponse = {
  patient: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
    birthday?: string | null;
    patientId: string;
  };
  unpaidPrescriptions: IPrescription[];
  unpaidVisitServices: IVisitService[];
};

function getUnpaidItems(patientId: string): Promise<UnpaidItemsResponse> {
  return fetcher({
    url: `${path.invoice}/unpaid-services/${patientId}`,
    method: 'GET',
  });
}

export default {
  getListInvoices,
  getDetailInvoice,
  sendInvoiceToEmail,
  createInvoiceManually,
  cancelServiceUsage,
  getUnpaidItems,
};
