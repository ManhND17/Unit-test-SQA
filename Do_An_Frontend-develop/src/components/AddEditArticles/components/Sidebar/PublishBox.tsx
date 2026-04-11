import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { IRootState } from '@src/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { updateArticleField } from '@src/redux/slices/ArticleEditorSlice';
import { EArticleStatus, IHealthArticle } from '@src/types';
import CommonButton from '@src/components/CommonButton';

interface IPublishBoxProps {
  saveArticle?: () => void;
  submitArticle?: () => Promise<IHealthArticle | undefined>;
}

const PublishBox: React.FC<IPublishBoxProps> = ({
  saveArticle,
  submitArticle,
}) => {
  const { isEditMode, article } = useSelector(
    (state: IRootState) => state.articleEditor
  );
  const roleName = useSelector(
    (state: IRootState) => state.auth.user?.role.name
  );
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingFeatured, setIsEditingFeatured] = useState(false);
  const { status, featured } = article;

  const handleWatchPreview = () => {
    saveArticle?.();
    window.open('/preview-article', '_blank');
  };

  const handleSubmitArticle = async () => {
    setIsLoading(true);
    saveArticle?.();
    await new Promise((resolve) => setTimeout(resolve, 500));
    await submitArticle?.().finally(() => {
      setIsLoading(false);
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md mb-4 shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="font-medium">Đăng</h2>
      </div>
      <div className="p-4">
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Trạng thái:</span>
            {isEditingStatus ? (
              <div className="flex items-center">
                <select
                  value={status}
                  onChange={(e) => {
                    dispatch(
                      updateArticleField({
                        key: 'status',
                        value: e.target.value,
                      })
                    );
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="draft">Nháp</option>
                  {roleName === 'admin' ? (
                    <option value="published">Xuất bản</option>
                  ) : (
                    <option value="pending_review">Chờ duyệt</option>
                  )}
                </select>
                <button
                  onClick={() => setIsEditingStatus(false)}
                  className="ml-2 text-blue-600 hover:underline text-sm"
                >
                  OK
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingStatus(true)}
                className="text-blue-600 hover:underline text-sm"
              >
                {status === EArticleStatus.PUBLISHED
                  ? 'Xuất bản'
                  : status === EArticleStatus.DRAFT
                    ? 'Nháp'
                    : 'Chờ duyệt'}{' '}
                (Chỉnh sửa)
              </button>
            )}
          </div>
          <div className="flex items-center justify-between text-sm mb-2">
            <span>Nổi bật:</span>
            {isEditingFeatured ? (
              <div className="flex items-center">
                <select
                  value={featured ? 'true' : 'false'}
                  onChange={(e) => {
                    dispatch(
                      updateArticleField({
                        key: 'featured',
                        value: e.target.value === 'true',
                      })
                    );
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value="true">Có</option>
                  <option value="false">Không</option>
                </select>
                <button
                  onClick={() => setIsEditingFeatured(false)}
                  className="ml-2 text-blue-600 hover:underline text-sm"
                >
                  OK
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingFeatured(true)}
                className="text-blue-600 hover:underline text-sm"
              >
                {featured ? 'Có' : 'Không'} (Chỉnh sửa)
              </button>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <button
            onClick={handleWatchPreview}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 text-sm"
          >
            <Eye size={16} className="mr-1" />
            Xem trước
          </button>
          <CommonButton
            isLoading={isLoading}
            color="#1d4ed8"
            className="hover:bg-blue-700"
            text={isEditMode ? 'Cập nhật bài viết' : 'Tạo bài viết'}
            onClick={handleSubmitArticle}
          />
        </div>
      </div>
    </div>
  );
};
export default PublishBox;
