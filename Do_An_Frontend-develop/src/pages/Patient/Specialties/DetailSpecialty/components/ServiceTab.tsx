import { IDepartment } from 'src/types/index';
import { useNavigate } from 'react-router-dom';
interface IServiceTabProps {
  specialty: IDepartment;
}

const ServiceTab = ({ specialty }: IServiceTabProps) => {
  const navigate = useNavigate();
  const head = specialty.head;
  const staffs = specialty.staff;
  const handleRegisterAppointment = (service: IMedicalService) => {
    navigate(
      `/patient/create-appointment?medicalServiceId=${service.id}&departmentId=${service.departmentId || ''}`
    );
  };
  return (
    <div className="space-y-10">
      {/* TIÊU ĐỀ */}
      <h3 className="text-2xl font-bold text-gray-800">
        Các dịch vụ khám chữa bệnh tại khoa{' '}
        <span className="text-blue-600">{specialty.name}</span>
      </h3>

      {/* CARD DỊCH VỤ */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Danh sách dịch vụ
        </h4>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">
                  STT
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">
                  Dịch vụ
                </th>
                <th className="px-4 py-2 border-b w-32">
                  <span className="sr-only">Hành động</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {specialty.medicalServices
                ?.filter((s) => s.isActive)
                .map((service, index) => (
                  <tr key={service.id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 border-b w-16 text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 border-b text-gray-800">
                      {service.name}
                    </td>
                    <td className="px-4 py-2 border-b text-center">
                      <button
                        onClick={() => {
                          handleRegisterAppointment(service);
                        }}
                        className="px-3 py-1.5 text-sm font-medium
                         bg-blue-600 text-white rounded-md
                         hover:bg-blue-700 transition"
                      >
                        Đặt lịch
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* HÌNH ẢNH */}
      <div>
        <img
          src={specialty.thumbnail || ''}
          alt={`Trang thiết bị ${specialty.name}`}
          className="w-full h-72 object-contain rounded-xl shadow-md"
        />
      </div>

      {/* THÔNG TIN KHÁC */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 space-y-3">
        <p className="text-gray-700">
          <span className="font-semibold">Mô tả:</span> {specialty.description}
        </p>
        <p className="text-gray-700">
          <span className="font-semibold">Số điện thoại:</span>{' '}
          {specialty.phone}
        </p>
      </div>

      {/* LÃNH ĐẠO KHOA */}
      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">
          Lãnh đạo khoa
        </h4>

        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
            <thead className="bg-blue-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">
                  STT
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">
                  Họ tên
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">
                  Chức vụ
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">
                  Liên hệ
                </th>
              </tr>
            </thead>

            <tbody>
              {head && (
                <tr className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border-b w-16 text-gray-700">1</td>
                  <td className="px-4 py-2 border-b text-gray-800">
                    {head.user?.name?.firstName} {head.user?.name?.lastName}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-700">
                    Trưởng khoa
                  </td>
                  <td className="px-4 py-2 border-b text-blue-600">
                    {head.user?.email}
                  </td>
                </tr>
              )}

              {staffs?.map((staff, index) => (
                <tr key={staff.userId} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 border-b text-gray-700">
                    {index + 2}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-800">
                    {staff.user?.name?.firstName} {staff.user?.name?.lastName}
                  </td>
                  <td className="px-4 py-2 border-b text-gray-700">Phó khoa</td>
                  <td className="px-4 py-2 border-b text-blue-600">
                    {staff.user?.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default ServiceTab;
