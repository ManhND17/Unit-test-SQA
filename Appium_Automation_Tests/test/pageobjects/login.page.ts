import { $ } from '@wdio/globals'

/**
 * Page object cho trang Login
 */
class LoginPage {
    /**
     * Định nghĩa các selectors
     */
    public get inputEmail () {
        return $('input[type="email"]');
    }

    public get inputPassword () {
        return $('input[type="password"]');
    }

    public get btnSubmit () {
        // Tìm button có class MuiButton-contained hoặc dựa trên text
        return $('button=Đăng nhập');
    }

    /**
     * Các phương thức hành động
     */
    public async login (email: string, password: string) {
        await this.inputEmail.setValue(email);
        await this.inputPassword.setValue(password);
        await this.btnSubmit.click();
    }

    public async open () {
        return browser.url('/auth/login');
    }
}

export default new LoginPage();
