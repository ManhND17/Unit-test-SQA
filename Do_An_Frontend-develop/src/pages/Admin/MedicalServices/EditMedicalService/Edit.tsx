import React, { useEffect, useRef, useState, useMemo } from 'react';
import {
  IMedicalService,
  IDoctorService,
  IDoctor,
  IDepartment,
} from '@src/types';
import ApiMedicalService from '@src/api/ApiMedicalService';
import ApiDoctor from '@src/api/ApiDoctor';
import ApiDepartment from '@src/api/ApiDepartment';
import ApiUpload from '@src/api/ApiUpload';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';

export default function MedicalServiceEdit() {
  const [saving, setSaving] = useState(false);
  // keep selected File objects parallel to service.images (same index)
  const selectedFilesRef = useRef<(File | null)[]>([]);

  const [newDs, setNewDs] = useState({
    doctorId: '',
    price: 0,
    durationMinutes: 0,
    isActive: true,
  });

  // modal confirm state for deleting doctor-service config
  const [confirmDelete, setConfirmDelete] = useState<{
    doctorId: string;
    serviceId: string;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const prevImageUrlsRef = useRef<string[]>([]);
  const [service, setService] = useState<IMedicalService | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const id = location.state;

  const MedicalService = useQuery({
    queryKey: ['medical-service', id],
    queryFn: () => ApiMedicalService.getMedicalServiceById(String(id)),
    enabled: !!id,
  });

  const DoctorList = useQuery({
    queryKey: ['doctor-list-department', MedicalService.data?.departmentId],
    queryFn: () =>
      ApiDoctor.getDoctorsByDepartment(
        String(MedicalService.data?.departmentId ?? '')
      ),
    enabled: !!MedicalService.data?.departmentId,
  });

  const doctorArray: IDoctor[] = DoctorList.data?.data ?? [];
  useEffect(() => {
    if (doctorArray.length > 0 && !newDs.doctorId) {
      setNewDs((v) => ({ ...v, doctorId: doctorArray[0].user?.id ?? '' }));
    }
  }, [doctorArray]);

  useEffect(() => {
    const fetched = MedicalService.data as IMedicalService | undefined;
    if (!fetched) return;
    const images = Array.isArray(fetched.images)
      ? (fetched.images as string[])
      : String(fetched.images ?? '')
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean);
    prevImageUrlsRef.current = images;
    // no selected files for existing remote urls
    selectedFilesRef.current = images.map(() => null);
    setService({ ...fetched, images });
  }, [MedicalService.data]);
  const departmentQuery = useQuery({
    queryKey: ['department-list'],
    queryFn: () => ApiDepartment.getDepartments({ page: 1, limit: 100 }),
  });
  const departments = useMemo(
    () => departmentQuery.data?.departments ?? [],
    [departmentQuery.data?.departments]
  );
  const departmentsRef = useRef<IDepartment[]>([]);

  useEffect(() => {
    if (departments && departments.length) departmentsRef.current = departments;
  }, [departments]);

  const currentDeptRooms = useMemo(() => {
    const list = departments.length ? departments : departmentsRef.current;
    const dep = list.find(
      (d: any) => String(d.id ?? d._id) === String(service?.departmentId ?? '')
    );
    if (!dep) return [];
    const r = (dep as any).rooms ?? (dep as any).room;
    if (!r) return [];
    return Array.isArray(r) ? r : [r];
  }, [departments, service?.departmentId]);

  const [deptOpen, setDeptOpen] = useState(false);
  const selectedDept = departments.find(
    (d: any) => String(d.id ?? d._id) === String(service?.departmentId ?? '')
  );
  const selectedDeptName = selectedDept
    ? (selectedDept.name ?? String(selectedDept.id))
    : '-- Chọn khoa --';
  useEffect(() => {
    return () => {
      prevImageUrlsRef.current.forEach((u) => {
        try {
          URL.revokeObjectURL(u);
        } catch {
          /* ignore */
        }
      });
      prevImageUrlsRef.current = [];
      selectedFilesRef.current = [];
    };
  }, []);

  if (MedicalService.isLoading) return <div className="p-6">Đang tải...</div>;
  if (!service)
    return <div className="p-6 text-red-500">Không tìm thấy dịch vụ</div>;

  const dsList = (service?.doctorServices ?? []) as any[];

  function updateField<K extends keyof IMedicalService>(key: K, value: any) {
    setService((s) => (s ? { ...s, [key]: value } : s));
  }
  function handleImageFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const MAX_SIZE = 2 * 1024 * 1024; // 2MB per file
    const newUrls: string[] = [];
    const newFiles: File[] = [];
    for (const f of files) {
      if (f.size > MAX_SIZE) {
        toast.error('Kích thước ảnh không được vượt quá 2MB');
        continue;
      }
      const obj = URL.createObjectURL(f);
      newUrls.push(obj);
      newFiles.push(f);
    }
    if (newUrls.length === 0) return;

    setService((s) => {
      const imgs = Array.isArray(s?.images) ? [...(s!.images as string[])] : [];
      const combined = [...imgs, ...newUrls];
      prevImageUrlsRef.current = combined;
      // append files parallel to images
      const existingFiles = Array.isArray(selectedFilesRef.current)
        ? [...selectedFilesRef.current]
        : [];
      selectedFilesRef.current = [...existingFiles, ...newFiles.map((f) => f)];
      return s ? { ...s, images: combined } : s;
    });

    if (e.currentTarget) e.currentTarget.value = '';
  }

  function removeServiceImage(idx: number) {
    setService((s) => {
      if (!s) return s;
      const imgs = Array.isArray(s.images) ? [...s.images] : [];
      const [removed] = imgs.splice(idx, 1);
      if (Array.isArray(selectedFilesRef.current)) {
        if (removed && removed.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(removed);
          } catch {
            toast.error('Lỗi khi xóa ảnh tạm');
          }
        }
      } else {
        if (removed && removed.startsWith('blob:')) {
          try {
            URL.revokeObjectURL(removed);
          } catch {
            toast.error('Lỗi khi xóa ảnh tạm');
          }
        }
      }
      prevImageUrlsRef.current = imgs;
      return { ...s, images: imgs };
    });
  }

  async function addDoctorService() {
    if (!newDs?.doctorId) return;
    const exists = dsList.find((d) => d.doctorId === newDs.doctorId);
    if (exists) {
      toast.error('Đã có cấu hình cho bác sĩ này');
      return;
    }
    const entry = {
      doctorId: newDs.doctorId,
      medicalServiceId: service!.id,
      price: Number(newDs.price),
      durationMinutes: Number(newDs.durationMinutes),
    };

    try {
      const res = await ApiMedicalService.createDoctorService(entry);
      setService(res);
      toast.success('Thêm cấu hình bác sĩ thành công');
    } catch (err: any) {
      toast.error(
        'Lỗi khi thêm cấu hình bác sĩ: ' + (err?.message ?? String(err))
      );
    }
  }

  // called when user confirms in modal
  async function handleDeleteConfirmed() {
    if (!confirmDelete) return;
    const { doctorId, serviceId } = confirmDelete;
    try {
      const res = await ApiMedicalService.deleteDoctorService(
        doctorId,
        serviceId
      );
      if (res) {
        setService(res);
      } else {
        updateField(
          'doctorService' as any,
          dsList.filter((d) => String(d.doctorId) !== String(doctorId))
        );
      }
      toast.success('Xóa cấu hình bác sĩ thành công');
    } catch (err: any) {
      const msg = err?.errorMessage ?? err?.message ?? String(err);
      if (
        String(msg).includes('Data is empty') ||
        String(msg).toLowerCase().includes('no content') ||
        String(msg).includes('204')
      ) {
        updateField(
          'doctorService' as any,
          dsList.filter((d) => String(d.doctorId) !== String(doctorId))
        );
        toast.success('Xóa cấu hình bác sĩ thành công');
      } else {
        toast.error('Lỗi khi xóa cấu hình bác sĩ: ' + (msg ?? ''));
      }
    } finally {
      setConfirmDelete(null);
    }
  }

  async function handleSave(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!service?.name || (service.price ?? 0) < 0) {
      alert('Vui lòng nhập tên và giá hợp lệ');
      return;
    }
    setSaving(true);
    try {
      const images = Array.isArray(service.images) ? [...service.images] : [];
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

      const normalized = {
        images: finalImages.filter(Boolean),
        roomId: service.roomId ?? null,
        name: String(service.name),
        description: service.description ?? null,
        price: Number(service.price ?? 0),
        unit: service.unit ?? undefined,
        durationMinutes: Number(service.durationMinutes ?? 0),
        isActive: Boolean(service.isActive),
        percentApplyHealthInsurance: Number(
          service.percentApplyHealthInsurance ?? 0
        ),
        departmentId: service!.departmentId ?? null,
        createdAt: service!.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await ApiMedicalService.updateMedicalService(id, normalized);
      toast.success('Cập nhật dịch vụ thành công');
      navigate('/admin/medical-services/detail', { state: id });
    } catch (err: any) {
      alert('Lỗi khi lưu: ' + (err?.message ?? err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className=" mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Chỉnh sửa dịch vụ
            </h1>
            <p className="text-sm text-gray-500">
              Cập nhật thông tin và cấu hình theo bác sĩ
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => navigate('/admin/medical-services/')}
              className="px-3 py-1 bg-white border rounded-md hover:bg-gray-50"
            >
              Danh sách
            </button>
            <button
              onClick={() =>
                navigate('/admin/medical-services/detail', { state: id })
              }
              className="px-3 py-1 bg-white border rounded-md hover:bg-gray-50"
            >
              Xem
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSave}
          className="bg-white rounded-lg shadow p-6 space-y-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">Tên</span>
              <input
                value={service.name ?? ''}
                onChange={(e) => updateField('name', e.target.value)}
                className="mt-2 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">
                Giá (VNĐ)
              </span>
              <input
                type="number"
                step="10000"
                value={service.price ?? 0}
                onChange={(e) => updateField('price', Number(e.target.value))}
                className="mt-2 px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-indigo-200"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">Đơn vị</span>
              <input
                value={service.unit ?? ''}
                onChange={(e) => updateField('unit', e.target.value)}
                className="mt-2 px-3 py-2 border rounded-md"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">
                Thời lượng (phút)
              </span>
              <input
                type="number"
                value={service.durationMinutes ?? 0}
                onChange={(e) =>
                  updateField('durationMinutes', Number(e.target.value))
                }
                className="mt-2 px-3 py-2 border rounded-md"
              />
            </label>

            <label className="flex flex-col relative">
              <span className="text-sm font-medium text-gray-700">Khoa</span>
              <div className="mt-2 relative">
                <button
                  type="button"
                  onClick={() => setDeptOpen((v) => !v)}
                  className="w-full text-left px-3 py-2 border rounded-md bg-white flex justify-between items-center"
                >
                  <span className="truncate">{selectedDeptName}</span>
                  <span className="ml-2 text-gray-500">▾</span>
                </button>

                {deptOpen && (
                  <ul className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-sm max-h-48 overflow-y-auto z-20">
                    <li
                      className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        updateField('departmentId', '');
                        setDeptOpen(false);
                      }}
                    >
                      -- Chọn khoa --
                    </li>
                    {departments.map((d: any) => (
                      <li
                        key={d.id ?? d._id}
                        className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => {
                          updateField('departmentId', d.id ?? d._id);
                          setDeptOpen(false);
                          const r = (d as any).rooms ?? (d as any).room;
                          const firstRoom = Array.isArray(r) ? r[0] : r;
                          if (firstRoom)
                            updateField(
                              'roomId',
                              firstRoom.id ??
                                firstRoom.roomId ??
                                firstRoom.uuid ??
                                String(firstRoom)
                            );
                        }}
                      >
                        {d.name ?? d.title ?? String(d.id ?? d._id)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">Phòng</span>
              <select
                className="mt-2 px-3 py-2 border rounded-md"
                value={service?.roomId ?? ''}
                onChange={(e) => updateField('roomId', e.target.value)}
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

            <label className="col-span-1 md:col-span-2 flex flex-col">
              <span className="text-sm font-medium text-gray-700">Mô tả</span>
              <textarea
                value={service.description ?? ''}
                onChange={(e) => updateField('description', e.target.value)}
                className="mt-2 px-3 py-2 border rounded-md"
                rows={4}
              />
            </label>

            <label className="col-span-1 md:col-span-2 flex flex-col">
              <span className="text-sm font-medium text-gray-700">
                Ảnh (chọn nhiều ảnh)
              </span>
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Chọn ảnh
                </button>
                <span className="text-sm text-gray-500">
                  Bạn có thể kéo thả hoặc chọn nhiều ảnh
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageFiles}
                  className="hidden"
                />
              </div>

              <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {(() => {
                  const images = Array.isArray(service?.images)
                    ? (service.images as string[])
                    : [];
                  const MAX_PREVIEW = 3;
                  const previews = images.slice(0, MAX_PREVIEW);
                  const extraCount = Math.max(0, images.length - MAX_PREVIEW);
                  if (images.length === 0) {
                    return (
                      <div className="col-span-full text-sm text-gray-400">
                        Chưa có ảnh
                      </div>
                    );
                  }
                  return (
                    <>
                      {previews.map((u, i) => (
                        <div key={String(u) + i} className="relative group">
                          <img
                            src={u}
                            alt={`preview-${i}`}
                            className="w-full h-24 object-cover rounded-md border"
                          />
                          <button
                            type="button"
                            onClick={() => removeServiceImage(i)}
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
                    </>
                  );
                })()}
              </div>
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">% BHYT</span>
              <input
                type="number"
                value={service.percentApplyHealthInsurance ?? 0}
                onChange={(e) =>
                  updateField(
                    'percentApplyHealthInsurance',
                    Number(e.target.value)
                  )
                }
                className="mt-2 px-3 py-2 border rounded-md"
              />
            </label>

            <label className="flex flex-col">
              <span className="text-sm font-medium text-gray-700">
                Hoạt động
              </span>
              <select
                value={service.isActive ? '1' : '0'}
                onChange={(e) =>
                  updateField('isActive', e.target.value === '1')
                }
                className="mt-2 px-3 py-2 border rounded-md"
              >
                <option value="1">Có</option>
                <option value="0">Không</option>
              </select>
            </label>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium">Cấu hình theo bác sĩ</h3>
            <p className="text-sm text-gray-500 mt-1">
              Thiết lập giá và thời gian riêng cho từng bác sĩ (nếu có)
            </p>

            <div className="mt-4 grid gap-3">
              {/* doctor cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(service?.doctorServices ?? []).length ? (
                  (service!.doctorServices ?? []).map((ds: IDoctorService) => {
                    const name =
                      `${ds.doctor?.staff?.user?.name?.firstName ?? ''} ${ds.doctor?.staff?.user?.name?.lastName ?? ''}`.trim() ||
                      ds.doctorId;
                    const avatar = ds.doctor?.staff?.user?.avatar || '';
                    const itemKey =
                      ds.doctorId ??
                      (ds as any).id ??
                      `${ds.doctorId ?? 'doc'}-${ds.medicalServiceId ?? service?.id}`;
                    return (
                      <div
                        key={itemKey}
                        className="flex items-center gap-3 p-3 rounded-lg border bg-white shadow-sm"
                      >
                        <div className="w-12 h-12 rounded-full bg-gray-100 overflow-hidden flex-shrink-0">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              MD
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-sm font-medium text-gray-800 truncate">
                              {name}
                            </div>
                            <div
                              className={`text-xs px-2 py-1 rounded-full ${ds.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
                            >
                              {ds.isActive ? 'Hoạt động' : 'Không hoạt động'}
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 mt-1">
                            Giá:{' '}
                            <span className="text-gray-800 font-semibold">
                              {Number(ds.price).toLocaleString()} đ
                            </span>{' '}
                            • <span>{ds.durationMinutes} phút</span>
                          </div>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setConfirmDelete({
                                doctorId: ds.doctorId,
                                serviceId: id,
                              })
                            }
                            className="text-red-600 hover:underline text-sm"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-sm text-gray-500">
                    Chưa có cấu hình theo bác sĩ
                  </div>
                )}
              </div>

              {/* add doctor inline form */}
              <div className="mt-2 bg-white border rounded-lg p-3 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-end">
                  <div className="md:col-span-2">
                    <label className="text-sm text-gray-700">Bác sĩ</label>
                    <select
                      className="mt-1 w-full px-3 py-2 border rounded-md"
                      value={newDs.doctorId}
                      onChange={(e) =>
                        setNewDs((v) => ({ ...v, doctorId: e.target.value }))
                      }
                    >
                      {doctorArray.map((d: IDoctor) => (
                        <option key={d.user?.id} value={d.user?.id}>
                          {d.user?.name?.firstName} {d.user?.name?.lastName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">Giá</label>
                    <input
                      type="number"
                      className="mt-1 w-full px-3 py-2 border rounded-md"
                      value={newDs.price}
                      onChange={(e) =>
                        setNewDs((v) => ({
                          ...v,
                          price: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-700">
                      Thời gian (phút)
                    </label>
                    <input
                      type="number"
                      className="mt-1 w-full px-3 py-2 border rounded-md"
                      value={newDs.durationMinutes}
                      onChange={(e) =>
                        setNewDs((v) => ({
                          ...v,
                          durationMinutes: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-700 block">
                      Trạng thái
                    </label>
                    <div className="mt-1">
                      <label className="inline-flex items-center gap-2">
                        <input
                          type="checkbox"
                          className="rounded"
                          checked={newDs.isActive}
                          onChange={(e) =>
                            setNewDs((v) => ({
                              ...v,
                              isActive: e.target.checked,
                            }))
                          }
                        />
                        <span className="text-sm text-gray-600">Hoạt động</span>
                      </label>
                    </div>
                  </div>
                  <div className="md:col-span-1">
                    <button
                      type="button"
                      onClick={addDoctorService}
                      className="w-full px-3 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Thêm
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-2">
            <button
              type="button"
              onClick={() =>
                (window.location.href = `/admin/medical-services/detail?id=${service?.id}`)
              }
              className="px-4 py-2 border rounded-md bg-white hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {saving ? 'Đang lưu...' : 'Lưu và quay về'}
            </button>
          </div>
        </form>
      </div>

      {/* Delete confirmation modal */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-30"></div>
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm mx-auto z-10">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Xác nhận xóa
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Bạn có chắc chắn muốn xóa cấu hình của bác sĩ này? Hành động này
              không thể hoàn tác.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteConfirmed}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
