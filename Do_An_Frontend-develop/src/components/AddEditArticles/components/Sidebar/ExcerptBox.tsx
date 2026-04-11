import { updateArticleField } from '@src/redux/slices/ArticleEditorSlice';
import { IRootState } from '@src/redux/store';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

const ExcerptBox: React.FC = () => {
  const { summary } = useSelector(
    (state: IRootState) => state.articleEditor.article
  );
  const dispatch = useDispatch();

  return (
    <div className="bg-white border border-gray-200 rounded-md mb-4 shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="font-medium">Tóm tắt</h2>
      </div>
      <div className="p-4">
        <textarea
          value={summary}
          onChange={(e) =>
            dispatch(
              updateArticleField({ key: 'summary', value: e.target.value })
            )
          }
          placeholder="Nhập tóm tắt ngắn gọn về bài viết..."
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 min-h-[100px]"
        ></textarea>
        <p className="text-xs text-gray-500 mt-2">
          Tóm tắt được sử dụng cho SEO và hiển thị trên các trang danh sách bài
          viết.
        </p>
      </div>
    </div>
  );
};

export default ExcerptBox;
