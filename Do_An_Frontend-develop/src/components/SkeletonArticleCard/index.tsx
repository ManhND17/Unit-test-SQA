import { Card, CardContent, Skeleton, Box } from '@mui/material';

interface SkeletonArticleCardProps {
  className?: string;
  classNameThumbnail?: string;
  layoutRow?: boolean;
}

export const SkeletonArticleCard: React.FC<SkeletonArticleCardProps> = ({
  className = '',
  layoutRow = false,
  classNameThumbnail = '',
}) => {
  return (
    <Card
      className={className}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: layoutRow ? 'row' : 'column',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          bgcolor: '#f1f5f9',
        }}
      >
        <Skeleton
          variant="rectangular"
          animation="wave"
          className={classNameThumbnail}
          sx={{
            height: 220,
            width: layoutRow ? 200 : '100%',
            bgcolor: 'rgba(0, 0, 0, 0.08)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
          }}
        >
          <Skeleton
            variant="rounded"
            animation="wave"
            width={100}
            height="28px"
            sx={{
              borderRadius: 3,
              bgcolor: 'rgba(0, 0, 0, 0.15)',
            }}
          />
        </Box>
      </Box>
      <CardContent
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          p: { xs: 2, md: 3 },
          bgcolor: '#ffffff',
        }}
      >
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
            width="85%"
            sx={{
              fontSize: '1.125rem',
              height: '1.6875rem',
              bgcolor: 'rgba(0, 0, 0, 0.08)',
            }}
          />
        </Box>
        <Box sx={{ mt: 0.5 }}>
          <Skeleton
            variant="text"
            animation="wave"
            sx={{
              fontSize: '0.9375rem',
              height: '1.5rem',
              bgcolor: 'rgba(0, 0, 0, 0.06)',
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            width="95%"
            sx={{
              fontSize: '0.9375rem',
              height: '1.5rem',
              bgcolor: 'rgba(0, 0, 0, 0.06)',
            }}
          />
        </Box>
        <Box sx={{ flexGrow: 1 }} />
        <Skeleton
          variant="rectangular"
          animation="wave"
          height={1}
          sx={{
            my: 0.5,
            bgcolor: 'rgba(0, 0, 0, 0.06)',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 'auto',
          }}
        >
          <Skeleton
            variant="circular"
            animation="wave"
            width={18}
            height={18}
            sx={{
              bgcolor: 'rgba(0, 0, 0, 0.06)',
            }}
          />
          <Skeleton
            variant="text"
            animation="wave"
            width={90}
            sx={{
              fontSize: '0.875rem',
              bgcolor: 'rgba(0, 0, 0, 0.06)',
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
};
