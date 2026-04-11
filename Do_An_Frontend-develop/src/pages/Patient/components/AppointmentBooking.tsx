import { useNavigate } from 'react-router-dom';

const AppointmentBooking = () => {
  const navigate = useNavigate();

  return (
    <section className="mb-12 bg-blue-50 rounded-xl p-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Đặt lịch hẹn nhanh</h2>
        <p className="text-gray-600">
          Chủ động sắp xếp thời gian khám bệnh một cách dễ dàng.
        </p>
      </div>
      <div className="text-center">
        <button
          className="bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          onClick={() => {
            navigate('/patient/create-appointment');
          }}
        >
          ĐẶT LỊCH KHÁM
        </button>
      </div>
    </section>
  );
};

export default AppointmentBooking;
