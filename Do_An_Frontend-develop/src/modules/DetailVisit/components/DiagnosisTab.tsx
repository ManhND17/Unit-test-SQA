import { Card } from '@mui/material';
import { IMedicalRecord } from '@src/types';
interface DiagnosisTabProps {
  data: IMedicalRecord;
}
export function DiagnosisTab({ data }: DiagnosisTabProps) {
  return (
    <div className="space-y-6">
      {/* Symptoms */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Triệu Chứng
          </h3>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {data.symptoms}
          </div>
        </div>
      </Card>

      {/* Diagnosis */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Chẩn Đoán
          </h3>
          <p className="text-gray-700 leading-relaxed">{data.diagnosis}</p>
        </div>
      </Card>

      {/* Treatments */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Phương Pháp Điều Trị
          </h3>
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {data.treatments}
          </div>
        </div>
      </Card>

      {/* Notes */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Ghi Chú Của Bác Sĩ
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {data.notes}
          </p>
        </div>
      </Card>
    </div>
  );
}
