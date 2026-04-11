import CommonModal from '@src/components/Modal';
import { IContact } from '@src/types';
import { Box, Grid, Typography } from '@mui/material';

interface IModalContactDetailProps {
  open: boolean;
  onClose: () => void;
  data: IContact;
}
export default function ModalContactDetail({
  open,
  onClose,
  data,
}: IModalContactDetailProps) {
  return (
    <CommonModal title="Chi tiết phản hồi" open={open} onClose={onClose}>
      <Box p={2} sx={{ maxHeight: '70vh', overflowY: 'auto' }}>
        <Grid container spacing={2}>
          {/* Thông tin cơ bản */}
          <Grid size={12}>
            <Typography variant="h6">Thông tin liên hệ</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="subtitle2">Họ và tên:</Typography>
            <Typography>{data.fullname}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="subtitle2">Email:</Typography>
            <Typography>{data.email}</Typography>
          </Grid>
          {data.phone && (
            <Grid size={6}>
              <Typography variant="subtitle2">Số điện thoại:</Typography>
              <Typography>{data.phone}</Typography>
            </Grid>
          )}
          {data.subject && (
            <Grid size={6}>
              <Typography variant="subtitle2">Chủ đề:</Typography>
              <Typography>{data.subject}</Typography>
            </Grid>
          )}
          <Grid size={12}>
            <Typography variant="subtitle2">Nội dung:</Typography>
            <Typography>{data.content}</Typography>
          </Grid>

          {/* Thông tin phản hồi */}
          {data.reply && (
            <>
              <Grid size={12}>
                <Typography variant="h6">Phản hồi</Typography>
              </Grid>
              <Grid size={12}>
                <Typography variant="subtitle2">Nội dung phản hồi:</Typography>
                <Typography>{data.reply}</Typography>
              </Grid>
              {data.userReply?.user?.name && (
                <Grid size={6}>
                  <Typography variant="subtitle2">
                    Nhân viên phản hồi:
                  </Typography>
                  <Typography>
                    {`${data.userReply.user.name.firstName} ${data.userReply.user.name.lastName} (ID: ${data.userReply.staffId})`}{' '}
                  </Typography>
                </Grid>
              )}
              {data.replyAt && (
                <Grid size={6}>
                  <Typography variant="subtitle2">
                    Thời gian phản hồi:
                  </Typography>
                  <Typography>
                    {new Date(data.replyAt).toLocaleString()}
                  </Typography>
                </Grid>
              )}
            </>
          )}

          {/* Thông tin hệ thống */}
          <Grid size={12}>
            <Typography variant="h6">Thông tin hệ thống</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="subtitle2">Ngày tạo:</Typography>
            <Typography>{new Date(data.createdAt).toLocaleString()}</Typography>
          </Grid>
          <Grid size={6}>
            <Typography variant="subtitle2">Ngày cập nhật:</Typography>
            <Typography>{new Date(data.updatedAt).toLocaleString()}</Typography>
          </Grid>
        </Grid>
      </Box>
    </CommonModal>
  );
}
