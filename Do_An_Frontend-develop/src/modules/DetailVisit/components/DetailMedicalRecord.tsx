import { IMedicalRecord } from '@src/types';
import { useState } from 'react';
import { DiagnosisTab } from './DiagnosisTab';
import { ResultsPanel } from './ResultsPanel';
import { ImageViewerModal } from '@src/components/ImageViewerModal';

interface IDetailMedicalRecordProps {
  data?: IMedicalRecord;
}
export default function DetailMedicalRecord({
  data,
}: IDetailMedicalRecordProps) {
  const [activeTab, setActiveTab] = useState('diagnosis');
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  if (!data) {
    return <p className="text-xl">Không tìm thấy hồ sơ y tế.</p>;
  }
  const filesData = data.fileAssets
    ? data.fileAssets.map((file) => ({
        id: file.id,
        name: file.name || 'Tên file không xác định',
        url: file.url,
        thumbnail: file.url,
        type: file.fileType as 'image' | 'document',
      }))
    : [];

  const handleFileClick = (file: (typeof filesData)[0]) => {
    if (file.type === 'image') {
      const index = filesData.findIndex((img) => img.id === file.id);
      if (index !== -1) {
        setSelectedImageIndex(index);
        setIsImageViewerOpen(true);
      }
    } else if (file.type === 'document') {
      window.open(file.url, '_blank');
    }
  };
  const tabs = [
    {
      id: 'diagnosis',
      label: 'Chẩn Đoán',
      content: <DiagnosisTab data={data!} />,
    },
    {
      id: 'fileAttachments',
      label: 'Tệp Đính Kèm',
      content: <ResultsPanel files={filesData} onFileClick={handleFileClick} />,
    },
  ];

  const activeContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div>
      <div className="w-full">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="mt-6">{activeContent}</div>
      </div>

      {/* Image Viewer Modal */}
      <ImageViewerModal
        isOpen={isImageViewerOpen}
        onClose={() => setIsImageViewerOpen(false)}
        images={filesData.filter((file) => file.type.includes('image'))}
        initialIndex={selectedImageIndex}
      />
    </div>
  );
}
