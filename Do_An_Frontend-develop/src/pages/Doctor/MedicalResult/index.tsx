import React, { useCallback, useState } from 'react';
import SearchFilter from './components/SearchFilter';
import { useQuery } from '@tanstack/react-query';
import ApiVisit from '@src/api/ApiVisit';
import useDebounce from '@src/hooks/useDebounce';
import { IVisit } from '@src/types';
import { Box, Pagination } from '@mui/material';
import { VisitCard } from '../Visit/components/VisitCard';

type IAdvancedFiltersProps = {
  doctor?: string;
  patientId?: string;
  gender?: string;
  fromDate?: string;
  toDate?: string;
};

export default function MedicalResultPage() {
  const [query, setQuery] = React.useState('');
  const debouncedQuery = useDebounce(query, 500);
  const [page, setPage] = useState(1);
  const [isApplyingAdvanced, setIsApplyingAdvanced] = useState(false);

  const [advancedFilters, setAdvancedFilters] = useState<IAdvancedFiltersProps>(
    {}
  );

  const { data, isLoading, isError, error } = useQuery({
    queryKey: [
      'visits',
      'search',
      debouncedQuery,
      advancedFilters,
      page,
      isApplyingAdvanced,
    ],
    queryFn: () => {
      const params: any = {
        page,
        limit: 9,
      };

      // Nếu đang dùng advanced filter, ưu tiên nó
      if (isApplyingAdvanced) {
        if (advancedFilters.patientId) {
          params.patientId = advancedFilters.patientId;
        }
        if (advancedFilters.fromDate) {
          params.fromDate = advancedFilters.fromDate;
        }
        if (advancedFilters.toDate) {
          params.toDate = advancedFilters.toDate;
        }
      } else {
        // Không thì dùng quick search
        if (debouncedQuery) {
          params.patientId = debouncedQuery;
        }
      }

      return ApiVisit.searchVisits(params);
    },
    enabled: !!(
      debouncedQuery ||
      (isApplyingAdvanced && advancedFilters.patientId)
    ),
  });

  const getPatientName = useCallback((visit: IVisit) => {
    return visit.ehr?.patient?.user?.name
      ? `${visit.ehr.patient.user.name.firstName} ${visit.ehr.patient.user.name.lastName}`
      : `Bệnh nhân: ${visit.ehr?.patient?.patientId || 'Không rõ'}`;
  }, []);

  return (
    <main className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          Kết quả khám của bệnh nhân
        </h2>
      </div>

      <SearchFilter
        onQueryChange={(value) => {
          setQuery(value);
          if (value) {
            setIsApplyingAdvanced(false); // Chuyển sang quick search
          }
        }}
        onAdvancedChange={(filters, isApplying) => {
          setAdvancedFilters(filters);
          setIsApplyingAdvanced(isApplying);
          setPage(1); // Reset page khi filter thay đổi
        }}
      />

      {!debouncedQuery && !isApplyingAdvanced ? (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <i className="ri-information-line text-blue-600 text-3xl mb-2"></i>
          <p className="text-blue-800 font-medium">
            Vui lòng nhập mã bệnh nhân để tìm kiếm
          </p>
          <p className="text-blue-600 text-sm mt-1">
            Nhập vào ô tìm kiếm hoặc sử dụng bộ lọc nâng cao
          </p>
        </div>
      ) : isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải dữ liệu...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <i className="ri-error-warning-line text-red-600 text-3xl mb-2"></i>
          <p className="text-red-800 font-medium">
            Có lỗi xảy ra khi tải dữ liệu
          </p>
          <p className="text-red-600 text-sm mt-1">
            {error?.message || 'Vui lòng thử lại sau'}
          </p>
        </div>
      ) : data?.data.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
          <i className="ri-file-search-line text-gray-400 text-5xl mb-4"></i>
          <p className="text-gray-700 font-medium text-lg">
            Không tìm thấy kết quả phù hợp
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.map((visit) => (
              <VisitCard
                key={visit.id}
                patientName={getPatientName(visit)}
                type={visit.medicalService?.name || 'Khám tổng quát'}
                completedTime={visit.updatedAt}
                diagnosis={visit.medicalRecords?.[0]?.diagnosis}
                status="completed"
                visitCode={visit.id}
              />
            ))}
          </div>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={data?.metadata?.totalPages || 0}
              page={page}
              onChange={(_, newPage) => setPage(newPage)}
              color="primary"
              size="large"
              sx={{
                '& .MuiPaginationItem-root': {
                  borderRadius: '12px',
                  fontWeight: 600,
                },
              }}
            />
          </Box>
        </>
      )}
    </main>
  );
}
