import FeedbackForm from '../components/FeedbackForm';
import AppointmentBooking from '../components/AppointmentBooking';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import ApiDoctor from '@api/ApiDoctor';
import QUERY_KEY from '@api/QueryKey';
import ApiMedicalService from '@api/ApiMedicalService';
import ApiArticle from '@api/ApiArticle';
import Slider from '@components/Slider';
import SkeletonCommonCard from '@components/SkeletonCommonCard';
import CommonCard from '@components/CommonCard';
import { Skeleton } from '@mui/material';
import { ArticleCard } from '@components/ArticleCard';
import { SkeletonArticleCard } from '@components/SkeletonArticleCard';
import ModalDetailDoctor from '@components/ModalDetailDoctor';
import ModalDetailMedicalService from '@components/ModalDetailMedicalService';
import { useState } from 'react';

export default function PatientHome() {
  const navigate = useNavigate();
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [selectedService, setSelectedService] = useState<any>(null);

  const {
    data: doctors,
    isLoading: isLoadingDoctors,
    isError: isErrorDoctors,
  } = useQuery({
    queryKey: [QUERY_KEY.DOCTOR.GET_LIST_DOCTOR],
    queryFn: () => ApiDoctor.getDoctors({}),
    staleTime: Infinity,
  });

  const {
    data: medicalServices,
    isLoading: isLoadingMedicalServices,
    isError: isErrorMedicalServices,
  } = useQuery({
    queryKey: [QUERY_KEY.MEDICAL_SERVICE.GET_LIST_MEDICAL_SERVICE],
    queryFn: () =>
      ApiMedicalService.getMedicalServices({
        isActive: 1,
      }),
    staleTime: Infinity,
  });

  const {
    data: articles,
    isLoading: isLoadingArticles,
    isError: isErrorArticles,
  } = useQuery({
    queryKey: [QUERY_KEY.ARTICLE.GET_FEATURED_ARTICLES],
    queryFn: () => ApiArticle.getFeaturedArticles(),
    staleTime: Infinity,
  });

  return (
    <div className="px-8 py-6">
      <section className="mb-12">
        <div className="relative rounded-xl overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2370&q=80"
            alt="Bệnh viện Bắc Hưng"
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 to-transparent flex flex-col justify-center p-6 md:p-12">
            <h1 className="text-2xl md:text-4xl font-bold text-white mb-4">
              Chào mừng bạn đến với Bệnh viện Bắc Hưng
            </h1>
            <p className="text-white text-lg max-w-xl mb-6">
              Với sứ mệnh chăm sóc sức khỏe toàn diện, chúng tôi cam kết mang
              đến dịch vụ y tế chất lượng cao, đội ngũ y bác sĩ giàu kinh nghiệm
              cùng cơ sở vật chất hiện đại.
            </p>
            <button
              onClick={() => navigate('/about')}
              className="flex items-center bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors w-fit"
            >
              Tìm hiểu thêm <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </section>
      <section className="mb-12">
        {isLoadingDoctors || isErrorDoctors ? (
          <>
            <Skeleton variant="text" width={120} height={32} />
            <Slider slidesPerView={5}>
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonCommonCard key={index} />
              ))}
            </Slider>
          </>
        ) : (
          <>
            <div className="text-2xl font-bold text-black mb-4 pb-2 border-b border-gray-200">
              Đội ngũ bác sĩ nổi bật
            </div>

            <Slider slidesPerView={5}>
              {doctors?.data.map((doctor) => (
                <CommonCard
                  key={doctor.user?.id}
                  image={doctor.user?.avatar || ''}
                  title={`${doctor.level || ''} ${doctor.user?.name?.firstName || ''} ${doctor.user?.name?.lastName || ''}`}
                  description={`Khoa: ${doctor.staff?.department?.name || 'Chưa có thông tin'}`}
                  onClick={() => setSelectedDoctor(doctor)}
                  children={
                    <p className="text-blue-600 font-medium hover:underline">
                      Xem chi tiết
                    </p>
                  }
                />
              ))}
            </Slider>
          </>
        )}
      </section>
      <section className="mb-12">
        {isLoadingMedicalServices || isErrorMedicalServices ? (
          <>
            <Skeleton variant="text" width={120} height={32} />
            <Slider slidesPerView={4}>
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonCommonCard image={false} key={index} />
              ))}
            </Slider>
          </>
        ) : (
          <>
            <div className="text-2xl font-bold text-black mb-4 pb-2 border-b border-gray-200">
              Dịch vụ bệnh viện
            </div>

            <Slider slidesPerView={4}>
              {medicalServices?.data.map((service) => (
                <CommonCard
                  key={service.id}
                  title={service.name || 'Dịch vụ y tế'}
                  image={service.images[0] || ''}
                  description={service.description || 'Chưa có mô tả'}
                  onClick={() => setSelectedService(service)}
                  children={
                    <p className="text-blue-600 font-medium hover:underline">
                      Xem chi tiết
                    </p>
                  }
                />
              ))}
            </Slider>
          </>
        )}
      </section>
      <section className="mb-12">
        {isLoadingArticles || isErrorArticles ? (
          <>
            <Skeleton variant="text" width={120} height={32} />
            <Slider slidesPerView={4}>
              {Array.from({ length: 5 }).map((_, index) => (
                <SkeletonArticleCard key={index} />
              ))}
            </Slider>
          </>
        ) : (
          <>
            <div className="text-2xl font-bold text-black mb-4 pb-2 border-b border-gray-200">
              Bài viết nổi bật
            </div>

            <Slider slidesPerView={4}>
              {articles?.data.map((article) => (
                <ArticleCard
                  key={article.id}
                  image={article.imageUrl || ''}
                  category={article.category?.name || 'Bài viết'}
                  title={article.title || 'Chưa có tiêu đề'}
                  description={article.summary || ''}
                  date={article.publishedAt}
                  onClick={() => {
                    if (article.slug) {
                      navigate(`/articles/${article.slug}`);
                    }
                  }}
                />
              ))}
            </Slider>
          </>
        )}
      </section>
      <AppointmentBooking />
      <section>
        <div className="text-2xl font-bold text-black mb-4 pb-2 text-center">
          Hãy góp ý để chúng tôi phục vụ tốt hơn
        </div>
        <FeedbackForm />
      </section>

      {/* Modals */}
      <ModalDetailDoctor
        open={selectedDoctor !== null}
        onClose={() => setSelectedDoctor(null)}
        doctor={selectedDoctor}
      />
      <ModalDetailMedicalService
        open={selectedService !== null}
        onClose={() => setSelectedService(null)}
        service={selectedService}
      />
    </div>
  );
}
