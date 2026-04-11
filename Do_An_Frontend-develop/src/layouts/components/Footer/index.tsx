import ICFacebook from '@components/Icon/ICFacebook';
import ICFavicon from '@components/Icon/ICFavicon';
import ICYoutube from '@components/Icon/ICYoutube';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ICFavicon />
              <span className="font-bold text-xl">Bệnh viện Bắc Hưng</span>
            </div>
            <address className="not-italic text-gray-600">
              <p className="mb-1">
                Địa chỉ: 123A Đường Sức Khỏe, Quận Y Tế, TP. Bắc Hưng
              </p>
              <p className="mb-1">Hotline: 1900-1234</p>
              <p>Email: info@benhvienbachung.vn</p>
            </address>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2 text-gray-600">
              <li>
                <Link to="/about" className="hover:text-blue-600">
                  Về chúng tôi
                </Link>
              </li>
              <li>
                <Link to="/specialties" className="hover:text-blue-600">
                  Đội ngũ bác sĩ
                </Link>
              </li>
              <li>
                <Link to="/specialties" className="hover:text-blue-600">
                  Dịch vụ
                </Link>
              </li>
              <li>
                <Link to="/articles" className="hover:text-blue-600">
                  Tin tức
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Theo dõi chúng tôi</h3>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/HMUHospital"
                target="_blank"
                className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700"
              >
                <ICFacebook />
              </a>
              <a
                href="https://www.youtube.com/@benhvienaihocyhanoi-hmuhos8656"
                target="_blank"
                className="bg-red-600 text-white p-2 rounded-full hover:bg-red-700"
              >
                <ICYoutube />
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 py-4">
        <div className="container mx-auto px-8 text-center text-gray-600 text-sm">
          © 2025 Bệnh viện Bắc Hưng. Bản quyền đã được bảo hộ.
        </div>
      </div>
    </footer>
  );
};
export default Footer;
