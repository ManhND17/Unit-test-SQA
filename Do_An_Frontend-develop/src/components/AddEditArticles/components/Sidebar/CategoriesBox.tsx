import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useMutation, useQuery } from '@tanstack/react-query';
import QUERY_KEY from '@src/api/QueryKey';
import ApiCategory from '@src/api/ApiCategory';
import { useDispatch, useSelector } from 'react-redux';
import { IRootState } from '@src/redux/store';
import { updateArticleField } from '@src/redux/slices/ArticleEditorSlice';
import { toast } from 'react-toastify';

const CategoriesBox: React.FC = () => {
  const dispatch = useDispatch();
  const {
    data: categoriesData,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY.CATEGORY.GET_CATEGORIES],
    queryFn: () => ApiCategory.getCategories(),
  });

  const addCategory = useMutation({
    mutationFn: (category: { name: string; description: string }) =>
      ApiCategory.addCategory(category.name, category.description),
    onSuccess: () => {
      refetch();
      setNewCategory({ name: '', description: '' });
      setIsAddingNew(false);
    },
    onError: () => {
      toast.error('Thêm chuyên mục thất bại');
      setIsAddingNew(false);
    },
  });

  const { categoryId } = useSelector(
    (state: IRootState) => state.articleEditor.article
  );

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategory, setNewCategory] = useState<{
    name: string;
    description: string;
  }>({
    name: '',
    description: '',
  });

  const handleAddCategory = () => {
    if (newCategory.name.trim() === '') {
      toast.error('Tên chuyên mục không được để trống');
      return;
    }
    addCategory.mutate(newCategory);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md mb-4 shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="font-medium">
          Chuyên mục <span className="text-red-600">*</span>
        </h2>
      </div>
      <div className="p-4">
        <div className="max-h-48 overflow-y-auto mb-2">
          {isLoading && (
            <p className="text-sm text-gray-500 h-[48px]">Đang tải...</p>
          )}
          {categoriesData?.data.map((category) => (
            <div key={category.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`category-${category.id}`}
                checked={category.id === categoryId}
                onChange={(event) => {
                  if (event.target.checked) {
                    dispatch(
                      updateArticleField({
                        key: 'categoryId',
                        value: category.id,
                      })
                    );
                  }
                }}
                className="mr-2 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor={`category-${category.id}`} className="text-sm">
                {category.name}
              </label>
            </div>
          ))}
        </div>
        {isAddingNew ? (
          <div className="mt-3">
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) =>
                setNewCategory({ ...newCategory, name: e.target.value })
              }
              placeholder="Tên chuyên mục mới"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md mb-2"
            />
            <input
              type="text"
              value={newCategory.description}
              onChange={(e) =>
                setNewCategory({ ...newCategory, description: e.target.value })
              }
              placeholder="Mô tả chuyên mục mới"
              className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md mb-2"
            />
            <div className="flex gap-2">
              <button
                disabled={addCategory.isPending}
                onClick={handleAddCategory}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Thêm
              </button>
              <button
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center text-sm text-blue-600 hover:text-blue-800 mt-1"
          >
            <Plus size={16} className="mr-1" />
            Thêm chuyên mục mới
          </button>
        )}
      </div>
    </div>
  );
};

export default CategoriesBox;
