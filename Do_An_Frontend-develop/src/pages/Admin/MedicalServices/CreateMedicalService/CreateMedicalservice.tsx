import React, { useEffect, useMemo, useRef } from 'react';
import { IMedicalService, IDepartment } from '@src/types';
import ApiDepartment from '@api/ApiDepartment';
import { useQuery } from '@tanstack/react-query';

interface CreateMedicalServiceProps {
  show: boolean;
  onClose: () => void;
  form: Partial<IMedicalService>;
  saving: boolean;
  onSave: (e?: React.FormEvent) => Promise<void>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (idx: number) => void;
  formField: <K extends keyof IMedicalService>(key: K, value: any) => void;
}

export default function CreateMedicalservice({
  show,
  onClose,
  form,
  saving,
  onSave,
  fileInputRef,
  handleFiles,
  removeImage,
  formField,
}: CreateMedicalServiceProps) {
  const images = Array.isArray(form.images) ? form.images : [];
  const MAX_PREVIEW = 3;
  const previews = images.slice(0, MAX_PREVIEW);
  const extraCount = Math.max(0, images.length - MAX_PREVIEW);

  const departmentsRef = useRef<IDepartment[]>([]);

  const departmentQuery = useQuery({
    queryKey: ['department-list'],
    queryFn: () => ApiDepartment.getDepartments({ page: 1, limit: 100 }),
  });

  const departments: IDepartment[] = useMemo(
    () => departmentQuery.data?.departments || [],
    [departmentQuery.data]
  );

  useEffect(() => {
    if (departments && departments.length) departmentsRef.current = departments;
  }, [departments]);

  const currentDeptRooms = useMemo(() => {
    const list = departments.length ? departments : departmentsRef.current;
    const dep = list.find((d) => String(d.id) === String(form.departmentId));
    if (!dep) return [];
    const r = (dep as any).rooms ?? (dep as any).room;
    if (!r) return [];
    return Array.isArray(r) ? r : [r];
  }, [departments, form.departmentId]);

  useEffect(() => {
    if (!departments || departments.length === 0) return;
    if (
      form.departmentId === undefined ||
      form.departmentId === null ||
      form.departmentId === ''
    ) {
      const first = departments[0];
      formField('departmentId', first.id);
      const r = (first as any).rooms ?? (first as any).room;
      const firstRoom = Array.isArray(r) ? r[0] : r;
      if (firstRoom)
        formField(
          'roomId',
          firstRoom.id ??
            firstRoom.roomId ??
            firstRoom.uuid ??
            String(firstRoom)
        );
    }
  }, [departments]);
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onClose} />
      <form
        onSubmit={onSave}
        className="relative bg-white rounded-lg shadow-lg max-w-3xl mx-4 p-6 z-10 max-h-[100vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-800">
            {'Tạo dịch vụ mới'}
          </h3>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex flex-col text-sm text-gray-700">
            Tên
            <input
              required
              value={form.name ?? ''}
              onChange={(e) => formField('name', e.target.value)}
              className="mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          <label className="flex flex-col text-sm text-gray-700">
            Giá
            <input
              type="number"
              step="10000"
              required
              value={form.price ?? 0}
              onChange={(e) => formField('price', Number(e.target.value))}
              className="mt-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
            />
          </label>

          <label className="flex flex-col text-sm text-gray-700">
            Đơn vị
            <input
              value={form.unit ?? ''}
              onChange={(e) => formField('unit', e.target.value)}
              className="mt-1 px-3 py-2 border rounded-md"
            />
          </label>

          <label className="flex flex-col text-sm text-gray-700">
            Thời lượng (phút)
            <input
              type="number"
              value={form.durationMinutes ?? 0}
              onChange={(e) =>
                formField('durationMinutes', Number(e.target.value))
              }
              className="mt-1 px-3 py-2 border rounded-md"
            />
          </label>

          <label className="flex flex-col text-sm text-gray-700">
            Khoa
            <select
              value={form.departmentId ?? ''}
              onChange={(e) => {
                const v = e.target.value;
                formField('departmentId', v === '' ? null : Number(v));
                const dep = departments.find((d) => String(d.id) === String(v));
                if (dep) {
                  const r = (dep as any).rooms ?? (dep as any).room;
                  const firstRoom = Array.isArray(r) ? r[0] : r;
                  if (firstRoom)
                    formField(
                      'roomId',
                      firstRoom.id ??
                        firstRoom.roomId ??
                        firstRoom.uuid ??
                        String(firstRoom)
                    );
                } else {
                  formField('roomId', null);
                }
              }}
              className="mt-1 px-3 py-2 border rounded-md"
            >
              <option value="">-- Chọn khoa --</option>
              {(departments.length ? departments : departmentsRef.current).map(
                (d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                )
              )}
            </select>
          </label>

          {/* Room select */}
          <label className="flex flex-col text-sm text-gray-700">
            Phòng
            <select
              value={form.roomId ?? ''}
              onChange={(e) => formField('roomId', e.target.value)}
              className="mt-1 px-3 py-2 border rounded-md"
            >
              <option value="">-- Chọn phòng --</option>
              {currentDeptRooms.map((r: any) => (
                <option
                  key={r.id ?? r.roomId ?? r.uuid}
                  value={r.id ?? r.roomId ?? r.uuid}
                >
                  {r.name ?? r.number_room ?? r.id ?? r.roomId ?? r.uuid}
                </option>
              ))}
            </select>
            <small className="text-xs text-gray-400 mt-1">
              Phòng được lọc theo khoa
            </small>
          </label>

          <label className="col-span-1 md:col-span-2 flex flex-col text-sm text-gray-700">
            Mô tả
            <textarea
              rows={3}
              value={form.description ?? ''}
              onChange={(e) => formField('description', e.target.value)}
              className="mt-1 px-3 py-2 border rounded-md"
            />
          </label>

          <label className="col-span-1 md:col-span-2 flex flex-col text-sm text-gray-700">
            Ảnh (chọn nhiều ảnh)
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Chọn ảnh
              </button>
              <span className="text-sm text-gray-500">
                Bạn có thể chọn nhiều ảnh
              </span>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFiles}
                className="hidden"
              />
            </div>
            <div className="mt-3">
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 max-h-40 overflow-y-auto">
                {previews.map((u, i) => (
                  <div key={String(u) + i} className="relative group">
                    <img
                      src={u}
                      alt={`preview-${i}`}
                      className="w-full h-24 object-cover rounded-md border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      aria-label="remove image"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {extraCount > 0 && (
                  <div className="relative group">
                    <div className="w-full h-24 bg-gray-100 flex items-center justify-center rounded-md border text-sm text-gray-600">
                      +{extraCount} thêm
                    </div>
                  </div>
                )}
                {images.length === 0 && (
                  <div className="col-span-full text-sm text-gray-400">
                    Chưa có ảnh
                  </div>
                )}
              </div>
            </div>
          </label>

          <label className="flex flex-col text-sm text-gray-700">
            % áp dụng BHYT
            <input
              type="number"
              value={form.percentApplyHealthInsurance ?? 0}
              onChange={(e) =>
                formField('percentApplyHealthInsurance', Number(e.target.value))
              }
              className="mt-1 px-3 py-2 border rounded-md"
            />
          </label>

          <label className="flex flex-col text-sm text-gray-700">
            Hoạt động
            <select
              value={form.isActive ? '1' : '0'}
              onChange={(e) => formField('isActive', e.target.value === '1')}
              className="mt-1 px-3 py-2 border rounded-md"
            >
              <option value="1">Có</option>
              <option value="0">Không</option>
            </select>
          </label>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 bg-white border rounded-md text-sm hover:bg-gray-50"
          >
            Huỷ
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {saving ? 'Đang lưu...' : 'Lưu'}
          </button>
        </div>
      </form>
    </div>
  );
}
