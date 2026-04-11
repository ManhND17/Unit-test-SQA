import React, { useState } from 'react';
import Config from '@src/config';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@src/redux/store';
import {
  updateArticleField,
  updateArticleFieldMany,
} from '@src/redux/slices/ArticleEditorSlice';
import slugify from 'slugify';

const ArticleTitle: React.FC = () => {
  const { title, slug } = useSelector(
    (state: IRootState) => state.articleEditor.article
  );
  const dispatch = useDispatch();

  const [isEditingPermalink, setIsEditingPermalink] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (!isEditingPermalink) {
      const generatedPermalink = slugify(newTitle, {
        lower: true,
        strict: true,
        locale: 'vi',
      });
      dispatch(
        updateArticleFieldMany({ title: newTitle, slug: generatedPermalink })
      );
    } else {
      dispatch(updateArticleField({ key: 'title', value: newTitle }));
    }
  };

  const handlePermalinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateArticleField({ key: 'slug', value: e.target.value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Nhập tiêu đề tại đây"
          className="w-full text-3xl font-bold border-0 border-b border-gray-200 pb-2 focus:outline-none focus:border-blue-500 focus:ring-0"
        />
      </div>
      {title && (
        <div className="flex items-center text-sm text-gray-500">
          <span>
            Permalink:{' '}
            {`${Config.NETWORK_CONFIG.FRONT_END_BASE_URL}/articles/${slug || ''}`}
          </span>
          {isEditingPermalink ? (
            <div className="flex items-center">
              <input
                type="text"
                value={slug}
                onChange={handlePermalinkChange}
                className="mx-1 px-1 py-0.5 border border-gray-300 rounded w-auto"
              />
              <button
                onClick={() => setIsEditingPermalink(false)}
                className="ml-2 text-blue-600 hover:underline"
              >
                Lưu
              </button>
            </div>
          ) : (
            <>
              <button
                onClick={() => setIsEditingPermalink(true)}
                className="ml-2 text-blue-600 hover:underline"
              >
                Chỉnh sửa
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
};
export default ArticleTitle;
