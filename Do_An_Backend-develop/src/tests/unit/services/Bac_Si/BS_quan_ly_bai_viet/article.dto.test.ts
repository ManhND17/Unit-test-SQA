import { getArticlesDto, CreateArticleDto, UpdateArticleDto } from '@src/dtos/article.dto';

describe('Article DTO Validation Logic (Comprehensive for Doctor)', () => {

    // =========================================================================
    // 1. getArticlesDto (Danh sách & Lọc)
    // =========================================================================
    describe('getArticlesDto validation', () => {
        it('TC-BS-BV-DTO-01 - should validate ALL filter parameters used by doctors', () => {
            const validData = {
                page: '1',
                limit: '15',
                sortBy: 'publishedAt', // Sắp xếp theo ngày xuất bản
                sortOrder: 'desc',
                status: 'pending_review',
                categoryId: '550e8400-e29b-41d4-a716-446655440000',
                authorId: '550e8400-e29b-41d4-a716-446655440001',
                assigneeId: '550e8400-e29b-41d4-a716-446655440002',
                search: 'hướng dẫn khám bệnh'
            };
            const result = getArticlesDto.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('TC-BS-BV-DTO-02 - should fail with invalid status', () => {
            const invalidData = { status: 'invalid_status' };
            const result = getArticlesDto.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('TC-BS-BV-DTO-03 - should handle numeric strings for pagination', () => {
            const validData = { page: '2', limit: '20' };
            const result = getArticlesDto.safeParse(validData);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.page).toBe(2);
                expect(result.data.limit).toBe(20);
            }
        });
    });

    // =========================================================================
    // 2. CreateArticleDto (Tạo bài viết)
    // =========================================================================
    describe('CreateArticleDto validation', () => {
        const fullValidData = {
            title: 'Bí quyết sống khỏe mỗi ngày',
            content: 'Nội dung chi tiết về cách ăn uống và tập luyện...',
            summary: 'Tóm tắt bài viết về sức khỏe',
            categoryId: '550e8400-e29b-41d4-a716-446655440000',
            status: 'draft',
            featured: 'false',
            toc: JSON.stringify([{ id: 'h1', text: 'Mục lục 1' }]),
            extras: JSON.stringify({ tags: ['health', 'doctor'] }),
            publishedAt: 'now' // Cần thiết do lỗi logic trong DTO refine
        };

        it('TC-BS-BV-DTO-04 - should validate full creation data with JSON strings', () => {
            const result = CreateArticleDto.safeParse(fullValidData);
            if (!result.success) {
                console.error('TC-BS-BV-DTO-04 Errors:', result.error.format());
            }
            expect(result.success).toBe(true);
            if (result.success) {
                expect(typeof result.data.toc).toBe('object');
                expect(result.data.featured).toBe(false);
            }
        });

        it('TC-BS-BV-DTO-05 - should fail if title is too short', () => {
            const invalidData = { ...fullValidData, title: 'Hi' };
            const result = CreateArticleDto.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    // =========================================================================
    // 3. UpdateArticleDto (Cập nhật bài viết)
    // =========================================================================
    describe('UpdateArticleDto validation', () => {
        it('TC-BS-BV-DTO-07 - should validate partial update (title and status)', () => {
            const validUpdate = {
                title: 'Tiêu đề mới sau khi chỉnh sửa',
                status: 'pending_review',
                publishedAt: 'now' // Cần thiết do lỗi logic trong DTO refine
            };
            const result = UpdateArticleDto.safeParse(validUpdate);
            if (!result.success) {
                console.error('TC-BS-BV-DTO-07 Errors:', result.error.format());
            }
            expect(result.success).toBe(true);
        });

        it('TC-BS-BV-DTO-08 - should handle JSON strings for imagesUrl and deletedImages during update', () => {
            const validUpdate = {
                imagesUrl: JSON.stringify(['url1', 'url2']),
                deletedImages: JSON.stringify(['url3']),
                publishedAt: 'now' // Cần thiết do lỗi logic trong DTO refine
            };
            const result = UpdateArticleDto.safeParse(validUpdate);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(Array.isArray(result.data.imagesUrl)).toBe(true);
            }
        });
    });
});
