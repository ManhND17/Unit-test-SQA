import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import FeedbackForm from '../components/FeedbackForm';
import LocationMap from '../components/LocationMap';

export default function PatientContact() {
  return (
    <div>
      <section className="relative min-h-[400px] mx-auto flex items-center bg-gray-100">
        <div className="container px-3">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Liên hệ – Hỗ trợ
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Chúng tôi luôn sẵn sàng hỗ trợ bạn mọi lúc mọi nơi
            </p>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Thông tin liên hệ</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mt-1">
                    <MapPin width={24} height={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Địa chỉ</h3>
                    <p className="text-gray-600">
                      1 Tôn Thất Tùng, Đống Đa, Hà Nội
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Phone width={24} height={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Hotline</h3>
                    <p className="text-gray-600">
                      <a href="tel:19001234" className="hover:text-primary">
                        1900 1234
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail width={24} height={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">
                      <a
                        href="mailto:info@bvdhy.edu.vn"
                        className="hover:text-primary"
                      >
                        info@bvdhy.edu.vn
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock width={24} height={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">Giờ làm việc</h3>
                    <p className="text-gray-600">
                      Thứ 2 - Thứ 6: 7:30 - 17:00
                      <br />
                      Thứ 7: 7:30 - 12:00
                      <br />
                      Cấp cứu 24/7
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Hướng dẫn đường đi</h3>
                <p className="text-gray-600 text-sm">
                  Từ trung tâm Hà Nội, đi theo đường Giải Phóng, rẽ phải vào Tôn
                  Thất Tùng. Bãi đỗ xe miễn phí có sẵn.
                </p>
              </div>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Gửi tin nhắn cho chúng tôi
              </h2>
              <FeedbackForm />
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 container mx-auto px-4">
        <LocationMap />
      </section>
    </div>
  );
}
