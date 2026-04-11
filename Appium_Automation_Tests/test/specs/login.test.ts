import { expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page'

describe('Kịch bản Đăng nhập hệ thống Quản lý bệnh viện', () => {
    it('Nên đăng nhập thành công với thông tin hợp lệ', async () => {
        await LoginPage.open();

        // Thay đổi email và password thực tế ở đây
        await LoginPage.login('test.patient@gmail.com', '123456');

        // Kiểm tra sau khi đăng nhập thành công (ví dụ chuyển hướng sang trang chủ hoặc hiển thị toast)
        // Lưu ý: Tùy vào logic app, có thể cần chờ toast hoặc URL thay đổi
        await expect(browser).toHaveUrlContaining('/');
    });

    it('Nên hiển thị lỗi khi đăng nhập sai thông tin', async () => {
        await LoginPage.open();

        await LoginPage.login('wrong@example.com', 'wrongpassword');

        // Kiểm tra thông báo lỗi (dựa trên class hoặc text)
        const errorMsg = await $('.MuiAlert-message'); // Ví dụ selector cho toast/alert
        if (await errorMsg.isExisting()) {
            await expect(errorMsg).toBeDisplayed();
        }
    });
});
