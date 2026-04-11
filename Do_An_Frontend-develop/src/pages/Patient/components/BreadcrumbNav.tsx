import { Link as RouterLink } from 'react-router-dom';
import Box from '@mui/material/Box';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

interface BreadcrumbNavProps {
  specialtyName?: string;
  onBackToList?: () => void;
}

const BreadcrumbNav = ({ specialtyName, onBackToList }: BreadcrumbNavProps) => {
  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', py: 2 }}>
      <Breadcrumbs
        aria-label="breadcrumb"
        separator="›"
        sx={{
          display: 'flex',
          alignItems: 'center',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        }}
      >
        <Link
          component={RouterLink}
          to="/"
          color="text.secondary"
          underline="hover"
          sx={{ whiteSpace: 'nowrap' }}
        >
          Trang chủ
        </Link>

        {specialtyName ? (
          [
            <Link
              key="back"
              component="button"
              onClick={onBackToList}
              color="text.secondary"
              underline="hover"
              sx={{ cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              Chuyên khoa
            </Link>,

            <Tooltip key="name" title={specialtyName}>
              <Typography
                color="text.primary"
                fontWeight={500}
                sx={{
                  maxWidth: '50ch',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
                aria-label={specialtyName}
              >
                {specialtyName}
              </Typography>
            </Tooltip>,
          ]
        ) : (
          <Typography
            color="text.primary"
            fontWeight={500}
            sx={{ whiteSpace: 'nowrap' }}
          >
            Chuyên khoa
          </Typography>
        )}
      </Breadcrumbs>
    </Box>
  );
};
export default BreadcrumbNav;
