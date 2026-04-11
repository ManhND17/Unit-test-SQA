import React, { useEffect, useState, useRef } from 'react';
import Modal from '@src/components/Modal';
import Input from '@src/components/CommonInput';
import { Hash, Building2, Phone, X, Image } from 'lucide-react';
import {
  IDepartment,
  EDepartmentType,
  DepartmentTypeLabels,
  IStaff,
  IRoom,
} from '@src/types';
import ApiUpload from '@src/api/ApiUpload';

interface AddEditDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (department: {
    name: string;
    description: string | null;
    code: string;
    phone?: string;
    type: EDepartmentType;
    headId?: string | null;
    roomId?: string;
    deputyIds?: string[] | null;
    thumbnail?: string;
    images?: string[] | null;
  }) => void;
  department?: IDepartment | null;
  mode: 'create' | 'edit';
  availableStaff: IStaff[];
  availableRooms: IRoom[];
}

export function AddEditDepartmentModal({
  isOpen,
  onClose,
  onSubmit,
  department,
  mode,
  availableStaff,
  availableRooms,
}: AddEditDepartmentModalProps) {
  // remove AnyButton usage — render native buttons directly

  const defaultType = Object.values(EDepartmentType)[0] as EDepartmentType;

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    code: '',
    phone: '',
    type: defaultType,
    headId: '',
    roomId: '',
    deputyIds: [] as string[],
    images: [] as string[] | null,
    thumbnail: '' as string | null,
  });

  // dropdown state for room selector (to show a scrollable list instead of native long select)
  const [roomOpen, setRoomOpen] = useState(false);
  const roomDropdownRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!roomDropdownRef.current) return;
      if (!roomDropdownRef.current.contains(e.target as Node)) {
        setRoomOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // refs to keep File objects for upload and previous preview urls
  const selectedFilesRef = useRef<File[] | null>([]);
  const prevImageUrlsRef = useRef<string[]>([]);
  const thumbnailFileRef = useRef<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  useEffect(() => {
    if (department && mode === 'edit') {
      const depAny = department as any;
      const headId = department.head?.userId ?? '';
      const roomId = department.room?.id ?? '';
      const deputyIds = (department.deputies ?? [])
        .map((d) => d.staff?.userId ?? '')
        .filter((id) => id);
      const imagesArr = Array.isArray(depAny.images)
        ? depAny.images
        : Array.isArray(depAny.image)
          ? depAny.image
          : [];
      const thumb = depAny.thumbnail ?? depAny.thumb ?? '';

      setFormData({
        name: depAny.name ?? '',
        description: depAny.description ?? '',
        code: depAny.code ?? '',
        phone: depAny.phone ?? '',
        type: (depAny.type as EDepartmentType) ?? defaultType,
        headId: headId,
        roomId: roomId,
        deputyIds: deputyIds,
        images: imagesArr.slice(),
        thumbnail: thumb || null,
      });
      prevImageUrlsRef.current = imagesArr.slice();
      selectedFilesRef.current = [];
      thumbnailFileRef.current = null;
      setThumbnailPreview(thumb || null);
    } else {
      setFormData({
        name: '',
        description: '',
        code: '',
        phone: '',
        type: defaultType,
        headId: '',
        roomId: '',
        deputyIds: [],
        images: [],
        thumbnail: null,
      });
      prevImageUrlsRef.current = [];
      selectedFilesRef.current = [];
      thumbnailFileRef.current = null;
      setThumbnailPreview(null);
    }
    setErrors({});
  }, [department, mode, isOpen, defaultType]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.code?.trim()) newErrors.code = 'Mã khoa không được để trống';
    if (!formData.name?.trim()) newErrors.name = 'Tên khoa không được để trống';
    if (!formData.description?.trim())
      newErrors.description = 'Mô tả không được để trống';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // image handlers (from your snippet, adapted)
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

      const existing = Array.isArray(formData.images)
        ? [...formData.images]
        : [];
      const combined = [...existing, ...dataUrls];

      const existingFiles = Array.isArray(selectedFilesRef.current)
        ? [...selectedFilesRef.current]
        : [];
      const combinedFiles = [...existingFiles, ...files.map((f) => f)];
      selectedFilesRef.current = combinedFiles;
      prevImageUrlsRef.current = combined;
      setFormData((f) => ({ ...f, images: combined }));
      if (e.currentTarget) e.currentTarget.value = '';
    } catch (err) {
      if ((err as Error).message === 'SIZE') {
        alert('Kích thước ảnh không được vượt quá 2MB');
      } else {
        alert('Không thể đọc file ảnh');
      }
    }
  }

  function removeFormImage(idx: number) {
    setFormData((f) => {
      const images = Array.isArray(f.images) ? [...f.images] : [];
      images.splice(idx, 1);
      prevImageUrlsRef.current = images;
      if (Array.isArray(selectedFilesRef.current)) {
        selectedFilesRef.current.splice(idx, 1);
      }
      return { ...f, images };
    });
  }

  async function handleThumbnailFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const MAX_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      alert('Kích thước ảnh đại diện không được vượt quá 2MB');
      if (e.currentTarget) e.currentTarget.value = '';
      return;
    }
    const fr = new FileReader();
    fr.onload = () => {
      const dataUrl = String(fr.result);
      setFormData((f) => ({ ...f, thumbnail: dataUrl }));
      setThumbnailPreview(dataUrl);
    };
    fr.onerror = () => {
      alert('Không thể đọc file ảnh đại diện');
    };
    fr.readAsDataURL(file);
    thumbnailFileRef.current = file;
    if (e.currentTarget) e.currentTarget.value = '';
  }

  function removeThumbnail() {
    setFormData((f) => ({ ...f, thumbnail: null }));
    thumbnailFileRef.current = null;
    setThumbnailPreview(null);
  }

  const toggleDeputy = (userId: string) => {
    setFormData((prev) => ({
      ...prev,
      deputyIds: prev.deputyIds.includes(userId)
        ? prev.deputyIds.filter((id) => id !== userId)
        : [...prev.deputyIds, userId],
    }));
  };

  // helper to get a stable id for staff entries
  const getStaffId = (s: IStaff, idx: number) =>
    s.userId ?? s.user?.id ?? `staff-${idx}`;

  // only show deputies after a head is selected
  const availableDeputies = formData.headId
    ? availableStaff.filter((s) => (s.userId ?? s.user?.id) !== formData.headId)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);

    try {
      // upload images (if any new files)
      const images = Array.isArray(formData.images) ? [...formData.images] : [];
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

      // upload thumbnail if new file selected
      let finalThumbnail: string | undefined = undefined;
      if (thumbnailFileRef.current) {
        const res = await ApiUpload.uploadFiles([thumbnailFileRef.current]);
        finalThumbnail = (res[0] && res[0].url) || undefined;
      } else if (formData.thumbnail) {
        finalThumbnail = String(formData.thumbnail);
      }

      // call parent onSubmit with URLs
      onSubmit({
        name: formData.name,
        description: formData.description || null,
        code: formData.code,
        phone: formData.phone || undefined,
        type: formData.type,
        headId: formData.headId || null,
        roomId: formData.roomId || undefined,
        deputyIds: formData.deputyIds.length ? formData.deputyIds : undefined,
        thumbnail: finalThumbnail,
        images: finalImages.length ? finalImages : null,
      });

      // reset refs
      selectedFilesRef.current = [];
      prevImageUrlsRef.current = [];
      thumbnailFileRef.current = null;
      setThumbnailPreview(finalThumbnail ?? null);
    } catch (err) {
      alert('Có lỗi khi upload ảnh. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  const images = Array.isArray(formData.images) ? formData.images : [];
  const MAX_PREVIEW = 6;
  const previews = images.slice(0, MAX_PREVIEW);
  const extraCount = Math.max(0, images.length - MAX_PREVIEW);

  const selectedRoom =
    (availableRooms || []).find((r) => r.id === formData.roomId) ??
    (department as any)?.room ??
    null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={mode === 'create' ? 'Thêm khoa mới' : 'Chỉnh sửa thông tin khoa'}
    >
      <div className="w-full max-w-2xl mx-auto max-h-[80vh] overflow-y-auto p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mã khoa <span className="text-red-500">*</span>
              </label>
              <Input
                icon={Hash}
                placeholder="VD: KTM01"
                value={formData.code}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    code: e.target.value,
                  })
                }
                className={errors.code ? 'border-red-500' : ''}
                disabled={mode === 'edit'}
              />
              {errors.code && (
                <p className="text-red-500 text-sm mt-1">{errors.code}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại khoa <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    type: e.target.value as EDepartmentType,
                  })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B5FEF] focus:border-transparent"
              >
                {Object.values(EDepartmentType).map((type) => (
                  <option key={type} value={type}>
                    {DepartmentTypeLabels[type]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên khoa <span className="text-red-500">*</span>
            </label>
            <Input
              icon={Building2}
              placeholder="VD: Khoa Tim Mạch"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="Mô tả về khoa..."
              value={formData.description as string}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  description: e.target.value,
                })
              }
              className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B5FEF] focus:border-transparent ${errors.description ? 'border-red-500' : ''}`}
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <Input
                icon={Phone}
                placeholder="VD: 0241234567"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    phone: e.target.value,
                  })
                }
              />
            </div>

            {/* Room */}
            <div className="relative" ref={roomDropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phòng
              </label>
              <button
                type="button"
                onClick={() => setRoomOpen((v) => !v)}
                className="w-full text-left px-4 py-2 border border-gray-300 rounded-lg bg-white flex items-center justify-between"
              >
                <span className="truncate">
                  {selectedRoom
                    ? `${selectedRoom.name} - Tầng ${selectedRoom.floor}`
                    : 'Chưa gán phòng'}
                </span>
                <span className="text-sm text-gray-500">
                  {roomOpen ? '▲' : '▼'}
                </span>
              </button>

              {roomOpen && (
                <div className="absolute z-50 left-0 right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg max-h-48 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((f) => ({ ...f, roomId: '' }));
                      setRoomOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-gray-100"
                  >
                    Chưa gán phòng
                  </button>
                  {availableRooms.map((room, i) => (
                    <button
                      key={room.id ?? `room-${i}`}
                      type="button"
                      onClick={() => {
                        setFormData((f) => ({ ...f, roomId: room.id }));
                        setRoomOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 truncate"
                    >
                      {room.name} - Tầng {room.floor}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Head */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Trưởng khoa
            </label>
            {/*
              Nếu trưởng khoa hiện tại không có trong availableStaff,
              hiển thị 1 option fallback để giữ giá trị khi edit.
            */}
            <select
              value={formData.headId}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  headId: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#5B5FEF] focus:border-transparent"
            >
              <option value="">Chọn trưởng khoa</option>

              {/* fallback option if current head exists but not in availableStaff */}
              {(() => {
                const depAny: any = department;
                const currentHeadId =
                  depAny?.head?.userId ??
                  depAny?.head?.user?.id ??
                  depAny?.headId ??
                  '';
                const first =
                  depAny?.head?.user?.name?.firstName ??
                  depAny?.head?.doctor?.user?.name?.firstName ??
                  '';
                const last =
                  depAny?.head?.user?.name?.lastName ??
                  depAny?.head?.doctor?.user?.name?.lastName ??
                  '';
                const display = `${first} ${last}`.trim();
                const exists = availableStaff.some(
                  (s) => (s.userId ?? s.user?.id) === currentHeadId
                );
                if (currentHeadId && !exists) {
                  return (
                    <option
                      key={`head-fallback-${currentHeadId}`}
                      value={currentHeadId}
                    >
                      {display || 'Trưởng khoa hiện tại'}
                    </option>
                  );
                }
                return null;
              })()}

              {availableStaff.map((staff, i) => {
                const sid = getStaffId(staff, i);
                return (
                  <option key={sid} value={sid}>
                    {staff.user?.name?.firstName} {staff.user?.name?.lastName}
                  </option>
                );
              })}
            </select>
          </div>

          {/* Deputies */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phó khoa
            </label>
            <div className="border border-gray-200 rounded-lg p-3 bg-gray-50 max-h-48 overflow-y-auto">
              {availableDeputies.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Vui lòng chọn trưởng khoa trước
                </p>
              ) : (
                <div className="space-y-2">
                  {availableDeputies.map((staff, i) => {
                    const sid = getStaffId(staff, i);
                    const inputId = `dep-${sid}`;
                    return (
                      <label
                        key={sid}
                        htmlFor={inputId}
                        className="flex items-center gap-2 cursor-pointer hover:bg-white p-2 rounded transition-colors"
                      >
                        <input
                          id={inputId}
                          type="checkbox"
                          value={sid}
                          checked={formData.deputyIds.includes(sid)}
                          onChange={() => toggleDeputy(sid)}
                          className="w-4 h-4 text-[#5B5FEF] border-gray-300 rounded focus:ring-[#5B5FEF]"
                        />
                        <span className="text-sm text-gray-700">
                          {staff.user?.name?.firstName}{' '}
                          {staff.user?.name?.lastName}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            {/* show badges for selected deputyIds that are NOT in availableStaff (fallback) */}
            {formData.deputyIds.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.deputyIds.map((userId) => {
                  const staff = availableStaff.find(
                    (s) => (s.userId ?? s.user?.id) === userId
                  );
                  if (staff) {
                    return (
                      <span
                        key={userId}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                      >
                        {staff.user?.name?.firstName}{' '}
                        {staff.user?.name?.lastName}
                        <button
                          type="button"
                          onClick={() => toggleDeputy(userId)}
                          className="hover:bg-blue-200 rounded-full p-0.5"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    );
                  }
                  const depAny: any = department;
                  const fallback = (
                    depAny?.deputies ??
                    depAny?.departmentDeputies ??
                    []
                  ).find((d: any) => (d.userId ?? d.staff?.userId) === userId);
                  const display =
                    fallback?.staff?.user?.name?.firstName ??
                    fallback?.staff?.user?.name?.lastName ??
                    fallback?.user?.name?.firstName ??
                    fallback?.user?.name?.lastName ??
                    'Phó khoa hiện tại';
                  return (
                    <span
                      key={`dep-fb-${userId}`}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm"
                    >
                      {display}
                      <button
                        type="button"
                        onClick={() => toggleDeputy(userId)}
                        className="hover:bg-blue-200 rounded-full p-0.5"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Thumbnail & Images */}
          <div className="grid grid-cols-1 gap-4">
            {/* Thumbnail row (full width) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ảnh đại diện
              </label>
              <div className="flex items-center gap-4 w-full">
                <div className="flex-shrink-0">
                  {thumbnailPreview ? (
                    <div className="relative">
                      <img
                        src={thumbnailPreview}
                        alt="thumbnail"
                        className="w-32 h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={removeThumbnail}
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 border"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div className="w-32 h-20 flex items-center justify-center bg-gray-100 rounded text-gray-400">
                      <Image />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailFile}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Kích thước tối đa 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Images row (full width) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ảnh khác
              </label>
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <div className="flex items-center gap-3 mb-3">
                  <button
                    type="button"
                    onClick={() => {
                      const el = document.getElementById(
                        'dept-images-input'
                      ) as HTMLInputElement | null;
                      el?.click();
                    }}
                    className="px-3 py-1 bg-[#5B5FEF] text-white rounded-md text-sm hover:bg-[#4A4ED8]"
                  >
                    Chọn ảnh
                  </button>
                  <span className="text-sm text-gray-500">
                    Mỗi ảnh tối đa 2MB
                  </span>
                </div>

                <input
                  id="dept-images-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFormImageFiles}
                  className="hidden"
                />

                <div className="mt-1">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-56 overflow-y-auto">
                    {previews.map((u, i) => (
                      <div
                        key={`preview-${i}`}
                        className="relative group rounded-md overflow-hidden border"
                      >
                        <img
                          src={u}
                          alt={`preview-${i}`}
                          className="w-full h-28 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeFormImage(i)}
                          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          aria-label="remove image"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}

                    {extraCount > 0 && (
                      <div className="relative group rounded-md overflow-hidden border flex items-center justify-center">
                        <div className="w-full h-28 bg-gray-100 flex items-center justify-center text-sm text-gray-600">
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
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2 border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2 bg-[#5B5FEF] text-white hover:bg-[#4A4ED8] min-w-[120px]"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Đang lưu...
                </span>
              ) : mode === 'create' ? (
                'Thêm khoa'
              ) : (
                'Lưu thay đổi'
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
