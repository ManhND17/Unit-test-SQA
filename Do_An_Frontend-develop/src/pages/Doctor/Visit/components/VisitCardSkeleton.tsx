import { Skeleton, Box } from '@mui/material';

export default function VisitCardSkeleton() {
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        borderRadius: 3,
        border: '1px solid',
        borderColor: 'divider',
        p: 2.5,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
          <Skeleton variant="circular" width={24} height={24} />
          <Skeleton variant="text" width="60%" height={28} />
        </Box>
        <Skeleton variant="rounded" width={60} height={24} />
      </Box>

      {/* Content */}
      <Box sx={{ spaceY: 1.5, flex: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="40%" />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
          <Skeleton variant="text" width="30%" />
          <Skeleton variant="text" width="40%" />
        </Box>
      </Box>

      {/* Actions */}
      <Box
        sx={{
          pt: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          gap: 1.5,
        }}
      >
        <Skeleton variant="rounded" width="100%" height={40} />
      </Box>
    </Box>
  );
}
