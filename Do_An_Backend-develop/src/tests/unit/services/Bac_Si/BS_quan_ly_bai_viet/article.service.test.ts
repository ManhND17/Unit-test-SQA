import articleService from '@src/services/article.service';
import * as articleDao from '@src/daos/article.dao';
import * as authDao from '@src/daos/auth.dao';
import * as categoryDao from '@src/daos/category.dao';
import { CustomError, ErrorType } from '@src/core/Error';

// Mock các dependencies
jest.mock('@src/daos/article.dao');
jest.mock('@src/daos/auth.dao');
jest.mock('@src/daos/category.dao');
jest.mock('@src/services/cloudinary.service');
jest.mock('@src/config/prisma');

describe('Article Service Unit Tests (Complete Audit)', () => {
    const userId = 'user-1';
    const articleId = 'article-1';

    beforeEach(() => {
        jest.clearAllMocks();
    });

    // =========================================================================
    // 1. Quản lý Quyền hạn (Permissions)
    // =========================================================================
    describe('Permissions Audit', () => {
        it('TC_BS_BV_SV_001 - should throw FORBIDDEN if patient tries to create article', async () => {
            (authDao.findUserById as jest.Mock).mockResolvedValue({ id: userId, role: { name: 'patient' } });
            await expect(articleService.createNewArticle({} as any, userId))
                .rejects.toMatchObject({ type: ErrorType.FORBIDDEN });
        });

        it('TC_BS_BV_SV_002 - should throw FORBIDDEN if doctor tries to publish article directly', async () => {
            (authDao.findUserById as jest.Mock).mockResolvedValue({ id: userId, role: { name: 'doctor' } });
            await expect(articleService.createNewArticle({ status: 'published' } as any, userId))
                .rejects.toMatchObject({ type: ErrorType.FORBIDDEN });
        });

        it('TC_BS_BV_SV_003 - should throw FORBIDDEN when updating another doctor\'s article', async () => {
            (articleDao.findArticleByIdForEdit as jest.Mock).mockResolvedValue({ id: articleId, authorId: 'other-user' });
            await expect(articleService.updateExistingArticle(articleId, {}, userId, 'doctor'))
                .rejects.toMatchObject({ type: ErrorType.FORBIDDEN });
        });
    });

    // =========================================================================
    // 2. Tạo & Cập nhật (Success & Logic)
    // =========================================================================
    describe('Creation & Logic', () => {
        it('TC_BS_BV_SV_004 - should create draft article successfully for doctor', async () => {
            (authDao.findUserById as jest.Mock).mockResolvedValue({ id: userId, role: { name: 'doctor' } });
            (categoryDao.findCategoryById as jest.Mock).mockResolvedValue({ id: 'cat-1' });
            (articleDao.checkSlugExists as jest.Mock).mockResolvedValue(false);
            (articleDao.createArticle as jest.Mock).mockResolvedValue({ id: 'new-id', status: 'draft' });

            const result = await articleService.createNewArticle({ title: 'Title', content: 'Content...', categoryId: 'cat-1' } as any, userId);
            expect(result.status).toBe('draft');
        });

        it('TC_BS_BV_SV_005 - should update article successfully if user is the author', async () => {
            (authDao.findUserById as jest.Mock).mockResolvedValue({ id: userId, role: { name: 'doctor' } });
            (articleDao.findArticleByIdForEdit as jest.Mock).mockResolvedValue({ 
                id: articleId, authorId: userId, categoryId: 'cat-1', images: [] 
            });
            (articleDao.updateArticle as jest.Mock).mockResolvedValue({ id: articleId, title: 'Updated' });

            const result = await articleService.updateExistingArticle(articleId, { title: 'Updated' } as any, userId, 'doctor');
            expect(result.title).toBe('Updated');
        });

        it('TC_BS_BV_SV_006 - should generate unique slug if conflict exists', async () => {
            (authDao.findUserById as jest.Mock).mockResolvedValue({ id: userId, role: { name: 'doctor' } });
            (categoryDao.findCategoryById as jest.Mock).mockResolvedValue({ id: 'cat-1' });
            (articleDao.checkSlugExists as jest.Mock).mockResolvedValueOnce(true).mockResolvedValue(false);
            (articleDao.createArticle as jest.Mock).mockImplementation(d => Promise.resolve({ ...d, id: 'new-id' }));

            const result = await articleService.createNewArticle({ title: 'Conflict', categoryId: 'cat-1' } as any, userId);
            expect(result.slug).toBe('conflict-1');
        });
    });

    // =========================================================================
    // 3. Quy trình Review
    // =========================================================================
    describe('Review Workflow', () => {
        it('TC_BS_BV_SV_007 - should send draft article for review', async () => {
            (articleDao.findArticleByIdForEdit as jest.Mock).mockResolvedValue({ id: articleId, authorId: userId, status: 'draft' });
            (authDao.findUserById as jest.Mock).mockResolvedValue({ id: userId, role: { name: 'doctor' } });
            (articleDao.updateArticle as jest.Mock).mockResolvedValue({ status: 'pending_review' });

            const result = await articleService.sendArticleForReview(articleId, userId);
            expect(result.status).toBe('pending_review');
        });

        it('TC_BS_BV_SV_008 - should throw BAD_REQUEST if article is already published', async () => {
            (articleDao.findArticleByIdForEdit as jest.Mock).mockResolvedValue({ id: articleId, authorId: userId, status: 'published' });
            (authDao.findUserById as jest.Mock).mockResolvedValue({ id: userId, role: { name: 'doctor' } });

            await expect(articleService.sendArticleForReview(articleId, userId))
                .rejects.toMatchObject({ type: ErrorType.BAD_REQUEST });
        });
    });

    // =========================================================================
    // 4. Lọc & Tìm kiếm
    // =========================================================================
    describe('Filtering', () => {
        it('TC_BS_BV_SV_009 - should search articles by title/keyword', async () => {
            (articleDao.findArticles as jest.Mock).mockResolvedValue({ data: [] });
            await articleService.getArticles({ search: 'covid' });
            expect(articleDao.findArticles).toHaveBeenCalledWith(expect.objectContaining({ search: 'covid' }));
        });

        it('TC_BS_BV_SV_010 - should filter articles by category', async () => {
            (articleDao.findArticles as jest.Mock).mockResolvedValue({ data: [] });
            await articleService.getArticles({ categoryId: 'uuid-1' });
            expect(articleDao.findArticles).toHaveBeenCalledWith(expect.objectContaining({ categoryId: 'uuid-1' }));
        });
    });
});
