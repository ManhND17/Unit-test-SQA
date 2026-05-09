import articleService from '@src/services/article.service';
import { ErrorType } from '@src/core/Error';
import prisma from '@src/config/prisma';
import { getTestUser, getTestCategory } from '@src/tests/helpers/test-helper';
import * as cloudinaryService from '@src/services/cloudinary.service';
import * as articleDao from '@src/daos/article.dao';

// Mock Cloudinary
jest.mock('@src/services/cloudinary.service', () => ({
    uploadToCloudinary: jest.fn().mockResolvedValue({ url: 'http://cloudinary.com/test.jpg' }),
    deleteFromCloudinary: jest.fn().mockResolvedValue(true),
}));

// Mock DAO
const mockLatest = jest.spyOn(articleDao, 'findLatestArticlesByAllCategory');
const mockMostViewed = jest.spyOn(articleDao, 'findMostViewedArticlesByAllCategory');

// Mock QueryBuilder để hỗ trợ transaction
jest.mock('@src/helpers/queryBuilder', () => {
    const actual = jest.requireActual('@src/helpers/queryBuilder');
    return {
        ...actual,
        createQueryBuilder: (model: any) => {
            const builder = actual.createQueryBuilder(model);
            const prisma = require('@src/config/prisma').default;
            (builder as any).delegate = prisma[model];
            return builder;
        }
    };
});

