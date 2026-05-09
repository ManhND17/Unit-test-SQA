import { 
    getArticlesDto, 
    CreateArticleDto, 
    UpdateArticleDto
} from '@src/dtos/article.dto';

describe('Unit Test Article DTO - Sắp xếp tăng dần (TC_BS_BV_DTO_01 -> 08)', () => {
    const validUuid = '550e8400-e29b-41d4-a716-446655440000';

    it('TC_BS_BV_DTO_01 - getArticlesDto: Hợp lệ khi truyền đầy đủ các bộ lọc', () => {
        const input = { 
            page: '1', limit: '15', status: 'pending_review', 
            categoryId: validUuid, search: 'hướng dẫn khám' 
        };
        expect(getArticlesDto.safeParse(input).success).toBe(true);
    });

    it('TC_BS_BV_DTO_02 - getArticlesDto: Thất bại khi truyền trạng thái không hợp lệ', () => {
        expect(getArticlesDto.safeParse({ status: 'invalid_xyz' }).success).toBe(false);
    });

    it('TC_BS_BV_DTO_03 - getArticlesDto: Tự động chuyển đổi kiểu số cho phân trang', () => {
        const res = getArticlesDto.parse({ page: '2', limit: '20' });
        expect(res.page).toBe(2);
        expect(res.limit).toBe(20);
    });

    it('TC_BS_BV_DTO_04 - CreateArticleDto: Hợp lệ khi truyền đầy đủ dữ liệu với chuỗi JSON', () => {
        const input = { 
            title: 'Sống khỏe', content: 'Nội dung chi tiết y khoa', categoryId: validUuid,
            extras: '{"tags":["A"]}', toc: '[]', publishedAt: 'now'
        };
        expect(CreateArticleDto.safeParse(input).success).toBe(true);
    });

    it('TC_BS_BV_DTO_05 - CreateArticleDto: Thất bại khi tiêu đề quá ngắn (dưới 3 ký tự)', () => {
        expect(CreateArticleDto.safeParse({ title: 'Hi', publishedAt: 'now' }).success).toBe(false);
    });

    it('TC_BS_BV_DTO_06 - CreateArticleDto: Thất bại khi categoryId không đúng định dạng UUID', () => {
        expect(CreateArticleDto.safeParse({ categoryId: 'not-uuid', publishedAt: 'now' }).success).toBe(false);
    });

    it('TC_BS_BV_DTO_07 - UpdateArticleDto: Hợp lệ khi cập nhật từng phần', () => {
        const input = { title: 'Update', status: 'pending_review', publishedAt: 'now' };
        expect(UpdateArticleDto.safeParse(input).success).toBe(true);
    });

    it('TC_BS_BV_DTO_08 - UpdateArticleDto: Xử lý đúng chuỗi JSON cho imagesUrl và deletedImages', () => {
        const input = { 
            imagesUrl: '["u1.jpg"]', deletedImages: '["o.png"]', publishedAt: 'now'
        };
        const res = UpdateArticleDto.parse(input);
        expect(Array.isArray(res.imagesUrl)).toBe(true);
        expect(Array.isArray(res.deletedImages)).toBe(true);
    });
});
