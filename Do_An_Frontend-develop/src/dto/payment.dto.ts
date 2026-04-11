import { z } from 'zod';

/**
 * VNPay Return Query Parameters
 * These parameters are sent by VNPay when redirecting user back to merchant site
 */
export const VNPayReturnQueryDto = z.object({
  vnp_Amount: z.string(),
  vnp_BankCode: z.string().optional(),
  vnp_BankTranNo: z.string().optional(),
  vnp_CardType: z.string().optional(),
  vnp_OrderInfo: z.string(),
  vnp_PayDate: z.string(),
  vnp_ResponseCode: z.string(),
  vnp_TmnCode: z.string(),
  vnp_TransactionNo: z.string().optional(),
  vnp_TransactionStatus: z.string(),
  vnp_TxnRef: z.string(),
  vnp_SecureHash: z.string(),
});

export type VNPayReturnQueryDataDto = z.infer<typeof VNPayReturnQueryDto>;

/**
 * VNPay Return Response from Backend
 */
export interface VNPayReturnResponse {
  success: boolean;
  message: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  responseCode: string;
  transactionNo?: string;
  amount: number;
  metadata: {
    vnp_TxnRef: string;
    vnp_TransactionNo?: string;
    vnp_BankCode?: string;
    vnp_PayDate: string;
    vnp_ResponseCode: string;
    vnp_TransactionStatus: string;
  };
  bankCode?: string;
  payDate: string;
}
