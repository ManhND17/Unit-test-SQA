const AboutIntro = () => {
  return (
    <section className="mb-12">
      <h1 className="text-3xl font-bold mb-8">
        Về Bệnh viện Bắc Hưng: Sứ mệnh và Tầm nhìn
      </h1>
      <div className="mb-8">
        <img
          src="https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80"
          alt="Toàn cảnh Bệnh viện Bắc Hưng"
          className="w-full h-[400px] object-cover rounded-xl mb-6"
        />
      </div>
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Sứ mệnh của chúng tôi</h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Bệnh viện Bắc Hưng ra đời với sứ mệnh mang đến dịch vụ chăm sóc sức
          khỏe toàn diện và chất lượng cao cho cộng đồng. Chúng tôi cam kết đặt
          người bệnh làm trung tâm, lấy chất lượng điều trị và sự an toàn của
          người bệnh làm ưu tiên hàng đầu.
        </p>
        <p className="text-gray-700 leading-relaxed">
          Với phương châm "Tận tâm - Chuyên nghiệp - Hiệu quả", đội ngũ y bác sĩ
          của chúng tôi không ngừng nâng cao trình độ chuyên môn, cập nhật các
          phương pháp điều trị tiên tiến nhất để đáp ứng nhu cầu khám chữa bệnh
          ngày càng cao của người dân.
        </p>
      </div>
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">
          Lịch sử hình thành và phát triển
        </h2>
        <p className="text-gray-700 leading-relaxed mb-4">
          Thành lập vào năm 1995, Bệnh viện Bắc Hưng khởi đầu là một phòng khám
          nhỏ với 20 giường bệnh và 15 nhân viên y tế. Trải qua hơn 25 năm phát
          triển, đến nay bệnh viện đã trở thành một trong những cơ sở y tế hàng
          đầu trong khu vực với quy mô 500 giường bệnh và đội ngũ hơn 1000 cán
          bộ, nhân viên y tế có trình độ cao.
        </p>
        <p className="text-gray-700 leading-relaxed">Các cột mốc quan trọng:</p>
        <ul className="list-disc pl-6 text-gray-700 space-y-2 mt-2">
          <li>1995: Thành lập phòng khám ban đầu</li>
          <li>2000: Mở rộng quy mô lên 100 giường bệnh</li>
          <li>2005: Đưa vào sử dụng khu điều trị nội trú hiện đại</li>
          <li>2010: Trở thành bệnh viện hạng I</li>
          <li>2015: Hợp tác quốc tế với các đối tác y tế hàng đầu thế giới</li>
          <li>
            2020: Khánh thành trung tâm nghiên cứu và ứng dụng công nghệ y tế
            cao
          </li>
        </ul>
      </div>
    </section>
  );
};
export default AboutIntro;
