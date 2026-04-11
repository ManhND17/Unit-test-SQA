import { useQuery } from '@tanstack/react-query';
import ApiVisit from '@src/api/ApiVisit';
import { useCallback, useState } from 'react';
import { IVisit } from '@src/types';
import { VisitCard } from '../../VisitCard';
import VisitCardSkeleton from '../../VisitCardSkeleton';
import { Pagination, Box, Typography, Stack } from '@mui/material';
import { CheckCircle2 } from 'lucide-react';

interface ICompletedVisitsProps {
  doctorId?: string;
}

export default function CompletedVisits({ doctorId }: ICompletedVisitsProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['visits', 'completed', doctorId, page],
    queryFn: () =>
      ApiVisit.getTasksOfDoctor(doctorId!, {
        status: 'completed',
        page,
      }),
    enabled: !!doctorId,
    staleTime: 30000,
  });

  const getPatientName = useCallback((visit: IVisit) => {
    return visit.ehr?.patient?.user?.name
      ? `${visit.ehr.patient.user.name.firstName} ${visit.ehr.patient.user.name.lastName}`
      : `Bệnh nhân: ${visit.ehr?.patient?.patientId || 'Không rõ'}`;
  }, []);

  if (!doctorId) {
    return null;
  }

  const isEmpty = !isLoading && (!data || data.data.length === 0);

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, minHeight: '400px' }}>
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <VisitCardSkeleton key={index} />
          ))}
        </div>
      ) : isEmpty ? (
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            py: 12,
            bgcolor: 'rgba(240, 253, 244, 0.4)',
            borderRadius: 4,
            border: '1px dashed #bbf7d0',
          }}
        >
          <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-400" />
          </div>
          <Typography variant="h6" sx={{ color: 'slate.900', fontWeight: 600 }}>
            Chưa có ca hoàn thành
          </Typography>
          <Typography variant="body2" sx={{ color: 'slate.500', mt: 1 }}>
            Bạn chưa hoàn thành ca khám bệnh nào trong ngày hôm nay.
          </Typography>
        </Stack>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.map((visit) => (
              <VisitCard
                key={visit.id}
                patientName={getPatientName(visit)}
                type={visit.medicalService?.name || 'Không rõ'}
                completedTime={visit.updatedAt}
                diagnosis={visit.medicalRecords?.[0]?.diagnosis}
                status="completed"
                visitCode={visit.id}
                from={visit.taskSource}
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
    </Box>
  );
}