describe('Unit Test Article Service - Sắp xếp chuẩn (TC_BS_BV_001 -> 035)', () => {
    let doctor: any, patient: any, category: any;

    beforeAll(async () => {
        doctor = await getTestUser('doctor');
        patient = await getTestUser('patient');
        category = await getTestCategory();
    });

    const runTest = async (fn: () => Promise<void>) => {
        try { await prisma.$transaction(async (tx) => {
            const models = ['healthArticle', 'user', 'category', 'role'];
            const originals: any = {};
            models.forEach(m => { originals[m] = (prisma as any)[m]; (prisma as any)[m] = tx[m]; });
            try { await fn(); } finally { models.forEach(m => (prisma as any)[m] = originals[m]); }
            throw new Error('ROLLBACK');
        }); } catch (e: any) { if (e.message !== 'ROLLBACK') throw e; }
    };

    it('TC_BS_BV_001 - createNewArticle: Chặn Bệnh nhân tạo bài viết', async () => {
        await runTest(async () => {
            await expect(articleService.createNewArticle({ title: 'T', content: 'C'.repeat(11), categoryId: category.id, publishedAt: 'now' } as any, patient.id)).rejects.toThrow();
        });
    });

    it('TC_BS_BV_002 - createNewArticle: Chặn Bác sĩ đăng bài trực tiếp', async () => {
        await runTest(async () => {
            await expect(articleService.createNewArticle({ title: 'T', content: 'C'.repeat(11), categoryId: category.id, status: 'published', publishedAt: 'now' } as any, doctor.id)).rejects.toThrow();
        });
    });

    it('TC_BS_BV_003 - updateExistingArticle: Chặn Bác sĩ sửa bài của người khác', async () => {
        await runTest(async () => {
            const other = await (prisma as any).user.create({ data: { username: 'u3', email: 'u3@e.com', password: '1', roleId: doctor.roleId } });
            const art = await (prisma as any).healthArticle.create({ data: { title: 'T', slug: 's3', content: 'C'.repeat(11), authorId: other.id, categoryId: category.id } });
            await expect(articleService.updateExistingArticle(art.id, { title: 'X' }, doctor.id, 'doctor')).rejects.toThrow();
        });
    });

    it('TC_BS_BV_004 - deleteExistingArticle: Chặn Bác sĩ xóa bài của người khác', async () => {
        await runTest(async () => {
            const other = await (prisma as any).user.create({ data: { username: 'u4', email: 'u4@e.com', password: '1', roleId: doctor.roleId } });
            const art = await (prisma as any).healthArticle.create({ data: { title: 'T', slug: 's4', content: 'C'.repeat(11), authorId: other.id, categoryId: category.id } });
            await expect(articleService.deleteExistingArticle(art.id, doctor.id, 'doctor')).rejects.toThrow();
        });
    });

    it('TC_BS_BV_005 - createNewArticle: Bác sĩ tạo bài viết nháp thành công', async () => {
        await runTest(async () => {
            const res = await articleService.createNewArticle({ title: 'Draft', content: 'C'.repeat(11), categoryId: category.id, status: 'draft', publishedAt: 'now' } as any, doctor.id);
            expect(res.status).toBe('draft');
        });
    });

    it('TC_BS_BV_006 - updateExistingArticle: Bác sĩ cập nhật bài của mình thành công', async () => {
        await runTest(async () => {
            const art = await (prisma as any).healthArticle.create({ data: { title: 'O', slug: 'o', content: 'C'.repeat(11), authorId: doctor.id, categoryId: category.id } });
            const res = await articleService.updateExistingArticle(art.id, { title: 'New' }, doctor.id, 'doctor');
            expect(res.title).toBe('New');
        });
    });

    it('TC_BS_BV_007 - createNewArticle: Tự động sinh Slug duy nhất khi trùng', async () => {
        await runTest(async () => {
            await (prisma as any).healthArticle.create({ data: { title: 'X', slug: 'x', content: 'C'.repeat(11), authorId: doctor.id, categoryId: category.id } });
            const res = await articleService.createNewArticle({ title: 'X', content: 'C'.repeat(11), categoryId: category.id, publishedAt: 'now' } as any, doctor.id);
            expect(res.slug).toBe('x-1');
        });
    });

    it('TC_BS_BV_008 - sendArticleForReview: Gửi bài kiểm duyệt thành công', async () => {
        await runTest(async () => {
            const art = await (prisma as any).healthArticle.create({ data: { title: 'T', slug: 's8', content: 'C'.repeat(11), authorId: doctor.id, categoryId: category.id, status: 'draft' } });
            const res = await articleService.sendArticleForReview(art.id, doctor.id);
            expect(res.status).toBe('pending_review');
        });
    });

    it('TC_BS_BV_009 - createNewArticle: Kiểm tra tạo bài với cấu trúc JSON', async () => {
        await runTest(async () => {
            const res = await articleService.createNewArticle({ title: 'T', content: 'C'.repeat(11), categoryId: category.id, extras: { a: 1 }, publishedAt: 'now' } as any, doctor.id);
            expect((res.extras as any).a).toBe(1);
        });
    });

    it('TC_BS_BV_010 - sendArticleForReview: Thất bại khi gửi duyệt bài đã đăng', async () => {
        await runTest(async () => {
            const art = await (prisma as any).healthArticle.create({ data: { title: 'T', slug: 's10', content: 'C'.repeat(11), authorId: doctor.id, categoryId: category.id, status: 'published' } });
            await expect(articleService.sendArticleForReview(art.id, doctor.id)).rejects.toThrow();
        });
    });

    it('TC_BS_BV_011 - createNewArticle: Báo lỗi khi tiêu đề quá ngắn (Service)', async () => {
        await runTest(async () => {
            await expect(articleService.createNewArticle({ title: 'A', content: 'C'.repeat(11), categoryId: category.id, publishedAt: 'now' } as any, doctor.id)).rejects.toThrow();
        });
    });

    it('TC_BS_BV_012 - createNewArticle: Báo lỗi khi định dạng UUID sai', async () => {
        await runTest(async () => {
            await expect(articleService.createNewArticle({ title: 'T', content: 'C'.repeat(11), categoryId: 'bad', publishedAt: 'now' } as any, doctor.id)).rejects.toThrow();
        });
    });

    it('TC_BS_BV_013 - createNewArticle: Báo lỗi khi trạng thái không hợp lệ', async () => {
        await runTest(async () => {
            await expect(articleService.createNewArticle({ title: 'T', content: 'C'.repeat(11), categoryId: category.id, status: 'wrong', publishedAt: 'now' } as any, doctor.id)).rejects.toThrow();
        });
    });

    it('TC_BS_BV_014 - getArticles: Tìm bài viết theo từ khóa', async () => {
        await runTest(async () => {
            const key = 'Search-' + Math.random();
            await (prisma as any).healthArticle.create({ data: { title: key, slug: 's14-' + key, content: 'C'.repeat(11), authorId: doctor.id, categoryId: category.id, status: 'draft' } });
            const res = await articleService.getArticles({ search: key });
            expect(res.data.length).toBeGreaterThan(0);
        });
    });

    it('TC_BS_BV_015 - getArticles: Lọc bài viết theo chuyên mục', async () => {
        await runTest(async () => {
            const res = await articleService.getArticles({ categoryId: category.id });
            expect(res.data.every((a: any) => a.categoryId === category.id)).toBe(true);
        });
    });

    it('TC_BS_BV_017 - getArticles: Tự động chuyển kiểu cho phân trang', async () => {
        await runTest(async () => {
            const res = await articleService.getArticles({ page: '1', limit: '5' } as any);
            expect(typeof res.metadata.limit).toBe('number');
        });
    });

    it('TC_BS_BV_018 - updateExistingArticle: Cập nhật từng phần: Chỉ tiêu đề', async () => {
        await runTest(async () => {
            const art = await (prisma as any).healthArticle.create({ data: { title: 'Old', slug: 's18', content: 'C'.repeat(11), authorId: doctor.id, categoryId: category.id } });
            const res = await articleService.updateExistingArticle(art.id, { title: 'New' }, doctor.id, 'doctor');
            expect(res.title).toBe('New');
        });
    });

    it('TC_BS_BV_019 - updateExistingArticle: Cập nhật từng phần: Chỉ nội dung', async () => {
        await runTest(async () => {
            const art = await (prisma as any).healthArticle.create({ data: { title: 'T', slug: 's19', content: 'Old', authorId: doctor.id, categoryId: category.id } });
            const res = await articleService.updateExistingArticle(art.id, { content: 'New' }, doctor.id, 'doctor');
            expect(res.content).toBe('New');
        });
    });

    it('TC_BS_BV_020 - updateExistingArticle: Cập nhật từng phần: Chỉ chuyên mục', async () => {
        await runTest(async () => {
            const art = await (prisma as any).healthArticle.create({ data: { title: 'T', slug: 's20', content: 'C', authorId: doctor.id, categoryId: category.id } });
            const res = await articleService.updateExistingArticle(art.id, { categoryId: category.id }, doctor.id, 'doctor');
            expect(res.categoryId).toBe(category.id);
        });
    });

    it('TC_BS_BV_021 - updateExistingArticle: Cập nhật danh sách ảnh', async () => {
        await runTest(async () => {
            const art = await (prisma as any).healthArticle.create({ data: { title: 'T', slug: 's21', content: 'C', authorId: doctor.id, categoryId: category.id } });
            const res = await articleService.updateExistingArticle(art.id, { imagesUrl: ['n.jpg'] }, doctor.id, 'doctor');
            expect(res.images).toContain('n.jpg');
        });
    });

    it('TC_BS_BV_022 - updateExistingArticle: Chuyển bài bị từ chối về nháp', async () => {
        await runTest(async () => {
            const art = await (prisma as any).healthArticle.create({ data: { title: 'T', slug: 's22', content: 'C', authorId: doctor.id, categoryId: category.id, status: 'rejected' } });
            const res = await articleService.updateExistingArticle(art.id, { status: 'draft' }, doctor.id, 'doctor');
            expect(res.status).toBe('draft');
        });
    });

    it('TC_BS_BV_023 - createNewArticle: Tạo bài với ảnh <= 5MB', async () => {
        await runTest(async () => {
            const files = { thumbnail: [{ size: 1 * 1024 * 1024, path: 'p' }] };
            const res = await articleService.createNewArticle({ title: 'T', content: 'C'.repeat(11), categoryId: category.id, publishedAt: 'now' } as any, doctor.id, files as any);
            expect(res.imageUrl).toBeDefined();
        });
    });

    it('TC_BS_BV_024 - createNewArticle: Báo lỗi khi ảnh vượt quá 5MB', async () => {
        await runTest(async () => {
            const files = { thumbnail: [{ size: 6 * 1024 * 1024, path: 'p' }] };
            await expect(articleService.createNewArticle({ title: 'T', content: 'C'.repeat(11), categoryId: category.id, publishedAt: 'now' } as any, doctor.id, files as any)).rejects.toThrow();
        });
    });

    it('TC_BS_BV_025 - getLatestArticlesByAllCategories: Thành công', async () => {
        await runTest(async () => {
            mockLatest.mockResolvedValueOnce({ data: [{ id: '1' }], totalItems: 1, totalPages: 1, currentPage: 1 } as any);
            const res = await articleService.getLatestArticlesByAllCategories({} as any);
            expect(res.data.length).toBeGreaterThan(0);
        });
    });

    it('TC_BS_BV_026 - getMostViewedArticlesByAllCategories: Thành công', async () => {
        await runTest(async () => {
            mockMostViewed.mockResolvedValueOnce({ data: [{ id: '1' }], totalItems: 1, totalPages: 1, currentPage: 1 } as any);
            const res = await articleService.getMostViewedArticlesByAllCategories({} as any);
            expect(res.data.length).toBeGreaterThan(0);
        });
    });

    it('TC_BS_BV_027 - getRelatedArticles: Thành công', async () => {
        await runTest(async () => {
            const art = await (prisma as any).healthArticle.create({ data: { title: 'T', slug: 's27', content: 'C', authorId: doctor.id, categoryId: category.id, status: 'published' } });
            const res = await articleService.getRelatedArticles({ articleId: art.id } as any);
            expect(res).toBeDefined();
        });
    });

    it('TC_BS_BV_028 - incrementViewCount: Tăng lượt xem thành công', async () => {
        await runTest(async () => {
            const art = await (prisma as any).healthArticle.create({ data: { title: 'T', slug: 's28', content: 'C', authorId: doctor.id, categoryId: category.id, viewCount: 0 } });
            await articleService.incrementViewCount(art.id);
            const updated = await (prisma as any).healthArticle.findUnique({ where: { id: art.id } });
            expect(updated.viewCount).toBe(1);
        });
    });

    it('TC_BS_BV_029 - getFeaturedArticles: Thành công', async () => {
        await runTest(async () => {
            await (prisma as any).healthArticle.create({ data: { title: 'F', slug: 'f-' + Math.random(), content: 'C'.repeat(11), authorId: doctor.id, categoryId: category.id, featured: true, status: 'published' } });
            const res = await articleService.getFeaturedArticles({ page: '1', limit: '5' });
            expect(res.data.length).toBeGreaterThan(0);
        });
    });

    it('TC_BS_BV_030 - getArticlesByCategory: Thành công', async () => {
        await runTest(async () => {
            await (prisma as any).healthArticle.create({ data: { title: 'C', slug: 'c-' + Math.random(), content: 'C'.repeat(11), authorId: doctor.id, categoryId: category.id, status: 'published' } });
            const res = await articleService.getArticlesByCategory(category.id, { page: '1' });
            expect(res.data.length).toBeGreaterThan(0);
        });
    });

    it('TC_BS_BV_031 - getArticleById: Lỗi không tìm thấy', async () => {
        await runTest(async () => {
            // Sửa lại chuỗi khớp với: Article not found! (id)
            await expect(articleService.getArticleById('550e8400-e29b-41d4-a716-446655440000')).rejects.toThrow('Article not found!');
        });
    });

    it('TC_BS_BV_032 - getFeaturedArticles: Lỗi rỗng', async () => {
        await runTest(async () => {
            const spy = jest.spyOn(articleDao, 'findFeaturedArticles');
            spy.mockResolvedValueOnce({ data: [] } as any);
            await expect(articleService.getFeaturedArticles({})).rejects.toThrow('No featured articles found');
            spy.mockRestore();
        });
    });

    it('TC_BS_BV_033 - getLatestArticlesByAllCategories: Lỗi rỗng', async () => {
        await runTest(async () => {
            mockLatest.mockResolvedValueOnce({ data: [] } as any);
            await expect(articleService.getLatestArticlesByAllCategories({} as any)).rejects.toThrow('No latest articles found');
        });
    });

    it('TC_BS_BV_034 - getMostViewedArticlesByAllCategories: Lỗi rỗng', async () => {
        await runTest(async () => {
            mockMostViewed.mockResolvedValueOnce({ data: [] } as any);
            await expect(articleService.getMostViewedArticlesByAllCategories({} as any)).rejects.toThrow('No most viewed articles found');
        });
    });

    it('TC_BS_BV_035 - createNewArticle: Lỗi Category không tồn tại', async () => {
        await runTest(async () => {
            await expect(articleService.createNewArticle({ title: 'T', content: 'C'.repeat(11), categoryId: '550e8400-e29b-41d4-a716-446655440001', publishedAt: 'now' } as any, doctor.id)).rejects.toThrow('Category not found');
        });
    });
});
