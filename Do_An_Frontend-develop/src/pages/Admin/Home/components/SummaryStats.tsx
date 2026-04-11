import { Grid, Paper, Typography, Box, Skeleton } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import { useQuery } from '@tanstack/react-query';
import ApiStatistics, { ISummaryStats } from '@api/ApiStatistics';
import QUERY_KEY from '@api/QueryKey';

const iconMap = {
  1: <PeopleIcon sx={{ fontSize: 40, color: '#3b82f6' }} />,
  2: <PersonAddIcon sx={{ fontSize: 40, color: '#10b981' }} />,
  3: <LocalHospitalIcon sx={{ fontSize: 40, color: '#f59e0b' }} />,
  4: <MedicalServicesIcon sx={{ fontSize: 40, color: '#ef4444' }} />,
};

function StatCardSkeleton() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 2,
        border: '1px solid #e5e7eb',
      }}
    >
      <Box sx={{ flex: 1 }}>
        <Skeleton variant="text" width="80%" height={20} />
        <Skeleton variant="text" width="50%" height={40} sx={{ my: 1 }} />
        <Skeleton variant="text" width="60%" height={16} />
      </Box>
      <Skeleton variant="circular" width={56} height={56} />
    </Paper>
  );
}

export default function SummaryStats() {
  const { data: summaryStats, isLoading } = useQuery({
    queryKey: [QUERY_KEY.STATISTICS.ADMIN_SUMMARY],
    queryFn: ApiStatistics.getSummary,
  });

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((i) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={i}>
            <StatCardSkeleton />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {summaryStats?.map((stat: ISummaryStats) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.id}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderRadius: 2,
              border: '1px solid #e5e7eb',
              transition: 'transform 0.2s, box-shadow 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow:
                  '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
              },
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {stat.title}
              </Typography>
              <Typography
                variant="h4"
                component="div"
                sx={{ fontWeight: 'bold', color: '#111827' }}
              >
                {stat.value}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color:
                      stat.trend === 'up'
                        ? '#10b981'
                        : stat.trend === 'down'
                          ? '#ef4444'
                          : '#6b7280',
                    fontWeight: 'medium',
                    bgcolor:
                      stat.trend === 'up'
                        ? '#ecfdf5'
                        : stat.trend === 'down'
                          ? '#fef2f2'
                          : '#f3f4f6',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  {stat.change}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ ml: 1 }}
                >
                  so với hôm qua
                </Typography>
              </Box>
            </Box>
            <Box
              sx={{
                p: 1.5,
                borderRadius: '50%',
                bgcolor: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {iconMap[stat.id as keyof typeof iconMap]}
            </Box>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}
