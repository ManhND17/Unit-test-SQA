import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EArticleStatus, IHealthArticle } from '@src/types';

export interface IArticleEditorState {
  article: Partial<IHealthArticle> & { deletedImages?: string[] };
  isEditMode: boolean;
}

const initialState: IArticleEditorState = {
  isEditMode: false,
  article: {
    title: '',
    content: '',
    summary: '',
    slug: '',
    images: [],
    viewCount: 0,
    deletedImages: [],
    featured: true,
    status: EArticleStatus.DRAFT,
    publishedAt: 'now',
  },
};

const postEditorSlice = createSlice({
  name: 'postEditor',
  initialState,
  reducers: {
    updateArticleField: (
      state,
      action: PayloadAction<{ key: keyof IHealthArticle; value: any }>
    ) => {
      const { key, value } = action.payload;
      state.article[key] = value;
    },

    updateArticleFieldMany: (
      state,
      action: PayloadAction<Partial<IHealthArticle>>
    ) => {
      Object.entries(action.payload).forEach(([key, value]) => {
        (state.article as any)[key] = value;
      });
    },

    // Set toàn bộ dữ liệu khi edit bài viết
    setEditArticle: (_, action) => {
      return { isEditMode: true, article: action.payload };
    },

    // Reset về mặc định (khi tạo bài mới)
    resetArticle: (_, action: PayloadAction<Partial<IHealthArticle>>) => {
      return {
        isEditMode: false,
        article: { ...initialState.article, ...action.payload },
      };
    },

    setEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditMode = action.payload;
    },
  },
});

export const {
  updateArticleField,
  updateArticleFieldMany,
  setEditArticle,
  resetArticle,
  setEditMode,
} = postEditorSlice.actions;

export default postEditorSlice.reducer;
