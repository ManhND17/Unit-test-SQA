import { Box, Modal } from '@mui/material';
import Login from '@pages/Auth/Login';
import { openModalLogin } from '@redux/slices/ModalSlice';
import { IRootState } from '@redux/store';
import { useDispatch, useSelector } from 'react-redux';

function ModalLogin() {
  const { modalLoginOpen } = useSelector((state: IRootState) => state.modal);
  const dispatch = useDispatch();
  return (
    <Modal
      open={modalLoginOpen}
      onClose={() => dispatch(openModalLogin(false))}
      disableAutoFocus
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: ['90%', '90%', '600px'],
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Login
          className="bg-white"
          onSucees={() => dispatch(openModalLogin(false))}
        />
      </Box>
    </Modal>
  );
}

export default ModalLogin;
