import ApiDepartment, { DepartmentQueryParams } from '@api/ApiDepartment';
import QUERY_KEY from '@api/QueryKey';
import CommonCard from '@components/CommonCard';
import SkeletonCommonCard from '@components/SkeletonCommonCard';
import useDebounce from '@hooks/useDebounce';
import {
  Breadcrumbs,
  Grid,
  Pagination,
  Skeleton,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Specialties() {
  const breadcrumbs = [
    <Link key="1" to="/" className="font-normal text-black">
      Trang chủ
    </Link>,
    <Typography
      key="2"
      sx={{
        fontWeight: 700,
        color: 'black',
      }}
    >
      Chuyên khoa
    </Typography>,
  ];
  const [searchValue, setSearchValue] = useState('');
  const navigate = useNavigate();
  const debourcedSearchValue = useDebounce(searchValue, 1000);

  const [page, setPage] = useState(1);

  const { data: specialties, isLoading: isLoadingSpecialties } = useQuery({
    queryKey: [
      QUERY_KEY.DEPARMENT.GET_LIST_DEPARTMENT,
      page,
      debourcedSearchValue,
    ],
    queryFn: () => {
      const filter: DepartmentQueryParams = {
        page: page,
        limit: 12,
        type: 'clinical,paraclinical',
      };
      if (debourcedSearchValue) {
        filter.search = debourcedSearchValue;
      }

      return ApiDepartment.getDepartments(filter);
    },
  });

  return (
    <div className="px-8 py-6">
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
      <div className="py-5">
        <h1 className="font-bold text-2xl ">Tìm hiểu các Chuyên khoa</h1>
        <p>Vui lòng chọn chuyên khoa để xem thông tin chi tiết</p>
      </div>
      <div className="relative">
        <input
          id="searchSpecialty"
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Tìm kiếm theo tên, dịch vụ, mô tả..."
          type="search"
          className="w-full p-3 pr-[40px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>
      <div className="mt-8">
        <Grid container spacing={3}>
          {isLoadingSpecialties ? (
            <>
              {Array.from({ length: 6 }).map((_, index) => (
                <Grid size={{ xs: 6, sm: 4, md: 3 }} key={index}>
                  <SkeletonCommonCard />
                </Grid>
              ))}
            </>
          ) : (
            <>
              {!specialties || !specialties.departments.length ? (
                <p>Không tìm thấy chuyên khoa</p>
              ) : (
                specialties?.departments.map((specialty) => (
                  <Grid size={{ xs: 6, sm: 4, md: 3 }} key={specialty.id}>
                    <CommonCard
                      image={specialty.thumbnail || ''}
                      title={specialty.name || ''}
                      description={specialty.description || ''}
                      onClick={() => navigate(`/specialties/${specialty.id}`)}
                    />
                  </Grid>
                ))
              )}
            </>
          )}
        </Grid>
        <div className="mt-6">
          {isLoadingSpecialties ? (
            <div className="flex gap-2 justify-center">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  variant="rectangular"
                  width={32}
                  height={32}
                  key={index}
                />
              ))}
            </div>
          ) : (
            <div className="flex gap-2 justify-center">
              <Pagination
                variant="outlined"
                shape="rounded"
                count={specialties?.pagination.totalPages}
                page={page}
                sx={{
                  '& .Mui-selected': {
                    backgroundColor: '#2563eb !important',
                    color: 'white',
                  },
                }}
                onChange={(_, value) => {
                  setPage(value);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
