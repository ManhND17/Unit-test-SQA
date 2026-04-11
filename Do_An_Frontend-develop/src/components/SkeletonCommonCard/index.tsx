import { Card, CardContent, Skeleton, Box } from '@mui/material';

interface SkeletonCommonCardProps {
  className?: string;
  children?: React.ReactNode;
  image?: boolean;
}

export default function SkeletonCommonCard({
  className = '',
  children,
  image = true,
}: SkeletonCommonCardProps) {
  return (
    <Card
      className={className}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Image Skeleton */}
      {image && (
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            bgcolor: '#f1f5f9',
            width: '100%',
            height: 220,
            flexShrink: 0,
          }}
        >
          <Skeleton
            variant="rectangular"
            animation="wave"
            sx={{
              width: '100%',
              height: '100%',
              bgcolor: 'rgba(0, 0, 0, 0.08)',
            }}
          />
        </Box>
      )}

      {/* Content Skeleton */}
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          p: { xs: 2, md: 3 },
          bgcolor: '#ffffff',
        }}
      >
        {/* Title Skeleton - 2 lines */}
        <Box>
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              fontSize: '1.125rem',
              height: '1.6875rem',
              bgcolor: 'rgba(0, 0, 0, 0.08)',
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            width="80%"
            sx={{
              fontSize: '1.125rem',
              height: '1.6875rem',
              bgcolor: 'rgba(0, 0, 0, 0.08)',
            }}
          />
        </Box>

        {/* Description Skeleton - 3 lines */}
        <Box sx={{ flexGrow: 1 }}>
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              fontSize: '0.9375rem',
              height: '1.5rem',
              bgcolor: 'rgba(0, 0, 0, 0.08)',
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              fontSize: '0.9375rem',
              height: '1.5rem',
              bgcolor: 'rgba(0, 0, 0, 0.08)',
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            width="65%"
            sx={{
              fontSize: '0.9375rem',
              height: '1.5rem',
              bgcolor: 'rgba(0, 0, 0, 0.08)',
            }}
          />
        </Box>

        {/* Optional: Children/Button area skeleton */}
        <Box sx={{ mt: 'auto' }}>
          {children || (
            <Skeleton
              variant="rounded"
              animation="wave"
              width={120}
              height={36}
              sx={{
                borderRadius: 1,
                bgcolor: 'rgba(0, 0, 0, 0.08)',
              }}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
