const facilities = [
  {
    id: 1,
    name: 'Phòng mổ vô trùng',
    image:
      'https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
    description:
      'Hệ thống phòng mổ hiện đại đạt tiêu chuẩn quốc tế với thiết bị vô trùng cao cấp',
  },
  {
    id: 2,
    name: 'Máy MRI 1.5 Tesla',
    image:
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
    description:
      'Hệ thống chụp cộng hưởng từ tiên tiến cho hình ảnh chẩn đoán chính xác',
  },
  {
    id: 3,
    name: 'Phòng bệnh tiện nghi',
    image:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80',
    description:
      'Phòng bệnh thiết kế hiện đại, thoáng mát với đầy đủ tiện nghi cho người bệnh',
  },
];
const FacilitiesShowcase = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">
        Cơ sở vật chất & Trang thiết bị hiện đại
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <div
            key={facility.id}
            className="bg-white rounded-xl shadow-md overflow-hidden"
          >
            <img
              src={facility.image}
              alt={facility.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{facility.name}</h3>
              <p className="text-gray-600 text-sm">{facility.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-3">
          Cam kết về trang thiết bị y tế
        </h3>
        <p className="text-gray-700">
          Bệnh viện Bắc Hưng không ngừng đầu tư vào các trang thiết bị y tế hiện
          đại nhất, đáp ứng mọi nhu cầu khám chữa bệnh từ cơ bản đến chuyên sâu.
          Tất cả thiết bị đều được nhập khẩu từ các nhà sản xuất uy tín trên thế
          giới và được bảo dưỡng định kỳ theo tiêu chuẩn quốc tế.
        </p>
      </div>
    </section>
  );
};
export default FacilitiesShowcase;
