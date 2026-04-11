import React from 'react';
import { Card, CardContent, CardMedia, Typography, Box } from '@mui/material';

interface ICommonCardProps {
  title: React.ReactNode;
  description: React.ReactNode;
  image?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function CommonCard({
  title,
  description,
  image,
  onClick,
  className,
  children,
}: ICommonCardProps) {
  return (
    <Card
      className={`cursor-pointer group ${className}`}
      onClick={onClick}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
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
      {/* Image Section */}
      {image && (
        <Box
          sx={{
            position: 'relative',
            overflow: 'hidden',
            bgcolor: '#f1f5f9',
            width: '100%',
            height: 220,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CardMedia
            component="img"
            image={image}
            sx={{
              width: '100%',
              height: '100%',
              minWidth: '100%',
              minHeight: '100%',
              objectFit: 'cover',
              transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'block',
            }}
            className="group-hover:scale-110"
          />
        </Box>
      )}

      {/* Content Section */}
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
            lineHeight: 1.5,
          }}
        >
          {description}
        </Typography>

        {/* Children for additional content */}
        {children && (
          <Box
            sx={{
              mt: 'auto',
            }}
          >
            {children}
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
