import { visitServiceService } from '@src/services/visit-service.service';
import { visitServiceDao } from '@src/daos/visit-service.dao';
import medicalServiceDao from '@src/daos/medical-service.dao';
import prisma from '@src/config/prisma';
import { CustomError, ErrorType } from '@src/core/Error';

// Mock các dependencies
jest.mock('@src/daos/visit-service.dao');
jest.mock('@src/daos/medical-service.dao');
jest.mock('@src/config/prisma', () => ({
    __esModule: true,
    default: {
        visit: { findUnique: jest.fn() },
    },
}));

describe('Visit Service Usage - Creation (Doctor Role)', () => {
    const visitId = 'visit-1';
    const medicalServiceId = 'ms-1';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * TC-BS-LK-DV-01: Chỉ định dịch vụ đơn lẻ thành công
     */
    it('TC-BS-LK-DV-01 - should create a service usage for an active visit', async () => {
        // 1. Setup
        (prisma.visit.findUnique as jest.Mock).mockResolvedValue({ id: visitId, status: 'in_progress', patient: { userId: 'p1' } });
        (medicalServiceDao.getMedicalServiceById as jest.Mock).mockResolvedValue({ id: medicalServiceId, price: 100 });
        (visitServiceDao.create as jest.Mock).mockResolvedValue({ id: 'vs-1', visitId });

        const dto = { visitId, medicalServiceId, quantity: 1 };

        // 2. Action
        const result = await visitServiceService.createServiceUsage(dto as any);

        // 3. Verification
        expect(result.id).toBe('vs-1');
        expect(visitServiceDao.create).toHaveBeenCalled();
    });

    /**
     * TC-BS-LK-DV-02: Lỗi khi chỉ định dịch vụ cho lượt khám đã KẾT THÚC (Audit Gap Check)
     * Lưu ý: Hiện tại code có thể CHƯA chặn trường hợp này. Test case này sẽ xác định lỗ hổng.
     */
    it('TC-BS-LK-DV-02 - should throw BAD_REQUEST if visit is already COMPLETED', async () => {
        (prisma.visit.findUnique as jest.Mock).mockResolvedValue({ id: visitId, status: 'completed' });
        (medicalServiceDao.getMedicalServiceById as jest.Mock).mockResolvedValue({ id: medicalServiceId, price: 100 });

        const dto = { visitId, medicalServiceId, quantity: 1 };

        // Mong muốn: Phải ném lỗi BAD_REQUEST hoặc tương tự
        await expect(visitServiceService.createServiceUsage(dto as any))
            .rejects.toThrow(); // Sẽ fail nếu code không chặn
    });

    /**
     * TC-BS-LK-DV-03: Chỉ định nhiều dịch vụ (Bulk Create)
     */
    it('TC-BS-LK-DV-03 - should bulk create service usages', async () => {
        (prisma.visit.findUnique as jest.Mock).mockResolvedValue({ id: visitId });
        (medicalServiceDao.getMedicalServiceById as jest.Mock).mockResolvedValue({ id: medicalServiceId, price: 100 });
        (visitServiceDao.bulkCreate as jest.Mock).mockResolvedValue([{ id: 'vs-1' }]);

        const dto = {
            items: [{ visitId, medicalServiceId, quantity: 1 }]
        };

        const result = await visitServiceService.bulkCreateServiceUsages(dto as any);

        expect(result.createdCount).toBe(1);
    });
});
