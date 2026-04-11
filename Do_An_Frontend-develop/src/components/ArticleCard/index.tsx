import {
  Card,
  CardContent,
  CardMedia,
  Chip,
  Typography,
  Box,
} from '@mui/material';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { Calendar } from 'lucide-react';

interface ArticleCardProps {
  image: string;
  category: string;
  title: string;
  description: string;
  date: string;
  onClick?: () => void;
  className?: string;
  classNameThumbnail?: string;
  layoutRow?: boolean;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({
  image,
  category,
  title,
  description,
  date,
  onClick,
  className,
  classNameThumbnail,
  layoutRow = false,
}) => {
  return (
    <Card
      className={`cursor-pointer group ${className}`}
      onClick={onClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: layoutRow ? 'row' : 'column',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'rgba(0, 0, 0, 0.08)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
          transform: 'translateY(-4px)',
          borderColor: 'rgba(0, 0, 0, 0.12)',
        },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          bgcolor: '#f1f5f9',
          width: layoutRow ? 220 : '100%',
          height: 220,
          flexShrink: 0,
        }}
      >
        <CardMedia
          component="img"
          image={image}
          alt={title}
          sx={{
            width: '100%',
            height: '100%',
            minWidth: '100%',
            minHeight: '100%',
            objectFit: 'cover',
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          className={clsx('group-hover:scale-110', classNameThumbnail)}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 16,
            left: 16,
          }}
        >
          <Chip
            label={category}
            size="small"
            sx={{
              bgcolor: '#dc2626',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.75rem',
              height: '28px',
              px: 0.5,
              backdropFilter: 'blur(8px)',
              boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#b91c1c',
                transform: 'scale(1.05)',
              },
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
        <Typography
          variant="h6"
          component="h3"
          sx={{
            fontWeight: 700,
            fontSize: '1.125rem',
            color: '#0f172a',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '3.375rem',
            transition: 'color 0.2s ease',
            '&:hover': {
              color: '#dc2626',
            },
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: '#64748b',
            fontSize: '0.9375rem',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            minHeight: '4.5rem', // 3 lines * 1.5rem line-height
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>
        <Box
          sx={{
            height: '1px',
            bgcolor: 'rgba(0, 0, 0, 0.1)',
            my: 0.5,
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
          <Calendar size={18} className="text-gray-400" strokeWidth={2} />
          <Typography
            variant="body2"
            sx={{
              color: '#94a3b8',
              fontSize: '0.875rem',
              fontWeight: 500,
              letterSpacing: '0.01em',
            }}
          >
            {date && dayjs(date).format('DD/MM/YYYY')}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
