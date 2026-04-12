import visitService from '@src/services/visit.service';
import prisma from '@src/config/prisma';
import { CustomError, ErrorType } from '@src/core/Error';

// Mock các dependencies
jest.mock('@src/config/prisma', () => ({
    __esModule: true,
    default: {
        visit: { 
            findUnique: jest.fn(),
            update: jest.fn()
        },
    },
}));

describe('Visit Service - Management & Audit (Doctor Role)', () => {
    const doctorId = 'doctor-1';
    const visitId = 'visit-1';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // =========================================================================
    // 1. Hoàn thành lượt khám (completeVisit)
    // =========================================================================
    describe('completeVisit', () => {
        /**
         * TC-BS-LK-SV-05: Hoàn thành lượt khám thành công
         */
        it('TC-BS-LK-SV-05 - should complete a visit successfully', async () => {
            (prisma.visit.findUnique as jest.Mock).mockResolvedValue({ id: visitId, doctorId, status: 'in_progress' });
            (prisma.visit.update as jest.Mock).mockResolvedValue({ id: visitId, status: 'completed' });

            const result = await visitService.completeVisit(visitId, doctorId, 'doctor');

            expect(result.status).toBe('completed');
            expect(prisma.visit.update).toHaveBeenCalledWith(expect.objectContaining({
                where: { id: visitId },
                data: expect.objectContaining({ status: 'completed' })
            }));
        });

        /**
         * TC-BS-LK-SV-06: Thất bại do bác sĩ không được phân công
         */
        it('TC-BS-LK-SV-06 - should throw FORBIDDEN if doctor is not assigned', async () => {
            (prisma.visit.findUnique as jest.Mock).mockResolvedValue({ id: visitId, doctorId: 'another-doctor' });

            await expect(visitService.completeVisit(visitId, doctorId, 'doctor'))
                .rejects.toMatchObject({ type: ErrorType.FORBIDDEN });
        });

        /**
         * TC-BS-LK-SV-07: Thất bại khi lượt khám đã kết thúc trước đó
         */
        it('TC-BS-LK-SV-07 - should throw BAD_REQUEST if visit is already completed', async () => {
            (prisma.visit.findUnique as jest.Mock).mockResolvedValue({ id: visitId, doctorId, status: 'completed' });

            await expect(visitService.completeVisit(visitId, doctorId, 'doctor'))
                .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });
    });

    // =========================================================================
    // 2. Hủy lượt khám (cancelVisit)
    // =========================================================================
    describe('cancelVisit', () => {
        it('TC-BS-LK-SV-08 - should cancel visit with reason', async () => {
            (prisma.visit.findUnique as jest.Mock).mockResolvedValue({ id: visitId, doctorId, status: 'waiting' });
            (prisma.visit.update as jest.Mock).mockResolvedValue({ id: visitId, status: 'cancelled' });

            const result = await visitService.cancelVisit(visitId, doctorId, 'doctor', { reason: 'No show' });

            expect(result.status).toBe('cancelled');
        });
    });

    // =========================================================================
    // 3. Hẹn tái khám (updateNextVisitDate)
    // =========================================================================
    describe('updateNextVisitDate', () => {
        /**
         * TC-BS-LK-SV-09: Cập nhật ngày hẹn tái khám
         */
        it('TC-BS-LK-SV-09 - should update next visit date', async () => {
            const nextDate = '2024-12-31';
            (prisma.visit.update as jest.Mock).mockResolvedValue({ id: visitId, nextVisitDate: new Date(nextDate) });

            const result = await visitService.updateNextVisitDate(visitId, nextDate);

            expect(result.nextVisitDate).toBeDefined();
            expect(prisma.visit.update).toHaveBeenCalledWith(expect.objectContaining({
                data: { nextVisitDate: new Date(nextDate) }
            }));
        });
    });
});
