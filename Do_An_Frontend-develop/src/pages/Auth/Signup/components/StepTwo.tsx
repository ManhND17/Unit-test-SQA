import CommonInput from '@components/CommonInput';
import CommonSelect from '@components/CommonSelect';
import DatePickerComponent from '@components/DatePicker';
import ErrorMessage from '@components/ErrorMessage';
import { RegisterPatientDataDto } from '@dto/auth.dto';
import dayjs from 'dayjs';
import { Controller, useFormContext } from 'react-hook-form';

export default function StepTwo() {
  const {
    register,
    formState: { errors },
    control,
  } = useFormContext<RegisterPatientDataDto>();
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <CommonInput
          placeholder="Họ"
          label="Họ"
          {...register('name.firstName')}
        />
        {errors.name?.firstName && (
          <ErrorMessage
            message={(errors.name.firstName.message as string) || ''}
          />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <CommonInput
          placeholder="Tên"
          label="Tên"
          {...register('name.lastName')}
        />
        {errors.name?.lastName && (
          <ErrorMessage
            message={(errors.name.lastName.message as string) || ''}
          />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <CommonInput
          placeholder="Số điện thoại"
          label="Số điện thoại"
          {...register('phone')}
        />
        {errors.phone && (
          <ErrorMessage message={(errors.phone.message as string) || ''} />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Chọn ngày sinh
        </label>

        <Controller
          name="birthday"
          control={control}
          render={({ field }) => (
            <DatePickerComponent
              value={field.value}
              onChange={(data) => field.onChange(data?.toISOString())}
              config={{
                maxDate: dayjs().toISOString(),
              }}
            />
          )}
        />

        {errors.birthday && (
          <ErrorMessage message={(errors.birthday.message as string) || ''} />
        )}
      </div>
      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Giới tính
        </label>
        <Controller
          name="gender"
          control={control}
          render={({ field }) => {
            return (
              <CommonSelect
                value={field.value}
                id="gender"
                values={[
                  { name: 'Nam', id: 'male' },
                  { name: 'Nữ', id: 'female' },
                  { name: 'Khác', id: 'other' },
                ]}
                onChange={field.onChange}
                placeholder="Chọn giới tính"
                selectProps={{
                  sx: {
                    width: '100%',
                  },
                }}
              />
            );
          }}
        />
        {errors.gender && (
          <ErrorMessage message={(errors.gender.message as string) || ''} />
        )}
      </div>
    </div>
  );
}
