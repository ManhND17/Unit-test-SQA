import React, { useState } from 'react';
import { X } from 'lucide-react';
const TagsBox: React.FC = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const handleAddTag = () => {
    if (tagInput.trim()) {
      // Split by comma and add each tag
      const newTags = tagInput
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag && !tags.includes(tag));
      setTags([...tags, ...newTags]);
      setTagInput('');
    }
  };
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };
  return (
    <div className="bg-white border border-gray-200 rounded-md mb-4 shadow-sm">
      <div className="border-b border-gray-200 px-4 py-3">
        <h2 className="font-medium">Thẻ</h2>
      </div>
      <div className="p-4">
        <div className="flex mb-3">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập thẻ, cách nhau bằng dấu phẩy..."
            className="flex-grow px-3 py-1.5 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <button
            onClick={handleAddTag}
            className="px-3 py-1.5 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-200 text-sm"
          >
            Thêm
          </button>
        </div>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <div
                key={index}
                className="flex items-center bg-gray-100 text-sm px-2 py-1 rounded-md"
              >
                {tag}
                <button
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        <p className="text-xs text-gray-500 mt-2">
          Thẻ giúp phân loại bài viết và cải thiện khả năng tìm kiếm.
        </p>
      </div>
    </div>
  );
};
export default TagsBox;
