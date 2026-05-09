| TestCaseID | Lớp | Phương thức | Test Objective | Input Data (Chi tiết) | Expected output | Kết quả | Ghi chú |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_BS_BV_DTO_01** | getArticlesDto | safeParse() | Hợp lệ bộ lọc bác sĩ | { page: '1', limit: '15', status: 'pending_review', categoryId: 'UUID', search: 'hướng dẫn' } | result.success: true | **Pass** | |
| **TC_BS_BV_DTO_02** | getArticlesDto | safeParse() | Trạng thái không hợp lệ | { status: 'invalid_status_xyz' } | result.success: false | **Pass** | |
| **TC_BS_BV_DTO_03** | getArticlesDto | safeParse() | Chuyển đổi kiểu số | { page: '2', limit: '20' } | result.data.page: 2 | **Pass** | |
| **TC_BS_BV_DTO_04** | CreateArticleDto | safeParse() | Hợp lệ dữ liệu tạo | { title: 'Sống khỏe', extras: '{"tags":["A"]}', toc: '[]' } | result.success: true | **Pass** | |
| **TC_BS_BV_DTO_05** | CreateArticleDto | safeParse() | Tiêu đề quá ngắn | { title: 'Hi', content: '...' } | result.success: false | **Pass** | |
| **TC_BS_BV_DTO_06** | CreateArticleDto | safeParse() | CategoryId sai UUID | { categoryId: 'not-a-uuid' } | result.success: false | **Pass** | |
| **TC_BS_BV_DTO_07** | UpdateArticleDto | safeParse() | Hợp lệ cập nhật từng phần | { title: 'New Title', status: 'pending_review' } | result.success: true | **Pass** | |
| **TC_BS_BV_DTO_08** | UpdateArticleDto | safeParse() | Xử lý JSON ảnh | { imagesUrl: '["u1.jpg"]', deletedImages: '["o.png"]' } | Array.isArray(data.imagesUrl): true | **Pass** | |
| **TC_BS_BV_001** | ArticleService | createNewArticle | Chặn Bệnh nhân tạo bài | Data: { title: 'T' }, UserId: patient_id, Role: 'patient' | Throw 403 (FORBIDDEN) | **Pass** | |
| **TC_BS_BV_002** | ArticleService | createNewArticle | Chặn Bác sĩ đăng trực tiếp | Data: { title: 'T', status: 'published' }, UserId: doctor_id | Throw 403 (FORBIDDEN) | **Pass** | |
| **TC_BS_BV_003** | ArticleService | updateExistingArticle | Chặn sửa bài người khác | ArtId: of_doctor_B, UserId: doctor_A, Role: 'doctor' | Throw 403 (FORBIDDEN) | **Pass** | |
| **TC_BS_BV_004** | ArticleService | deleteExistingArticle | Chặn xóa bài người khác | ArtId: of_doctor_B, UserId: doctor_A, Role: 'doctor' | Throw 403 (FORBIDDEN) | **Pass** | |
| **TC_BS_BV_005** | ArticleService | createNewArticle | Bác sĩ tạo nháp thành công | Data: { title: 'Draft Art', status: 'draft' }, UserId: doctor_id | result.status: 'draft' | **Pass** | |
| **TC_BS_BV_006** | ArticleService | updateExistingArticle | Bác sĩ cập nhật bài mình | ArtId: my_art_id, Data: { title: 'New Title' } | result.title: 'New Title' | **Pass** | |
| **TC_BS_BV_007** | ArticleService | createNewArticle | Tự động sinh Slug khi trùng | DB exists slug 'x', Input Title: 'X' | result.slug: 'x-1' | **Pass** | |
| **TC_BS_BV_008** | ArticleService | sendArticleForReview | Gửi bài kiểm duyệt | ArticleId: draft_id, UserId: doctor_id | result.status: 'pending_review' | **Pass** | |
| **TC_BS_BV_009** | ArticleService | createNewArticle | Kiểm tra cấu trúc JSON | Data: { extras: { key: 'val' }, toc: [{ t: 'H1' }] } | result.extras.key: 'val' | **Pass** | |
| **TC_BS_BV_010** | ArticleService | sendArticleForReview | Thất bại khi bài đã đăng | ArticleId: published_id, UserId: doctor_id | Throw 400 (BAD_REQUEST) | **Pass** | |
| **TC_BS_BV_011** | ArticleService | createNewArticle | Báo lỗi tiêu đề ngắn | Data: { title: 'A', content: 'C'.repeat(11) }, UserId: doctor_id | Throw Validation Error | **Fail** | Thiếu logic chặn ở Service |
| **TC_BS_BV_012** | ArticleService | createNewArticle | Báo lỗi định dạng UUID sai | Data: { categoryId: 'bad-uuid' }, UserId: doctor_id | Throw DB Error | **Pass** | |
| **TC_BS_BV_013** | ArticleService | createNewArticle | Báo lỗi trạng thái sai | Data: { status: 'wrong_enum' }, UserId: doctor_id | Throw Enum Error | **Pass** | |
| **TC_BS_BV_014** | ArticleService | getArticles | Tìm bài viết theo từ khóa | Query: { search: 'Covid-Key-123' } | res.data[0].title contains 'Covid-Key-123' | **Pass** | |
| **TC_BS_BV_015** | ArticleService | getArticles | Lọc bài theo chuyên mục | Query: { categoryId: [Category_ID] } | All articles match categoryId | **Pass** | |
| **TC_BS_BV_017** | ArticleService | getArticles | Chuyển kiểu phân trang | Query: { page: '1', limit: '5' } | result.metadata.limit: 5 (number) | **Pass** | |
| **TC_BS_BV_018** | ArticleService | updateExistingArticle | Cập nhật: Chỉ tiêu đề | Data: { title: 'Updated' }, UserId: doctor_id | result.title: 'Updated' | **Pass** | |
| **TC_BS_BV_019** | ArticleService | updateExistingArticle | Cập nhật: Chỉ nội dung | Data: { content: 'New Content' }, UserId: doctor_id | result.content: 'New Content' | **Pass** | |
| **TC_BS_BV_020** | ArticleService | updateExistingArticle | Cập nhật: Chỉ chuyên mục | Data: { categoryId: [New_Cat_ID] }, UserId: doctor_id | result.categoryId: [New_Cat_ID] | **Pass** | |
| **TC_BS_BV_021** | ArticleService | updateExistingArticle | Cập nhật danh sách ảnh | Data: { imagesUrl: ['n.jpg'] }, UserId: doctor_id | result.images contains 'n.jpg' | **Pass** | |
| **TC_BS_BV_022** | ArticleService | updateExistingArticle | Chuyển Rejected về Draft | Status: 'rejected' -> 'draft', UserId: doctor_id | result.status: 'draft' | **Pass** | |
| **TC_BS_BV_023** | ArticleService | createNewArticle | Tạo bài với ảnh <= 5MB | Files: { thumbnail: [{ size: 1MB }] }, UserId: doctor_id | result.imageUrl is defined | **Pass** | |
| **TC_BS_BV_024** | ArticleService | createNewArticle | Báo lỗi khi ảnh > 5MB | Files: { thumbnail: [{ size: 6MB }] }, UserId: doctor_id | Throw Size Limit Error | **Fail** | BE cho phép đến 10MB |
| **TC_BS_BV_025** | ArticleService | getLatestArticlesByAllCategories | Lấy bài mới nhất | Query: { page: '1', limit: '5' } | result.data.length > 0 | **Pass** | |
| **TC_BS_BV_026** | ArticleService | getMostViewedArticlesByAllCategories | Lấy bài xem nhiều nhất | Query: { page: '1', limit: '5' } | result.data.length > 0 | **Pass** | |
| **TC_BS_BV_027** | ArticleService | getRelatedArticles | Lấy bài viết liên quan | Query: { articleId: [Valid_ID] } | result is defined | **Pass** | |
| **TC_BS_BV_028** | ArticleService | incrementViewCount | Tăng lượt xem tự động | ArticleId: [Valid_ID], Current: 0 | DB updated viewCount: 1 | **Pass** | |
| **TC_BS_BV_029** | ArticleService | getFeaturedArticles | Lấy bài nổi bật | Query: { page: '1' } | result.data.length > 0 | **Fail** | DB rỗng |
| **TC_BS_BV_030** | ArticleService | getArticlesByCategory | Lấy bài theo danh mục | CategoryId: [ID], Query: { page: '1' } | result.data is defined | **Fail** | DB rỗng |
| **TC_BS_BV_031** | ArticleService | getArticleById | Lỗi khi ID không tồn tại | Id: 'non-existent-uuid' | Throw 'Article not found!' | **Pass** | |
| **TC_BS_BV_032** | ArticleService | getFeaturedArticles | Lỗi khi danh sách rỗng | Mock DAO return: { data: [] } | Throw 'No featured articles found' | **Pass** | |
| **TC_BS_BV_033** | ArticleService | getLatestArticlesByAllCategories | Lỗi khi danh sách rỗng | Mock DAO return: { data: [] } | Throw 'No latest articles found' | **Pass** | |
| **TC_BS_BV_034** | ArticleService | getMostViewedArticlesByAllCategories | Lỗi khi danh sách rỗng | Mock DAO return: { data: [] } | Throw 'No most viewed articles' | **Pass** | |
| **TC_BS_BV_035** | ArticleService | createNewArticle | Lỗi CategoryID không tồn tại | Data: { categoryId: 'bad-id' } | Throw 'Category not found' | **Pass** | |
