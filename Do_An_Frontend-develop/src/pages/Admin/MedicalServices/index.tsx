import React, { useEffect, useRef, useState } from 'react';
import { IMedicalService } from '@src/types';
import ApiMedicalService from '@src/api/ApiMedicalService';
import ApiUpload from '@src/api/ApiUpload';
import useDebounce from '@hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CreateMedicalservice from './CreateMedicalService/CreateMedicalservice';
import { Eye, Pencil, RefreshCw, Search, Trash } from 'lucide-react';
import Input from '@src/components/CommonInput';
import CommonTable, { CommonTableColumn } from '@src/components/CommonTable';
import { IconButton } from '@mui/material';

export default function AdminMedicalServicesPage() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Partial<IMedicalService>>({
    images: [],
    name: '',
    description: '',
    price: 0,
    unit: '',
    durationMinutes: 0,
    isActive: true,
    percentApplyHealthInsurance: 0,
    departmentId: null,
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [searchValue, setSearchValue] = useState('');
  const debourcedSearchValue = useDebounce(searchValue, 1000);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const prevImageUrlsRef = useRef<string[]>([]);
  const selectedFilesRef = useRef<(File | null)[]>([]);

  useEffect(() => {
    return () => {
      prevImageUrlsRef.current = [];
      selectedFilesRef.current = [];
    };
  }, []);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const medicalService = useQuery({
    queryKey: ['medical-services', page, debourcedSearchValue, limit],
    queryFn: () => {
      return ApiMedicalService.getMedicalServices({
        page: page,
        limit: limit,
        search: debourcedSearchValue || undefined,
      });
    },
  });
  useEffect(() => {
    setPage(1);
  }, [debourcedSearchValue]);

  function openCreate() {
    setForm({
      images: [],
      name: '',
      description: '',
      price: 0,
      unit: '',
      durationMinutes: 0,
      isActive: true,
      percentApplyHealthInsurance: 0,
      departmentId: null,
    });
    setShowForm(true);
  }

  function formField<K extends keyof IMedicalService>(key: K, value: any) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleFormImageFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const MAX_SIZE = 2 * 1024 * 1024; // 2MB per file

    const readAsDataURL = (file: File) =>
      new Promise<string>((resolve, reject) => {
        if (file.size > MAX_SIZE) {
          reject(new Error('SIZE'));
          return;
        }
        const fr = new FileReader();
        fr.onload = () => resolve(String(fr.result));
        fr.onerror = () => reject(new Error('READ'));
        fr.readAsDataURL(file);
      });

    try {
      const dataUrls = await Promise.all(files.map(readAsDataURL));

      const existing = Array.isArray(form.images) ? [...form.images] : [];
      const combined = [...existing, ...dataUrls];

      const existingFiles = Array.isArray(selectedFilesRef.current)
        ? [...selectedFilesRef.current]
        : [];
      const combinedFiles = [...existingFiles, ...files.map((f) => f)];
      selectedFilesRef.current = combinedFiles;
      prevImageUrlsRef.current = combined;
      setForm((f) => ({ ...f, images: combined }));
      if (e.currentTarget) e.currentTarget.value = '';
    } catch (err) {
      if ((err as Error).message === 'SIZE') {
        toast.error('Kích thước ảnh không được vượt quá 2MB');
      } else {
        toast.error('Không thể đọc file ảnh');
      }
    }
  }

  function removeFormImage(idx: number) {
    setForm((f) => {
      const images = Array.isArray(f.images) ? [...f.images] : [];
      images.splice(idx, 1);
      prevImageUrlsRef.current = images;
      if (Array.isArray(selectedFilesRef.current)) {
        selectedFilesRef.current.splice(idx, 1);
      }
      return { ...f, images };
    });
  }

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!form.name || (form.price ?? 0) < 0) {
      alert('Vui lòng nhập tên và giá hợp lệ');
      return;
    }
    setSaving(true);
    try {
      const images = Array.isArray(form.images) ? [...form.images] : [];
      const filesToUpload = (selectedFilesRef.current || []).filter(
        (f) => f != null
      ) as File[];

      let uploadedUrls: string[] = [];
      if (filesToUpload.length > 0) {
        const responses = await ApiUpload.uploadFiles(filesToUpload);
        uploadedUrls = responses.map((r: any) => r.url);
      }

      const finalImages: string[] = [];
      let uploadIdx = 0;
      for (let i = 0; i < images.length; i++) {
        const fileAtIndex = (selectedFilesRef.current || [])[i];
        if (fileAtIndex) {
          finalImages.push(uploadedUrls[uploadIdx] ?? '');
          uploadIdx++;
        } else {
          finalImages.push(String(images[i] ?? ''));
        }
      }

      const payload = {
        images: finalImages.filter(Boolean),
        roomId: form.roomId,
        name: String(form.name),
        description: form.description,
        price: Number(form.price ?? 0),
        unit: form.unit,
        durationMinutes: Number(form.durationMinutes ?? 0),
        isActive: Boolean(form.isActive),
        percentApplyHealthInsurance: Number(
          form.percentApplyHealthInsurance ?? 0
        ),
        departmentId: form.departmentId,
      };
      await ApiMedicalService.createMedicalService(payload);
      setShowForm(false);
      prevImageUrlsRef.current = [];
      selectedFilesRef.current = [];
      medicalService.refetch();
    } catch (err: any) {
      alert('Lỗi khi lưu: ' + (err?.message ?? err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bạn có chắc muốn xóa dịch vụ này?')) return;
    setDeletingId(id);
    try {
      await ApiMedicalService.deleteMedicalService(id);
      medicalService.refetch();
    } catch (err: any) {
      alert('Xóa thất bại: ' + (err?.message ?? err));
    } finally {
      setDeletingId(null);
    }
  }

  function renderThumbnail(s?: string[]) {
    const url = s && s.length > 0 ? s[0] : '';
    return url ? (
      <img src={url} className="w-16 h-10 object-cover rounded-md" />
    ) : (
      <div className="w-16 h-10 bg-gray-100 flex items-center justify-center rounded-md text-sm text-gray-400">
        No
      </div>
    );
  }

  const tableRows: (IMedicalService & { original: IMedicalService })[] =
    medicalService.data?.data?.map((item: IMedicalService) => ({
      ...item,
      original: item,
    })) || [];

  const columns: CommonTableColumn<IMedicalService>[] = [
    {
      field: 'images',
      headerName: 'Ảnh',
      width: 90,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          {renderThumbnail(value)}
        </div>
      ),
    },
    {
      field: 'name',
      headerName: 'Tên dịch vụ',
      width: 250,
      renderCell: ({ row }) => (
        <div className="w-full h-full">
          <div className="text-sm font-medium text-gray-900">{row?.name}</div>
          <div className="text-xs text-gray-500 truncate">
            {row?.description}
          </div>
        </div>
      ),
    },
    {
      field: 'price',
      headerName: 'Giá',
      width: 150,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <p className="line-clamp-2 truncate">
            {`${value ? Number(value).toLocaleString() : '-'} đ`}
          </p>
        </div>
      ),
    },
    {
      field: 'unit',
      headerName: 'Đơn vị / Thg',
      width: 200,
      renderCell: ({ row }) => (
        <div className="w-full h-full flex items-center">
          {row.unit ?? '-'} / {row.durationMinutes} Phút
        </div>
      ),
    },
    {
      field: 'department',
      headerName: 'Khoa',
      width: 200,
      renderCell: ({ row }) => (
        <div className="w-full h-full flex items-center truncate">
          {row.department?.name ?? '-'}
        </div>
      ),
    },
    {
      field: 'isActive',
      headerName: 'Trạng thái',
      width: 200,
      renderCell: ({ value }) => (
        <div className="w-full h-full flex items-center">
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold ${value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
          >
            {value ? 'Hoạt động' : 'Không hoạt động'}
          </span>
        </div>
      ),
    },
    {
      field: 'actions',
      headerName: 'Hành động',
      width: 120,
      sticky: true,
      renderCell: ({ row }) => (
        <div className="flex justify-start items-center gap-1">
          <IconButton
            size="small"
            title="Xem chi tiết"
            sx={{
              backgroundColor: 'green',
            }}
            onClick={() =>
              navigate(`/admin/medical-services/detail`, {
                state: row.id,
              })
            }
          >
            <Eye size={20} />
          </IconButton>
          <IconButton
            size="small"
            title="Sửa"
            sx={{
              backgroundColor: 'yellow',
            }}
            onClick={() =>
              navigate(`/admin/medical-services/edit`, {
                state: row.id,
              })
            }
          >
            <Pencil size={20} />
          </IconButton>
          <IconButton
            size="small"
            title="Xóa"
            sx={{
              backgroundColor: 'red',
            }}
            onClick={() => handleDelete(row.id)}
          >
            <Trash size={20} />
          </IconButton>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Quản lý dịch vụ y tế
        </h2>
        <div className="flex items-center gap-3">
          <button
            onClick={() => medicalService.refetch()}
            className="px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
          >
            <RefreshCw size={18} />
            <span>Làm mới</span>
          </button>
          <button
            onClick={openCreate}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700"
          >
            Thêm dịch vụ
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 max-w-md">
            <Input
              icon={Search}
              placeholder="Tìm kiếm phòng..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') medicalService.refetch();
              }}
            />
          </div>

          <button
            onClick={() => medicalService.refetch()}
            className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
          >
            Tìm
          </button>
        </div>

        <CommonTable
          ordinalColumn
          rows={tableRows}
          columns={columns}
          totalItems={medicalService.data?.metadata?.totalItems}
          currentPage={page}
          onPageChange={setPage}
          rowsPerPage={limit}
          onRowsPerPageChange={setLimit}
          stickyHeader
          maxHeight="calc(100vh - 250px)"
          onRowDoubleClick={(row) => {
            navigate(`/admin/medical-services/detail`, {
              state: row.id,
            });
          }}
        />
      </div>

      <CreateMedicalservice
        show={showForm}
        onClose={() => setShowForm(false)}
        form={form}
        saving={saving}
        onSave={handleSave}
        fileInputRef={fileInputRef}
        handleFiles={handleFormImageFiles}
        removeImage={removeFormImage}
        formField={formField}
      />
    </div>
  );
}
