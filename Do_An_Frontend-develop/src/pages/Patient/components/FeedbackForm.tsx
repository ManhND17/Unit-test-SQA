import ApiContact from '@api/ApiContact';
import QUERY_KEY from '@api/QueryKey';
import CommonInput from '@components/CommonInput';
import ErrorMessage from '@components/ErrorMessage';
import { ContactDataDto, ContactDto } from '@dto/contact.dto';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@mui/material';
import { IRootState } from '@redux/store';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const FeedbackForm = () => {
  const { user } = useSelector((state: IRootState) => state.auth);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      fullname: user?.name
        ? `${user.name.firstName} ${user.name.lastName}`
        : '',
      email: user?.email || '',
      phone: user?.phone || '',
    },
    resolver: zodResolver(ContactDto),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: ContactDataDto) => ApiContact.sendContact(data),
    mutationKey: [QUERY_KEY.CONTACT.SEND_CONTACT],
    onSuccess: () => {
      toast.success('Gửi phản hồi thành công');
      reset();
    },
    onError: () => {
      toast.error('Gửi phản hồi thất bại');
    },
  });

  const onSubmit = (data: ContactDataDto) => {
    mutate(data);
  };

  return (
    <section>
      <form className="max-w-3xl mx-auto" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <CommonInput
              label="Họ và tên"
              {...register('fullname')}
              isRequired
              error={!!errors.fullname}
            />
            <ErrorMessage
              message={(errors.fullname?.message as string) || ''}
            />
          </div>
          <div>
            <CommonInput
              type="email"
              label="Email"
              {...register('email')}
              isRequired
              error={!!errors.email}
            />
            <ErrorMessage message={(errors.email?.message as string) || ''} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <CommonInput
              label="Số điện thoại"
              {...register('phone')}
              isRequired
              error={!!errors.phone}
            />
            <ErrorMessage message={(errors.phone?.message as string) || ''} />
          </div>
          <div>
            <CommonInput
              label="Tiêu đề"
              {...register('subject')}
              error={!!errors.subject}
            />
            <ErrorMessage message={(errors.subject?.message as string) || ''} />
          </div>
        </div>
        <div className="mb-6">
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nội dung góp ý của bạn <span className="text-red-500 ml-1">*</span>
          </label>
          <textarea
            {...register('content')}
            id="content"
            rows={5}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập nội dung góp ý..."
          ></textarea>
          <ErrorMessage message={(errors.content?.message as string) || ''} />
        </div>
        <div className="text-center">
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#2563eb',
              textTransform: 'none',
            }}
            loading={isPending}
            type="submit"
          >
            Gửi phản hồi
          </Button>
        </div>
      </form>
    </section>
  );
};
export default FeedbackForm;
