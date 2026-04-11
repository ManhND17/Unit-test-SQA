import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { InsuranceSection } from './components/InsuranceSection';
import { IHealthInsurance } from '@src/types';
import { UsedMedicalServices } from './components/UsedMedicalServices';
import { MedicineTable } from './components/MedicineTable';
import { PaymentSummary } from './components/PaymentSummary';
import { useMutation, useQuery } from '@tanstack/react-query';
import QUERY_KEY from '@src/api/QueryKey';
import ApiInvoice, { UpdatePurchasedMedicinesBody } from '@src/api/ApiInvoice';
import { Skeleton } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setPaymentInfo } from '@src/redux/slices/PaymentSlice';
import ApiPrescription from '@src/api/ApiPrescription';

export default function InvoiceDetailPage() {
  const navigate = useNavigate();
  const { id: invoiceId } = useParams();
  const dispatch = useDispatch();
  const [selectedMedicines, setSelectedMedicines] = useState<string[]>([]);
  const [selectedInsurance, setSelectedInsurance] =
    useState<Partial<IHealthInsurance> | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEY.INVOICE.GET_INVOICE_BY_ID, invoiceId],
    queryFn: () => ApiInvoice.getDetailInvoice(invoiceId!),
    enabled: !!invoiceId,
  });

  useEffect(() => {
    if (data?.healthInsurance) {
      setSelectedInsurance(data.healthInsurance);
    }
  }, [data?.healthInsurance]);

  const toggleMedicineMutation = useMutation({
    mutationFn: (payload: UpdatePurchasedMedicinesBody) => {
      return ApiPrescription.togglePurchasedMedicines(payload);
    },
  });

  const userId = data?.userId;
  const disableEdit = data?.status === 'paid' || data?.status === 'cancelled';

  useEffect(() => {
    if (data?.prescriptions) {
      const purchasedMedicineIds = data.prescriptions.flatMap((prescription) =>
        (prescription?.medicineUsages || [])
          .filter((medicine) => medicine.isPurchased)
          .map((medicineUsage) => medicineUsage.id)
      );
      setSelectedMedicines(purchasedMedicineIds);
    }
    if (data?.healthInsurance) {
      setSelectedInsurance(data.healthInsurance);
    }
  }, [data?.prescriptions]);

  // Calculate services with insurance coverage
  const servicesWithCoverage = useMemo(() => {
    if (!data?.visitServices) return [];

    return data.visitServices.map((service) => {
      const total = service.price * 1; // quantity is always 1 for services

      // Calculate insurance payment - only when insurance is selected
      let insurancePays = 0;

      if (selectedInsurance) {
        // Take minimum of percentApplyHealthInsurance and coverage
        // Formula: insurancePays = total × min(percentApply, coverage) / 100
        const percentApply =
          service.medicalService?.percentApplyHealthInsurance || 0;
        const insuranceCoverage = selectedInsurance.coverage || 0;
        const effectivePercent = Math.min(percentApply, insuranceCoverage);
        insurancePays = Math.round((total * effectivePercent) / 100);
      }

      const patientPays = total - insurancePays;

      return {
        id: service.id,
        name: service.medicalService?.name ?? 'Dịch vụ',
        unitPrice: service.price,
        quantity: 1,
        total,
        insurancePays,
        patientPays,
      };
    });
  }, [data?.visitServices, selectedInsurance?.id]);

  // Calculate medicines with insurance coverage - flatten prescriptions
  const medicinesWithCoverage = useMemo(() => {
    if (!data?.prescriptions) return [];

    // Flatten all medicines from all prescriptions
    const allMedicines = data.prescriptions.flatMap((prescription) =>
      (prescription?.medicineUsages || []).map((medicine) => {
        const total = medicine.price * medicine.quantity;

        // Calculate insurance payment - only when insurance is selected
        let insurancePays = 0;

        if (selectedInsurance) {
          const insuranceCoverage = selectedInsurance.coverage || 0;
          insurancePays = Math.round((total * insuranceCoverage) / 100);
        }

        const patientPays = total - insurancePays;

        return {
          id: medicine.id,
          name: medicine.medicine?.name || 'Thuốc',
          unit: medicine.medicine?.unit || 'Viên',
          quantity: medicine.quantity,
          unitPrice: medicine.price,
          total,
          insurancePays,
          patientPays,
          isPurchased: medicine.isPurchased || true,
          prescriptionId: prescription.id,
        };
      })
    );

    return allMedicines;
  }, [data?.prescriptions, selectedInsurance?.id]);

  const handleMedicineToggle = (medicineId: string) => {
    setSelectedMedicines((prev) =>
      prev.includes(medicineId)
        ? prev.filter((id) => id !== medicineId)
        : [...prev, medicineId]
    );
  };

  const handlePayment = async () => {
    const purchasedMedicineIds = selectedMedicines;
    const unPurchasedMedicineIds = medicinesWithCoverage
      .filter((med) => !selectedMedicines.includes(med.id))
      .map((med) => med.id);

    const promiseArray: Promise<any>[] = [];

    if (purchasedMedicineIds.length > 0) {
      promiseArray.push(
        toggleMedicineMutation.mutateAsync({
          medicineUsageIds: purchasedMedicineIds,
        })
      );
    }

    if (unPurchasedMedicineIds.length > 0) {
      promiseArray.push(
        toggleMedicineMutation.mutateAsync({
          medicineUsageIds: unPurchasedMedicineIds,
        })
      );
    }

    await Promise.all(promiseArray).then(() => {
      if (!invoiceId || !data?.patientId || !data?.patient?.fullName) {
        alert('Thiếu thông tin hóa đơn. Vui lòng thử lại.');
        return;
      }

      if (totals.patientTotal <= 0) {
        alert('Số tiền thanh toán không hợp lệ.');
        return;
      }

      // Save payment info to Redux
      dispatch(
        setPaymentInfo({
          // Invoice information
          invoiceId,
          patientId: data.patientId,
          patientName: data.patient.fullName,

          // Financial details
          servicesTotal: totals.servicesTotal,
          medicineTotal: totals.medicineTotal,
          subtotal: totals.servicesTotal + totals.medicineTotal,
          insurancePayment: totals.totalInsurancePayment,
          discount: totals.discount,
          totalAmount: totals.patientTotal,

          // Insurance information
          selectedInsurance,
          insuranceId: selectedInsurance?.id || null,
          insuranceCoverage: selectedInsurance?.coverage || 0,

          // Selected medicines
          selectedMedicineIds: selectedMedicines,

          // Metadata
          createdAt: new Date().toISOString(),
        })
      );

      // Navigate to payment page
      navigate('/admin/payment/checkout');
    });
  };

  // Calculate totals based on services and selected medicines
  const totals = useMemo(() => {
    const servicesTotal = servicesWithCoverage.reduce(
      (sum, service) => sum + service.total,
      0
    );

    const selectedMeds = medicinesWithCoverage.filter((med) =>
      selectedMedicines.includes(med.id)
    );

    const medicineTotal = selectedMeds.reduce((sum, med) => sum + med.total, 0);

    const servicesInsurancePayment = servicesWithCoverage.reduce(
      (sum, service) => sum + service.insurancePays,
      0
    );

    const medicineInsurancePayment = selectedMeds.reduce(
      (sum, med) => sum + med.insurancePays,
      0
    );

    const totalInsurancePayment =
      servicesInsurancePayment + medicineInsurancePayment;

    const discount = data?.discountAmount || 0;

    const patientTotal =
      servicesTotal + medicineTotal - totalInsurancePayment - discount;

    return {
      servicesTotal,
      medicineTotal,
      totalInsurancePayment,
      discount,
      patientTotal,
    };
  }, [
    servicesWithCoverage,
    medicinesWithCoverage,
    selectedMedicines,
    data?.discountAmount,
  ]);

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-4">
            <button
              onClick={() => navigate('/')}
              className="hover:text-blue-600 transition-colors"
            >
              Trang chủ
            </button>
            <span>/</span>
            <button
              onClick={() => navigate('/admin/invoices')}
              className="hover:text-blue-600 transition-colors"
            >
              Hóa đơn
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">
              Hóa đơn {data?.patientId || '...'}
            </span>
          </nav>
          <div className="flex items-center gap-4">
            <h2 className="text-3xl font-bold text-gray-900">
              Chi tiết Hóa đơn
            </h2>
            {data?.status === 'paid' && (
              <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                Đã thanh toán
              </span>
            )}
            {data?.status === 'pending' && (
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                Chờ thanh toán
              </span>
            )}
            {data?.status === 'cancelled' && (
              <span className="px-3 py-1 bg-red-100 text-red-800 text-sm font-medium rounded-full">
                Đã hủy
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Patient Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin Bệnh nhân
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Họ và tên</p>
                  <p className="text-base font-medium text-gray-900">
                    {isLoading ? (
                      <Skeleton height={20} />
                    ) : (
                      data?.patient.fullName || '......'
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Mã bệnh nhân</p>
                  <p className="text-base font-medium text-blue-600">
                    {isLoading ? (
                      <Skeleton height={20} />
                    ) : (
                      data?.patientId || '......'
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Ngày sinh</p>
                  <p className="text-base font-medium text-gray-900">
                    {isLoading ? (
                      <Skeleton height={20} />
                    ) : data?.patient.birthday ? (
                      new Date(data?.patient.birthday).toLocaleDateString(
                        'vi-VN'
                      )
                    ) : (
                      '......'
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Insurance Section */}
            <InsuranceSection
              userId={userId}
              selectedInsurance={selectedInsurance}
              onInsuranceChange={setSelectedInsurance}
              disableEdit={disableEdit}
            />

            {/* Services Table */}
            <UsedMedicalServices
              services={servicesWithCoverage}
              disableEdit={disableEdit}
            />

            {/* Medicine Table */}
            <MedicineTable
              medicines={medicinesWithCoverage}
              selectedMedicines={selectedMedicines}
              onMedicineToggle={handleMedicineToggle}
              disableEdit={disableEdit}
            />
          </div>

          {/* Sidebar - Payment Summary */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-[100px] lg:self-start">
              <PaymentSummary
                servicesTotal={totals.servicesTotal}
                medicineTotal={totals.medicineTotal}
                insurancePayment={totals.totalInsurancePayment}
                discount={totals.discount}
                patientTotal={totals.patientTotal}
                handlePayment={handlePayment}
                status={data?.status}
                payment={data?.payment}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
