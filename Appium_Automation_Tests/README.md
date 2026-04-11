# Appium Automation Web Testing - Hospital Management

Dự án này sử dụng **WebdriverIO** kết hợp với **Appium** để thực hiện kiểm thử tự động giao diện Web trên thiết bị di động (Android Emulator).

## 1. Yêu cầu hệ thống & Cài đặt (Prerequisites)

Trước khi chạy test, bạn cần đảm bảo máy tính đã cài đặt các thành phần sau:

### 1.1. Node.js & NPM
*   Yêu cầu phiên bản Node.js 18 trở lên (Khuyến nghị bản v20 hoặc v24).
*   Kiểm tra: `node -v`

### 1.2. Android SDK & Emulator
*   Cài đặt **Android Studio**.
*   Thiết lập biến môi trường `ANDROID_HOME` trỏ đến thư mục SDK (ví dụ: `C:\Users\ADMIN\AppData\Local\Android\Sdk`).
*   Tạo và khởi động một **Android Emulator** (Pixel 4, API 30+ có sẵn Google Play/Chrome).

### 1.3. Appium & Drivers
*   Cài đặt Appium Server: `npm install -g appium`
*   Cài đặt Driver Android: `appium driver install uiautomator2`

## 2. Thiết lập dự án (Setup)

1.  Di chuyển vào thư mục dự án:
    ```bash
    cd Appium_Automation_Tests
    ```
2.  Cài đặt các thư viện phụ thuộc:
    ```bash
    npm install
    ```

## 3. Cấu trúc thư mục (Project Structure)

```text
Appium_Automation_Tests/
├── test/
│   ├── pageobjects/     # Định nghĩa các thành phần trang (Selectors & Actions)
│   │   └── login.page.ts
│   └── specs/           # Các file kịch bản kiểm thử (Test Cases)
│       └── login.test.ts
├── wdio.conf.ts         # File cấu hình chính của WebdriverIO & Appium
├── tsconfig.json        # Cấu hình TypeScript cho dự án
└── package.json         # Danh sách thư viện và các script thực thi
```

### Chi tiết các thư mục:
*   **`test/pageobjects/`**: Chứa các lớp (Class) đại diện cho các trang trong ứng dụng. Mỗi file ở đây sẽ định nghĩa các selector (ô nhập liệu, nút bấm) và các phương thức hành động (ví dụ: hàm `login()`).
*   **`test/specs/`**: Chứa các file kịch bản kiểm thử thực tế. Đây là nơi bạn sử dụng các Page Object để viết các câu lệnh `it(...)` và kiểm tra kết quả (expect).
*   **`wdio.conf.ts`**: Nơi cấu hình thiết bị (capabilities), địa chỉ Appium server, thời gian timeout và các dịch vụ đi kèm.

## 4. Cách chạy Test

1.  Khởi động **Android Emulator**.
2.  Đảm bảo ứng dụng Frontend của bạn đang chạy (ví dụ: `npm run dev -- --host`).
3.  Chạy lệnh test:
    ```bash
    npx wdio run wdio.conf.ts
    ```

## 5. Lưu ý quan trọng
*   **Vite Host**: Luôn chạy Frontend với cờ `--host` để máy ảo có thể truy cập được qua địa chỉ `10.0.2.2`.
*   **Selectors**: Dự án sử dụng Page Object Model để dễ bảo trì. Nếu giao diện thay đổi, hãy cập nhật selector trong thư mục `pageobjects`.
