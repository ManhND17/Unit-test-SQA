import { useEffect, useRef, useState } from 'react';
import { IDoctor } from '@src/types';

type DoctorSelectProps = {
  doctors: IDoctor[];
  value?: string | null;
  onChange: (id: string) => void;
};

export default function DoctorSelect({
  doctors,
  value,
  onChange,
}: DoctorSelectProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current) return;
      if (!ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  const selected = doctors.find(
    (d) => String(d.user?.id) === String(value ?? '')
  );

  function renderName(d: IDoctor) {
    const fn = d.user?.name?.firstName;
    const ln = d.user?.name?.lastName;
    const name = `${fn} ${ln}`.trim();
    return name;
  }

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 border rounded bg-white min-w-[220px] text-left"
      >
        <span className="flex-1 text-sm text-gray-700">
          {selected ? renderName(selected) : '-- Chọn bác sĩ --'}
        </span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div
          className="absolute z-50 mt-2 w-full bg-white border rounded shadow-lg"
          style={{ maxHeight: 320, overflow: 'auto' }}
        >
          <div className="py-1">
            {doctors && doctors.length > 0 ? (
              doctors.map((d) => {
                const id = String(d.user?.id);
                const isSel = id === String(value ?? '');
                return (
                  <div
                    key={id || Math.random()}
                    className={`px-3 py-2 text-sm flex justify-between items-center cursor-pointer hover:bg-gray-100 ${isSel ? 'bg-primary/10' : ''}`}
                    onClick={() => {
                      onChange(id);
                      setOpen(false);
                    }}
                  >
                    <div className="truncate">{renderName(d)}</div>
                    {isSel && (
                      <div className="text-xs text-gray-500">Đã chọn</div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500">
                Không có bác sĩ nào
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
