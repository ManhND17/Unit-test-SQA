import { calculateInvoiceTotal } from '@src/helpers/calculateInvoiceTotal';
import prisma from '@src/config/prisma';
import { mapBenefitLevelToCoverage } from '@src/helpers/healthInsurance';

jest.mock('@src/config/prisma', () => ({
    __esModule: true,
    default: {
        invoice: {
            findUnique: jest.fn(),
        },
        invoiceItem: {
            findMany: jest.fn(),
        },
        visitService: {
            findMany: jest.fn(),
        },
        prescription: {
            findMany: jest.fn(),
        },
        healthInsurance: {
            findUnique: jest.fn(),
        },
    },
}));

jest.mock('@src/helpers/healthInsurance', () => ({
    mapBenefitLevelToCoverage: jest.fn(),
}));

describe('calculateInvoiceTotal', () => {
    const mockInvoiceId = 'invoice-1';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should calculate total correctly without insurance or discount', async () => {
        (prisma.invoice.findUnique as jest.Mock).mockResolvedValue({
            id: mockInvoiceId,
            healthInsuranceId: null,
        });

        (prisma.invoiceItem.findMany as jest.Mock).mockResolvedValue([
            { item_type: 'service', refId: 'service-1' },
            { item_type: 'medicine', refId: 'presc-1' },
        ]);

        (prisma.visitService.findMany as jest.Mock).mockResolvedValue([
            { id: 'service-1', price: 100000, quantity: 1, medicalService: { percentApplyHealthInsurance: 0 }, status: 'completed' },
        ]);

        (prisma.prescription.findMany as jest.Mock).mockResolvedValue([
            {
                id: 'presc-1',
                medicineUsages: [
                    { price: 50000, quantity: 2, isPurchased: true },
                ],
            },
        ]);

        const result = await calculateInvoiceTotal(mockInvoiceId);

        expect(result.subtotal).toBe(200000); // 100k + 50k*2
        expect(result.totalAmount).toBe(200000);
        expect(result.insuranceAmount).toBe(0);
    });

    it('should apply health insurance correctly', async () => {
        (prisma.invoice.findUnique as jest.Mock).mockResolvedValue({
            id: mockInvoiceId,
            healthInsuranceId: 'hi-1',
        });

        (prisma.healthInsurance.findUnique as jest.Mock).mockResolvedValue({
            id: 'hi-1',
            level_of_benefit: 3,
        });

        (mapBenefitLevelToCoverage as jest.Mock).mockReturnValue(95);

        (prisma.invoiceItem.findMany as jest.Mock).mockResolvedValue([
            { item_type: 'service', refId: 'service-1' },
        ]);

        (prisma.visitService.findMany as jest.Mock).mockResolvedValue([
            { id: 'service-1', price: 100000, quantity: 1, medicalService: { percentApplyHealthInsurance: 100 }, status: 'completed' },
        ]);

        (prisma.prescription.findMany as jest.Mock).mockResolvedValue([]);

        const result = await calculateInvoiceTotal(mockInvoiceId);

        expect(result.insuranceAmount).toBe(95000); // 95% of 100k
        expect(result.totalAmount).toBe(5000); // 100k - 95k
    });

    it('should throw error if invoice not found', async () => {
        (prisma.invoice.findUnique as jest.Mock).mockResolvedValue(null);

        await expect(calculateInvoiceTotal(mockInvoiceId)).rejects.toThrow('Hóa đơn không tồn tại');
    });
});
