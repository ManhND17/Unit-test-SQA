import { useState } from 'react';
import { IDoctorService } from '@src/types';
import ApiMedicalService from '@src/api/ApiMedicalService';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';

export default function MedicalServiceDetail() {
  const [activeImage, setActiveImage] = useState<number>(0);
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state;

  const MedicalService = useQuery({
    queryKey: ['medical-services'],
    queryFn: () => {
      return ApiMedicalService.getMedicalServiceById(id || '');
    },
  });
  const service = MedicalService.data;
  if (MedicalService.isLoading)
    return <div className="p-6 text-red-500">Đang tải dịch vụ</div>;
  if (!service)
    return <div className="p-6 text-red-500">Không tìm thấy dịch vụ</div>;

  const imgs = service.images ?? [];
  const doctors = (service.doctorServices ?? []).map((ds) => {
    return { ...ds };
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mb-10">
        <ArrowLeft className="inline-block w-5 h-5 text-gray-600 cursor-pointer hover:text-gray-800" />
        <span
          onClick={() => navigate('/admin/medical-services')}
          className="ml-2 text-gray-700 cursor-pointer hover:underline"
        >
          Quay lại
        </span>
      </div>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-sm bg-gray-100 flex items-center justify-center h-64">
                <img
                  src={imgs[activeImage] ?? ''}
                  alt={service.name}
                  className="max-w-full max-h-full object-contain"
                />
              </div>

              {imgs.length > 1 && (
                <div
                  className="mt-3 flex gap-2 overflow-x-auto items-center"
                  role="list"
                  aria-label="Ảnh dịch vụ"
                >
                  {/* giới hạn hiển thị ~6 thumbnail ở màn hình lớn */}
                  <div className="flex gap-2 md:max-w-[480px]">
                    {imgs.map((u, i) => (
                      <button
                        key={i}
                        onClick={() => setActiveImage(i)}
                        className={`flex-shrink-0 rounded-md overflow-hidden border-2 ${i === activeImage ? 'border-indigo-500' : 'border-transparent'}`}
                        aria-label={`Ảnh ${i + 1}`}
                      >
                        <img
                          src={u}
                          alt={`${service.name}-${i}`}
                          className="w-20 h-12 md:w-24 md:h-16 object-contain bg-white"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-800">
                  {service.name}
                </h1>
                <p className="text-sm text-gray-500 mt-2">
                  {service.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4">
                  <div className="text-2xl font-bold text-indigo-600">
                    {service.price.toLocaleString()} đ
                  </div>
                  <div className="text-sm text-gray-600">
                    {service.unit ?? '-'} • {service.durationMinutes ?? '-'}{' '}
                    phút
                  </div>
                  <div
                    className={`text-sm px-2 py-1 rounded-full ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                  >
                    {service.isActive ? 'Hoạt động' : 'Không hoạt động'}
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div>
                    <div className="text-xs text-gray-400">Khoa </div>
                    <div className="mt-1">{`Khoa ${service.department?.name}`}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Phòng</div>
                    <div className="mt-1">{service.room?.name ?? '-'}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Áp dụng BHYT</div>
                    <div className="mt-1">
                      {service.percentApplyHealthInsurance}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Tạo lúc</div>
                    <div className="mt-1">
                      {service.createdAt
                        ? new Date(service.createdAt).toLocaleString()
                        : '-'}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Cập nhật</div>
                    <div className="mt-1">
                      {service.updatedAt
                        ? new Date(service.updatedAt).toLocaleString()
                        : '-'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() =>
                    navigate(`/admin/medical-services/edit`, {
                      state: service.id,
                    })
                  }
                  className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => navigate('/admin/medical-services')}
                  className="inline-flex items-center gap-2 bg-white border px-3 py-2 rounded-md hover:bg-gray-50"
                >
                  Quay về
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Doctor pricing */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800">
            Cấu hình theo bác sĩ
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Thiết lập giá và thời lượng riêng cho từng bác sĩ (nếu có)
          </p>

          <div className="mt-4 space-y-3">
            {doctors.length ? (
              doctors.map((ds: IDoctorService) => (
                <div
                  key={ds.doctorId}
                  className="flex items-center justify-between p-3 rounded-md bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-medium">
                      {String(ds.doctor?.staff?.user?.name?.lastName)
                        .split(' ')
                        .slice(-1)[0]?.[0] ?? 'B'}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {ds.doctor?.staff?.user?.name?.firstName}{' '}
                        {ds.doctor?.staff?.user?.name?.lastName}
                      </div>
                      <div className="text-xs text-gray-500">
                        Giá: {Number(ds.price).toLocaleString()} đ •{' '}
                        {ds.durationMinutes} phút
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-1 rounded ${ds.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                    >
                      {ds.isActive ? 'Hoạt động' : 'Không'}
                    </span>
                    <button
                      onClick={() =>
                        navigate(`/admin/medical-services/edit`, { state: id })
                      }
                      className="text-indigo-600 text-sm hover:text-indigo-800"
                    >
                      Sửa
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-gray-500">
                Chưa có cấu hình theo bác sĩ
              </div>
            )}
          </div>
        </div>

        {/* Full description */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-800">Mô tả đầy đủ</h3>
          <p className="mt-3 text-gray-700 text-sm leading-relaxed">
            {service.description ?? '-'}
          </p>
        </div>
      </div>
    </div>
  );
}
