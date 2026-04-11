import { useMemo, useState, useCallback, useTransition } from 'react';
import DoctorFilters from '../../../components/DoctorFilters';
import Pagination from '../../../components/Pagination';
import { IDoctor } from 'src/types/index';
import { Grid } from '@mui/material';
import CommonCard from '@components/CommonCard';
import { useQuery } from '@tanstack/react-query';
import QUERY_KEY from '@src/api/QueryKey';
import ApiDoctor from '@src/api/ApiDoctor';
import SkeletonCommonCard from '@src/components/SkeletonCommonCard';
import ModalDetailDoctor from '@components/ModalDetailDoctor';

interface IDoctorsTabProps {
  departmentId: number;
}

interface IFilters {
  level: string;
  gender: string;
}

const DoctorsTab = ({ departmentId }: IDoctorsTabProps) => {
  const [, startTransition] = useTransition();
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const [filters, setFilters] = useState<IFilters>({
    level: 'all',
    gender: 'all',
  });

  const [currentPage, setCurrentPage] = useState(1);

  const doctorsPerPage = 6;

  const handleSetFilters = useCallback(
    (newFilters: React.SetStateAction<IFilters>) => {
      startTransition(() => {
        setFilters(newFilters);
        setCurrentPage(1);
      });
    },
    []
  );

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEY.DOCTOR.GET_LIST_DOCTOR, departmentId],
    queryFn: () => ApiDoctor.getDoctorsByDepartment(departmentId),
    enabled: !!departmentId,
  });

  const doctors: IDoctor[] = useMemo(() => {
    return (
      data?.data.map((doctor) => ({
        ...doctor,
      })) || []
    );
  }, [data?.data]);

  const filterPredicate = useCallback(
    (doctor: IDoctor) => {
      const levelMatch =
        filters.level === 'all' || doctor.level?.includes(filters.level);
      const genderMatch =
        filters.gender === 'all' ||
        doctor.staff?.user?.gender?.includes(filters.gender);
      return levelMatch && genderMatch;
    },
    [filters.level, filters.gender]
  );

  const filteredDoctors = useMemo(
    () => doctors.filter(filterPredicate),
    [doctors, filterPredicate]
  );

  const indexOfLastDoctor = currentPage * doctorsPerPage;
  const indexOfFirstDoctor = indexOfLastDoctor - doctorsPerPage;
  const currentDoctors = useMemo(
    () => filteredDoctors.slice(indexOfFirstDoctor, indexOfLastDoctor),
    [filteredDoctors, indexOfFirstDoctor, indexOfLastDoctor]
  );

  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);

  const handlePageChange = useCallback((page: number) => {
    startTransition(() => {
      setCurrentPage(page);
    });
  }, []);

  const getDoctorFullName = (doctor: IDoctor): string => {
    const firstName = doctor?.user?.name?.firstName || '';
    const lastName = doctor?.user?.name?.lastName || '';
    return `${firstName} ${lastName}`.trim();
  };

  return (
    <>
      <div>
        <h3 className="text-xl font-semibold mb-6">Đội ngũ bác sĩ</h3>

        <DoctorFilters filters={filters} setFilters={handleSetFilters as any} />

        <Grid container spacing={3}>
          {isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
                <SkeletonCommonCard />
              </Grid>
            ))}
          {!isLoading && currentDoctors.length === 0 && (
            <p>Không tìm thấy bác sĩ</p>
          )}
          {currentDoctors.map((doctor) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={doctor.userId}>
              <CommonCard
                image={doctor?.user?.avatar || ''}
                title={
                  <>
                    <span className="uppercase">BS.{doctor.level || ''}</span>
                    <span className="ml-2">{getDoctorFullName(doctor)}</span>
                  </>
                }
                description={''}
              >
                <>
                  <p className="text-sm text-gray-600">
                    Chuyên môn: {doctor.specialization}
                  </p>
                  <p className="text-sm text-gray-600">
                    Kinh nghiệm: {doctor.experienceYears} năm
                  </p>
                  <p className="text-sm text-gray-600">
                    SĐT: {doctor?.user?.phone}
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: {doctor?.user?.email}
                  </p>
                  <p
                    className="text-blue-600 font-medium hover:underline mt-4"
                    onClick={() => setSelectedDoctor(doctor)}
                  >
                    Xem chi tiết
                  </p>
                </>
              </CommonCard>
            </Grid>
          ))}
        </Grid>

        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
      <ModalDetailDoctor
        open={selectedDoctor !== null}
        onClose={() => setSelectedDoctor(null)}
        doctor={selectedDoctor}
      />
    </>
  );
};

export default DoctorsTab;
