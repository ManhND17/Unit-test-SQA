import ApiDepartment from '@api/ApiDepartment';
import QUERY_KEY from '@api/QueryKey';
import { Breadcrumbs, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import { useState } from 'react';
import ServiceTab from './components/ServiceTab';
import DoctorsTab from './components/DoctorsTab';

export default function DetailSpecialty() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState(0);
  const { data: specialty, isLoading: isLoadingSpecialty } = useQuery({
    queryKey: [QUERY_KEY.DEPARMENT.GET_DEPARTMENT_BY_ID, id],
    queryFn: () => ApiDepartment.getDepartmentById(id || ''),
    enabled: !!id,
  });

  const breadcrumbs = [
    <Link key="1" to="/" className="font-normal text-black">
      Trang chủ
    </Link>,
    <Link key="2" to={'/specialties'} className="font-normal text-black">
      Chuyên khoa
    </Link>,
    <Typography key="3" sx={{ fontWeight: 700, color: 'black' }}>
      {specialty?.name}
    </Typography>,
  ];

  return (
    <div className="px-8 py-6">
      <Breadcrumbs separator="›" aria-label="breadcrumb">
        {breadcrumbs}
      </Breadcrumbs>
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 mt-[50px]">
        {isLoadingSpecialty ? (
          <Skeleton variant="text" width={120} height={32} />
        ) : (
          <div>
            <h2 className="text-2xl font-bold md:p-6 leading-8">
              {(specialty?.name ?? '').toUpperCase()}
            </h2>
          </div>
        )}
        <div className="border-b border-gray-200">
          <nav className="flex md:px-6">
            <button
              onClick={() => setActiveTab(0)}
              className={`py-4 px-6 font-medium text-lg border-b-2 ${activeTab === 0 ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              THÔNG TIN
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`py-4 px-6 font-medium text-lg border-b-2 ${activeTab === 1 ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            >
              BÁC SĨ
            </button>
          </nav>
        </div>
        <div className="pt-6 md:p-6">
          {isLoadingSpecialty ? (
            <Skeleton variant="rectangular" width="100%" height={500} />
          ) : !specialty ? (
            'Không tìm được dữ liệu. Vui lòng thử lại sau.'
          ) : (
            <>
              <div className={activeTab === 0 ? '' : 'hidden'}>
                <ServiceTab specialty={specialty} />
              </div>
              <div className={activeTab === 1 ? '' : 'hidden'}>
                <DoctorsTab departmentId={specialty.id} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
