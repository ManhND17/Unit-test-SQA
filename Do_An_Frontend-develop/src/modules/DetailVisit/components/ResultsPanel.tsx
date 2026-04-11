import { Card } from '@mui/material';
import { FileText, Image as ImageIcon } from 'lucide-react';
interface FileAttachment {
  id: string;
  name: string;
  type: 'image' | 'document';
  url: string;
  thumbnail: string;
}
interface ResultsPanelProps {
  files: FileAttachment[];
  onFileClick?: (file: FileAttachment) => void;
}
export function ResultsPanel({ files, onFileClick }: ResultsPanelProps) {
  return (
    <div className="space-y-6">
      {/* Files Section */}
      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-blue-600" />
            Kết Quả & Tài Liệu
          </h3>

          <div className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                onClick={() => onFileClick?.(file)}
                className={`flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors ${file.type === 'image' ? 'cursor-pointer hover:ring-2 hover:ring-blue-200' : 'cursor-default'}`}
              >
                {file.type === 'image' ? (
                  <div className="h-12 w-12 bg-blue-100 rounded flex items-center justify-center mr-3 relative overflow-hidden group">
                    {file.thumbnail ? (
                      <img
                        src={file.thumbnail}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="h-6 w-6 text-blue-600" />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>
                ) : (
                  <div className="h-12 w-12 bg-gray-200 rounded flex items-center justify-center mr-3">
                    <FileText className="h-6 w-6 text-gray-600" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {file.type === 'image'
                      ? 'Hình ảnh - Nhấn để xem'
                      : 'Tài liệu - Nhấn để xem'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
