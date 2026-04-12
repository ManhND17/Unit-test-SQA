import { visitServiceService } from '@src/services/visit-service.service';
import { visitServiceDao } from '@src/daos/visit-service.dao';
import { CustomError, ErrorType } from '@src/core/Error';

// Mock các dependencies
jest.mock('@src/daos/visit-service.dao');

describe('Visit Service Usage - Management & Update (Doctor Role)', () => {
    const vsId = 'vs-1';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    /**
     * TC-BS-LK-DV-04: Cập nhật số lượng dịch vụ thành công
     */
    it('TC-BS-LK-DV-04 - should update service quantity if status is allowed', async () => {
        // 1. Setup
        (visitServiceDao.findById as jest.Mock).mockResolvedValue({ id: vsId, status: 'ordered' });
        (visitServiceDao.update as jest.Mock).mockResolvedValue({ id: vsId, quantity: 2 });

        const data = { quantity: 2 };

        // 2. Action
        const result = await visitServiceService.updateServiceUsage(vsId, data);

        // 3. Verification
        expect(result.quantity).toBe(2);
        expect(visitServiceDao.update).toHaveBeenCalledWith(vsId, data);
    });

    /**
     * TC-BS-LK-DV-05: Thất bại khi cập nhật dịch vụ đã hoàn thành hoặc đã hủy
     */
    it('TC-BS-LK-DV-05 - should throw BAD_REQUEST if service status is done or cancelled', async () => {
        (visitServiceDao.findById as jest.Mock).mockResolvedValue({ id: vsId, status: 'done' });

        await expect(visitServiceService.updateServiceUsage(vsId, { quantity: 3 }))
            .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
    });

    /**
     * TC-BS-LK-DV-06: Xóa dịch vụ thành công (khi trạng thái là ordered)
     */
    it('TC-BS-LK-DV-06 - should delete service usage if status is ordered', async () => {
        (visitServiceDao.findById as jest.Mock).mockResolvedValue({ id: vsId, status: 'ordered' });

        const result = await visitServiceService.deleteServiceUsage(vsId);

        expect(result.message).toContain('successfully');
        expect(visitServiceDao.delete).toHaveBeenCalledWith(vsId);
    });

    /**
     * TC-BS-LK-DV-07: Thất bại khi xóa dịch vụ đang thực hiện (in_progress)
     */
    it('TC-BS-LK-DV-07 - should throw BAD_REQUEST when deleting in_progress service', async () => {
        (visitServiceDao.findById as jest.Mock).mockResolvedValue({ id: vsId, status: 'in_progress' });

        await expect(visitServiceService.deleteServiceUsage(vsId))
            .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
    });
});
