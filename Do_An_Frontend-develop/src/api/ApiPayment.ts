import { EPaymentMethod, EPaymentStatus } from '@src/types';
import {
  VNPayReturnQueryDataDto,
  VNPayReturnResponse,
} from '@src/dto/payment.dto';
import { fetcher } from './Fetcher';

const path = {
  payment: '/payments',
  vnpayReturn: '/vnpay/return',
};

export type CreatePaymentBody = {
  invoiceId: string;
  paymentMethod: 'cash_on_delivery' | 'credit_card' | 'bank_transfer';
  userName?: string;
};

export type CreatePaymentResponse = {
  success: boolean;
  message: string;
  data: {
    paymentId: string;
    invoiceId: string;
    amount: number;
    paymentMethod: EPaymentMethod;
    status: EPaymentStatus;
    createdAt: Date;
    invoiceBreakdown?: {
      subtotal: number;
      discountAmount: number;
      insuranceAmount: number;
      totalAmount: number;
    };
  };
};

export type PaymentDetailResponse = {
  id: string;
  invoiceId: string;
  userName: string;
  paymentMethod: EPaymentMethod;
  amount: number;
  status: EPaymentStatus;
  createdAt: string;
  updatedAt: string;
  userId: string;
  patientId: string;
  invoice: {
    id: string;
    userId: string;
    status: EPaymentStatus;
    createdAt: string;
    patient: {
      patientId: string;
      userId: string;
      fullName: string;
      email: string;
    };
  };
};

function createNewPayment(
  data: CreatePaymentBody
): Promise<CreatePaymentResponse> {
  return fetcher({
    url: path.payment,
    method: 'POST',
    data,
  });
}

function getPaymentDetailById(
  paymentId: string
): Promise<PaymentDetailResponse> {
  return fetcher({
    url: `${path.payment}/${paymentId}`,
    method: 'GET',
  });
}

function getPaymentDetailByInvoiceId(
  invoiceId: string
): Promise<PaymentDetailResponse> {
  return fetcher({
    url: `${path.payment}/invoice/${invoiceId}`,
    method: 'GET',
  });
}

/**
 * Handle VNPay return callback
 * @param queryParams - VNPay return query parameters from URL
 * @returns Payment verification result
 */
function handleVNPayReturn(
  queryParams: VNPayReturnQueryDataDto
): Promise<VNPayReturnResponse> {
  return fetcher({
    url: path.vnpayReturn,
    method: 'GET',
    params: queryParams,
  });
}

/**
 * Call to get payment url
 * @param invoiceId - Invoice ID
 * @param brand - Brand name such as vnpay, moca, momo, etc.
 * @returns paymentUrl
 */

function getLinkPaymentUrl(
  invoiceId: string,
  brand: string,
  returnUrl: string
) {
  return fetcher<{ paymentUrl: string }>({
    url: `${path.payment}/url/${invoiceId}`,
    params: { method: brand, returnUrl },
    method: 'GET',
  });
}

export default {
  createNewPayment,
  getPaymentDetailById,
  getPaymentDetailByInvoiceId,
  handleVNPayReturn,
  getLinkPaymentUrl,
};
