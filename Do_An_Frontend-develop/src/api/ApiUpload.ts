import { fetcher } from './Fetcher';

type UploadFileResponse = {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
  minetype: string;
  originalName: string;
};

const uploadFiles = async (files: File[]): Promise<UploadFileResponse[]> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });
  return fetcher(
    {
      url: '/uploads',
      method: 'POST',
      data: formData,
    },
    {
      isFormData: true,
    }
  );
};

export default {
  uploadFiles,
};
