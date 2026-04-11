import { useQuery } from '@tanstack/react-query';
import ApiVisit from '@src/api/ApiVisit';
import { useCallback, useState } from 'react';
import { IVisit } from '@src/types';
import { VisitCard } from '../../VisitCard';
import VisitCardSkeleton from '../../VisitCardSkeleton';
import { Pagination, Box, Typography, Stack } from '@mui/material';
import { Users2 } from 'lucide-react';

interface IWaitingVisitsProps {
  doctorId?: string;
}

export default function WaitingVisits({ doctorId }: IWaitingVisitsProps) {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useQuery({
    queryKey: ['visits', 'waiting', doctorId, page],
    queryFn: () =>
      ApiVisit.getTasksOfDoctor(doctorId!, {
        status: 'waiting',
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

  const calculateDiffTime = useCallback((visit: IVisit): string => {
    const startTime = new Date(visit.startTime);
    const now = new Date();
    if (now.getTime() < startTime.getTime()) return '0 phút';
    const diffTime = Math.abs(now.getTime() - startTime.getTime());
    const totalMinutes = Math.floor(diffTime / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (hours > 0) {
      return `${hours} giờ ${minutes} phút`;
    }

    return `${minutes} phút`;
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
            bgcolor: 'rgba(239, 246, 255, 0.4)',
            borderRadius: 4,
            border: '1px dashed #bfdbfe',
          }}
        >
          <div className="p-4 bg-white rounded-2xl shadow-sm mb-4">
            <Users2 className="w-12 h-12 text-blue-400" />
          </div>
          <Typography variant="h6" sx={{ color: 'slate.900', fontWeight: 600 }}>
            Hàng đợi trống
          </Typography>
          <Typography variant="body2" sx={{ color: 'slate.500', mt: 1 }}>
            Hiện không có bệnh nhân nào đang đợi khám.
          </Typography>
        </Stack>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.map((visit, index) => (
              <VisitCard
                key={visit.id}
                patientName={getPatientName(visit)}
                type={visit.medicalService?.name || 'Khám tổng quát'}
                waitTime={calculateDiffTime(visit)}
                status="waiting"
                order={index + 1 + (page - 1) * 10}
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
