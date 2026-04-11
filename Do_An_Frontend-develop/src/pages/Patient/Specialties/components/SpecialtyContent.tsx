import { useEffect, useState } from 'react';
import ServiceTab from '../DetailSpecialty/components/ServiceTab';
import DoctorsTab from '../DetailSpecialty/components/DoctorsTab';
import ApiDepartment from 'src/api/ApiDepartment';
import { IDepartment } from 'src/types/index';

interface SpecialtyContentProps {
  specialty: IDepartment;
}

const SpecialtyContent = ({ specialty }: SpecialtyContentProps) => {
  const [activeTab, setActiveTab] = useState<'services' | 'doctors'>(
    'services'
  );
  const [details, setDetails] = useState<IDepartment | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchSpecialtyDetails = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await ApiDepartment.getDepartmentById(
          (specialty as any).id
        );
        const dept = (res as any)?.data ?? res;
        if (!mounted) return;
        setDetails(dept ?? null);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message ?? String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchSpecialtyDetails();
    return () => {
      mounted = false;
    };
  }, [specialty.id]);

  const current = details ?? specialty;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <h2 className="text-2xl font-bold p-6">
        {(current.name ?? '').toUpperCase()}
      </h2>

      <div className="px-6">
        {loading && (
          <div className="text-gray-500 mb-4">
            Đang tải thông tin chuyên khoa...
          </div>
        )}
        {error && <div className="text-red-600 mb-4">Lỗi: {error}</div>}
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex px-6">
          <button
            onClick={() => setActiveTab('services')}
            className={`py-4 px-6 font-medium text-lg border-b-2 ${activeTab === 'services' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            DỊCH VỤ
          </button>
          <button
            onClick={() => setActiveTab('doctors')}
            className={`py-4 px-6 font-medium text-lg border-b-2 ${activeTab === 'doctors' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            BÁC SĨ
          </button>
        </nav>
      </div>
      <div className="p-6">
        {activeTab === 'services' ? (
          <ServiceTab specialty={current} />
        ) : (
          <DoctorsTab specialty={current} />
        )}
      </div>
    </div>
  );
};
export default SpecialtyContent;
