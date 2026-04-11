import articleService from '@src/services/article.service';
import * as articleDao from '@src/daos/article.dao';
import * as authDao from '@src/daos/auth.dao';
import * as categoryDao from '@src/daos/category.dao';
import * as cloudinaryService from '@src/services/cloudinary.service';
import { CustomError, ErrorType } from '@src/core/Error';

// Mock các dependencies
jest.mock('@src/daos/article.dao');
jest.mock('@src/daos/auth.dao');
jest.mock('@src/daos/category.dao');
jest.mock('@src/services/cloudinary.service');

describe('Article Service Unit Tests', () => {
    const userId = 'user-1';
    const articleId = 'article-1';
    const slug = 'test-article';

    beforeEach(() => {
        // [Rollback]: Đảm bảo các mocks sạch sẽ
        jest.clearAllMocks();
    });

    // =========================================================================
    // 1. getArticleById
    // =========================================================================
    describe('getArticleById', () => {
        /**
         * TC-ART-01: Lấy bài viết bằng ID thành công
         * Mô tả: Trả về bài viết và tăng lượt xem
         */
        it('TC-ART-01 - should return article and increment view count', async () => {
            // 1. Setup
            (articleDao.findArticleById as jest.Mock).mockResolvedValue({ id: articleId, title: 'Test' });
            
            // 2. Action
            const result = await articleService.getArticleById(articleId);

            // 3. Verification (CheckDB)
            expect(result.id).toBe(articleId);
            expect(articleDao.incrementViewCount).toHaveBeenCalledWith(articleId);
        });

        /**
         * TC-ART-02: Lấy bài viết thất bại do ID không tồn tại
         */
        it('TC-ART-02 - should throw NOT_FOUND for invalid id', async () => {
            (articleDao.findArticleById as jest.Mock).mockResolvedValue(null);

            await expect(articleService.getArticleById(articleId))
                .rejects.toMatchObject({ type: ErrorType.NOT_FOUND });
        });
    });

    // =========================================================================
    // 2. createNewArticle
    // =========================================================================
    describe('createNewArticle', () => {
        /**
         * TC-ART-03: Bác sĩ tạo bài viết thành công
         */
        it('TC-ART-03 - should create article for doctor', async () => {
            // 1. Setup
            const mockUser = { id: userId, role: { name: 'doctor' } };
            const dto = { title: 'New Art', categoryId: 'cat-1', content: 'body' };
            (authDao.findUserById as jest.Mock).mockResolvedValue(mockUser);
            (categoryDao.findCategoryById as jest.Mock).mockResolvedValue({ id: 'cat-1' });
            (articleDao.checkSlugExists as jest.Mock).mockResolvedValue(false);
            (articleDao.createArticle as jest.Mock).mockResolvedValue({ id: 'new-id', ...dto });

            // 2. Action
            const result = await articleService.createNewArticle(dto as any, userId);

            // 3. Verification
            expect(result.title).toBe('New Art');
            expect(articleDao.createArticle).toHaveBeenCalled();
        });

        /**
         * TC-ART-04: Bệnh nhân tạo bài viết thất bại (Forbidden)
         */
        it('TC-ART-04 - should throw FORBIDDEN if user is patient', async () => {
            (authDao.findUserById as jest.Mock).mockResolvedValue({ id: userId, role: { name: 'patient' } });

            await expect(articleService.createNewArticle({} as any, userId))
                .rejects.toMatchObject({ type: ErrorType.FORBIDDEN });
        });
    });

    // =========================================================================
    // 3. deleteExistingArticle
    // =========================================================================
    describe('deleteExistingArticle', () => {
        /**
         * TC-ART-05: Tác giả xóa bài viết thành công
         */
        it('TC-ART-05 - should delete article if user is author', async () => {
            // 1. Setup
            (articleDao.findArticleByIdForEdit as jest.Mock).mockResolvedValue({ id: articleId, authorId: userId });

            // 2. Action
            const result = await articleService.deleteExistingArticle(articleId, userId, 'doctor');

            // 3. Verification
            expect(result.message).toContain('successfully');
            expect(articleDao.deleteArticle).toHaveBeenCalledWith(articleId);
        });

        /**
         * TC-ART-06: Người khác xóa bài viết thất bại
         */
        it('TC-ART-06 - should throw FORBIDDEN for non-author non-admin', async () => {
            (articleDao.findArticleByIdForEdit as jest.Mock).mockResolvedValue({ id: articleId, authorId: 'other' });

            await expect(articleService.deleteExistingArticle(articleId, userId, 'doctor'))
                .rejects.toMatchObject({ type: ErrorType.FORBIDDEN });
        });
    });

    // =========================================================================
    // 4. Review Workflow
    // =========================================================================
    describe('Review workflow', () => {
        /**
         * TC-ART-07: Gửi bài viết duyệt thành công
         */
        it('TC-ART-07 - should send article for review', async () => {
            (articleDao.findArticleByIdForEdit as jest.Mock).mockResolvedValue({ id: articleId, authorId: userId, status: 'draft' });
            (authDao.findUserById as jest.Mock).mockResolvedValue({ role: { name: 'doctor' } });
            (articleDao.updateArticle as jest.Mock).mockResolvedValue({ status: 'pending_review' });

            const result = await articleService.sendArticleForReview(articleId, userId);

            expect(result.status).toBe('pending_review');
        });
    });
});
