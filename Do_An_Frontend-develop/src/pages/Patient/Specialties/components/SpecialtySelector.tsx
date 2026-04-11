import { useMemo, useState } from 'react';
import { IDepartment } from 'src/types/index';

interface SpecialtySelectorProps {
  specialties: IDepartment[];
  selectedSpecialty: IDepartment | null;
  onSpecialtyChange: (specialtyId: number) => void;
}
const SpecialtySelector = ({
  specialties,
  selectedSpecialty,
  onSpecialtyChange,
}: SpecialtySelectorProps) => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 6; // số item mỗi trang

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return specialties;
    return specialties.filter((s) => {
      return (
        s.name?.toLowerCase().includes(q) ||
        // s.services.some(serv => serv.toLowerCase().includes(q)) ||
        s.description?.toLowerCase().includes(q)
      );
    });
  }, [specialties, query]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  const goTo = (p: number) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
  };

  const handleSelect = (id: number) => {
    onSpecialtyChange(id);
  };

  return (
    <section className="mb-8">
      <h1 className="text-3xl font-bold mb-2">Tìm hiểu các Chuyên khoa</h1>
      <p className="text-gray-600 mb-4">
        Chọn chuyên khoa bằng cách nhấp vào thẻ bên dưới. Sử dụng thanh tìm kiếm
        hoặc phân trang để lọc.
      </p>

      <div className="mb-4 flex gap-3">
        <input
          type="search"
          placeholder="Tìm theo tên, dịch vụ, mô tả..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
          }}
        />
        <div className="flex items-center text-sm text-gray-600">
          <span className="whitespace-nowrap">Kết quả: {filtered.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {visible.length === 0 ? (
          <div className="col-span-full p-6 text-center text-gray-500 bg-white border rounded">
            Không tìm thấy chuyên khoa phù hợp.
          </div>
        ) : (
          visible.map((s) => (
            <button
              key={s.id}
              onClick={() => handleSelect(s.id)}
              className={`flex flex-col items-start text-left bg-white border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition p-0 focus:outline-none ${selectedSpecialty?.id === s.id ? 'ring-2 ring-blue-500 border-blue-200' : 'border-gray-100'}`}
              aria-pressed={selectedSpecialty?.id === s.id}
            >
              <div className="mx-auto w-[110px] h-[110px] p-[15px] rounded-full border-[5px] border-[#1692E3] overflow-hidden bg-gray-100 box-border mt-4">
                <img
                  src={(s as any).thumbnail || '/images/default-specialty.png'}
                  alt={s.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = '/images/default-specialty.png';
                  }}
                />
              </div>
              <div className="px-4 pb-4 w-full">
                <h3 className="font-semibold text-lg mt-3 text-center">
                  {s.name}
                </h3>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {s.description}
                </p>
                <div className="mt-3 text-sm text-gray-600">
                  <span className="font-medium">
                    {(s as any).totalServices ?? (s as any).totalService ?? 0}
                  </span>{' '}
                  dịch vụ
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Trang {page} / {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => goTo(page - 1)}
            disabled={page === 1}
            className="px-3 py-1 rounded border bg-white disabled:opacity-50"
          >
            Trước
          </button>

          {/* simple numeric pages (hiển thị tối đa 5 trang quanh trang hiện tại) */}
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
              // calc page number to show: center current page when possible
              const half = Math.floor(Math.min(totalPages, 5) / 2);
              const start = Math.max(
                1,
                Math.min(page - half, totalPages - Math.min(totalPages, 5) + 1)
              );
              const pnum = start + idx;
              return (
                <button
                  key={pnum}
                  onClick={() => goTo(pnum)}
                  className={`px-3 py-1 rounded ${pnum === page ? 'bg-blue-600 text-white' : 'bg-white border'}`}
                >
                  {pnum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => goTo(page + 1)}
            disabled={page === totalPages}
            className="px-3 py-1 rounded border bg-white disabled:opacity-50"
          >
            Sau
          </button>
        </div>
      </div>
    </section>
  );
};
export default SpecialtySelector;
