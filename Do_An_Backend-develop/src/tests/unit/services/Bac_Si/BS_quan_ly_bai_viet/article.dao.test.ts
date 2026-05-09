import * as articleDao from '@src/daos/article.dao';
import prisma from '@src/config/prisma';
import { ArticleStatus } from '@prisma/client';
import { getTestUser, getTestCategory } from '@src/tests/helpers/test-helper';

// Mock QueryBuilder để hỗ trợ transaction trong DAO
jest.mock('@src/helpers/queryBuilder', () => {
    const actual = jest.requireActual('@src/helpers/queryBuilder');
    return {
        ...actual,
        createQueryBuilder: (model: any) => {
            const builder = actual.createQueryBuilder(model);
            const prismaInstance = require('@src/config/prisma').default;
            (builder as any).delegate = prismaInstance[model];
            return builder;
        }
    };
});

describe('Unit Test Article DAO Nâng cao - (TC_BS_BV_DAO_01 -> 15)', () => {
    let doctor: any, category: any;

    beforeAll(async () => {
        doctor = await getTestUser('doctor');
        category = await getTestCategory();
    });

    const runTest = async (fn: () => Promise<void>) => {
        try { await prisma.$transaction(async (tx) => {
            const originals: any = {};
            const models = ['healthArticle', 'user', 'category', 'role'];
            models.forEach(m => { originals[m] = (prisma as any)[m]; (prisma as any)[m] = tx[m]; });
            try { await fn(); } finally { models.forEach(m => (prisma as any)[m] = originals[m]); }
            throw new Error('ROLLBACK');
        }); } catch (e: any) { if (e.message !== 'ROLLBACK') throw e; }
    };

    it('TC_BS_BV_DAO_01 - createArticle: Tạo bài viết mới thành công', async () => {
        await runTest(async () => {
            const res = await articleDao.createArticle({ title: 'T', slug: 's1', content: 'C'.repeat(11), authorId: doctor.id, categoryId: category.id, status: ArticleStatus.draft });
            expect(res.title).toBe('T');
        });
    });

    it('TC_BS_BV_DAO_02 - updateArticle: Lỗi khi cập nhật bài viết không tồn tại', async () => {
        await runTest(async () => {
            await expect(articleDao.updateArticle('550e8400-e29b-41d4-a716-446655440000', { title: 'X' })).rejects.toThrow();
        });
    });

    it('TC_BS_BV_DAO_03 - deleteArticle: Lỗi khi xóa bài viết không tồn tại', async () => {
        await runTest(async () => {
            await expect(articleDao.deleteArticle('550e8400-e29b-41d4-a716-446655440000')).rejects.toThrow();
        });
    });

    it('TC_BS_BV_DAO_04 - findFeaturedArticles: Biên dưới - limit = 1', async () => {
        await runTest(async () => {
            await (prisma as any).healthArticle.create({ data: { title: 'A1', slug: 's4-1', content: 'C', authorId: doctor.id, categoryId: category.id, status: 'published', featured: true, viewCount: 10 } });
            await (prisma as any).healthArticle.create({ data: { title: 'A2', slug: 's4-2', content: 'C', authorId: doctor.id, categoryId: category.id, status: 'published', featured: true, viewCount: 10 } });
            const res = await articleDao.findFeaturedArticles({ page: '1', limit: '1' });
            expect(res.data.length).toBe(1);
        });
    });

    it('TC_BS_BV_DAO_05 - findFeaturedArticles: Biên trên - limit lớn', async () => {
        await runTest(async () => {
            const res = await articleDao.findFeaturedArticles({ page: '1', limit: '1000' });
            expect(res.data.length).toBeLessThanOrEqual(1000);
        });
    });

    it('TC_BS_BV_DAO_06 - findFeaturedArticles: Tìm thấy kết quả chính xác (Case-insensitive)', async () => {
        await runTest(async () => {
            await (prisma as any).healthArticle.create({ data: { title: 'Dengue Fever', slug: 's6', content: 'C', authorId: doctor.id, categoryId: category.id, status: 'published', featured: true, viewCount: 10 } });
            const res = await articleDao.findFeaturedArticles({ search: 'dengue' });
            expect(res.data[0].title).toMatch(/Dengue/i);
        });
    });

    it('TC_BS_BV_DAO_07 - findFeaturedArticles: Không tìm thấy kết quả', async () => {
        await runTest(async () => {
            const res = await articleDao.findFeaturedArticles({ search: 'non-existent-article-xyz-123' });
            expect(res.data.length).toBe(0);
        });
    });

    it('TC_BS_BV_DAO_08 - findFeaturedArticles: Lọc theo CategoryId', async () => {
        await runTest(async () => {
            const otherCat = await (prisma as any).category.create({ data: { name: 'Other', slug: 'other-' + Date.now() } });
            await (prisma as any).healthArticle.create({ data: { title: 'Cat A', slug: 's8-1', content: 'C', authorId: doctor.id, categoryId: category.id, status: 'published', featured: true, viewCount: 10 } });
            await (prisma as any).healthArticle.create({ data: { title: 'Cat B', slug: 's8-2', content: 'C', authorId: doctor.id, categoryId: otherCat.id, status: 'published', featured: true, viewCount: 10 } });
            
            const res = await articleDao.findFeaturedArticles({ categoryId: category.id });
            expect(res.data.every((a: any) => a.category.id === category.id)).toBe(true);
            expect(res.data.length).toBeGreaterThan(0);
        });
    });

    it('TC_BS_BV_DAO_09 - findFeaturedArticles: Sắp xếp theo lượt xem giảm dần (Default)', async () => {
        await runTest(async () => {
            await (prisma as any).healthArticle.create({ data: { title: 'Low', slug: 's9-1', content: 'C', authorId: doctor.id, categoryId: category.id, status: 'published', featured: true, viewCount: 10 } });
            await (prisma as any).healthArticle.create({ data: { title: 'High', slug: 's9-2', content: 'C', authorId: doctor.id, categoryId: category.id, status: 'published', featured: true, viewCount: 100 } });
            
            const res = await articleDao.findFeaturedArticles({ sortBy: 'viewCount', sortOrder: 'desc' });
            expect(res.data[0].viewCount).toBeGreaterThan(res.data[1].viewCount);
        });
    });

    it('TC_BS_BV_DAO_10 - incrementViewCount: Tăng lượt xem chính xác', async () => {
        await runTest(async () => {
            const art = await (prisma as any).healthArticle.create({ data: { title: 'T', slug: 's10', content: 'C', authorId: doctor.id, categoryId: category.id, viewCount: 5 } });
            await articleDao.incrementViewCount(art.id);
            const updated = await (prisma as any).healthArticle.findUnique({ where: { id: art.id } });
            expect(updated.viewCount).toBe(6);
        });
    });

    it('TC_BS_BV_DAO_11 - checkSlugExists: Trả về ID khi slug trùng', async () => {
        await runTest(async () => {
            const slug = 'test-slug';
            const art = await (prisma as any).healthArticle.create({ data: { title: 'T', slug, content: 'C', authorId: doctor.id, categoryId: category.id } });
            const exists = await articleDao.checkSlugExists(slug);
            expect(exists?.id).toBe(art.id);
        });
    });

    it('TC_BS_BV_DAO_12 - findArticleBySlug: Tìm bài viết theo slug thành công', async () => {
        await runTest(async () => {
            const slug = 'slug-12';
            await (prisma as any).healthArticle.create({ data: { title: 'T', slug, content: 'C', authorId: doctor.id, categoryId: category.id } });
            const res = await articleDao.findArticleBySlug(slug);
            expect(res?.slug).toBe(slug);
        });
    });

    it('TC_BS_BV_DAO_13 - updateArticle: Tự động cập nhật publishedAt khi chuyển sang published', async () => {
        await runTest(async () => {
            const art = await (prisma as any).healthArticle.create({ data: { title: 'T', slug: 's13', content: 'C', authorId: doctor.id, categoryId: category.id, status: 'draft' } });
            const res = await articleDao.updateArticle(art.id, { status: ArticleStatus.published });
            expect(res.publishedAt).not.toBeNull();
        });
    });

    it('TC_BS_BV_DAO_14 - findArticleByIdForEdit: Lấy được bài viết kể cả khi là draft', async () => {
        await runTest(async () => {
            const art = await (prisma as any).healthArticle.create({ data: { title: 'Draft', slug: 's14', content: 'C', authorId: doctor.id, categoryId: category.id, status: 'draft' } });
            const res = await articleDao.findArticleByIdForEdit(art.id);
            expect(res?.id).toBe(art.id);
        });
    });

    it('TC_BS_BV_DAO_15 - findLatestArticlesByAllCategory: Lấy bài viết mới nhất thành công', async () => {
        await runTest(async () => {
            const res = await articleDao.findLatestArticlesByAllCategory({ page: '1', limit: '5', sortBy: 'createdAt', sortOrder: 'desc' });
            expect(res).toBeDefined();
        });
    });
});
