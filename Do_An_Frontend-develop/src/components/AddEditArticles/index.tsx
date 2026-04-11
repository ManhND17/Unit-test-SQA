import { Breadcrumbs, CircularProgress } from '@mui/material';
import ArticleLayout from '@src/layouts/Admin/ArticleLayout';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import EditorTool from './components/Editor';
import ArticleTitle from './components/Title';
import PublishBox from './components/Sidebar/PublishBox';
import CategoriesBox from './components/Sidebar/CategoriesBox';
import FeaturedImageBox from './components/Sidebar/FeaturedImageBox';
import ExcerptBox from './components/Sidebar/ExcerptBox';
import { IRootState } from '@src/redux/store';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CreateArticleDto, UpdateArticleDto } from '@src/dto/article.dto';
import ApiArticle from '@src/api/ApiArticle';
import { toast } from 'react-toastify';
import {
  resetArticle,
  setEditArticle,
} from '@src/redux/slices/ArticleEditorSlice';
import validationData from '@src/utils/validation';
import { IDataError } from '@src/api/Fetcher';
import QUERY_KEY from '@src/api/QueryKey';
import { Link, useSearchParams } from 'react-router-dom';
import { EUserRole } from '@src/types';

export default function AddEditArticles() {
  const { isEditMode, article } = useSelector(
    (state: IRootState) => state.articleEditor
  );
  const userRole = useSelector(
    (state: IRootState) => state.auth.user?.role.name
  );
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id') || undefined;
  const dispatch = useDispatch();
  const functionsRef = useRef<Record<string, (...args: any[]) => void>>({});
  const [thumbnail, setThumbnail] = useState<File | null | string>(
    article.imageUrl || null
  );

  const getDetailArticle = useQuery({
    queryKey: [QUERY_KEY.ARTICLE.GET_ARTICLE_BY_ID, id],
    enabled: !!isEditMode && !!id,
    queryFn: () => ApiArticle.getArticleById(id!),
  });

  const handleThumbnailChange = useCallback((file: File | null) => {
    setThumbnail(file);
  }, []);

  useEffect(() => {
    if (getDetailArticle.data && isEditMode) {
      dispatch(setEditArticle(getDetailArticle.data));
      setThumbnail(getDetailArticle.data.imageUrl || null);
    }
  }, [dispatch, getDetailArticle.data, isEditMode]);

  const handleSubmitArticle = async () => {
    functionsRef.current.save();
    if (!isEditMode) {
      const [newArticle, error] = validationData(
        {
          title: article.title,
          content: article.content,
          summary: article.summary,
          categoryId: article.categoryId!,
          authorId: article.authorId,
          status: article.status,
          featured: article.featured ? 'true' : 'false',
          thumbnail: thumbnail,
          toc: article.toc,
          publishedAt: article.publishedAt,
          images: article.images,
          deletedImages: article.deletedImages,
          slug: article.slug,
        },
        CreateArticleDto
      );
      if (error) {
        const message = Object.entries(error).map(([field, errors]) => {
          return `${field}: ${errors}`;
        });
        toast.error(`Lỗi validation:\n${message.join('\n')}`);
        throw new Error('Lỗi validation');
      }
      const formData = new FormData();
      formData.append('title', newArticle.title);
      if (newArticle.slug) {
        formData.append('slug', newArticle.slug);
      }
      formData.append('content', newArticle.content);
      formData.append('categoryId', newArticle.categoryId);
      if (article.authorId) {
        formData.append('authorId', article.authorId);
      }
      if (newArticle.summary) {
        formData.append('summary', newArticle.summary);
      }
      if (newArticle.status) {
        formData.append('status', newArticle.status);
      }
      if (newArticle.featured) {
        formData.append('featured', newArticle.featured);
      }
      if (newArticle.thumbnail) {
        formData.append('thumbnail', newArticle.thumbnail);
      }
      if (newArticle.extras) {
        formData.append('extras', JSON.stringify(newArticle.extras));
      }
      if (newArticle.toc) {
        formData.append('toc', JSON.stringify(newArticle.toc));
      }
      formData.append('publishedAt', newArticle.publishedAt || 'now');
      if (newArticle.images && newArticle.images.length > 0) {
        formData.append('imagesUrl', JSON.stringify(newArticle.images));
      }
      if (newArticle.deletedImages && newArticle.deletedImages.length > 0) {
        formData.append(
          'deletedImages',
          JSON.stringify(newArticle.deletedImages)
        );
      }
      return ApiArticle.createArticle(formData);
    } else {
      const [updatedArticle, error] = validationData(
        {
          title: article.title,
          content: article.content,
          summary: article.summary,
          categoryId: article.categoryId!,
          authorId: article.authorId,
          status: article.status,
          featured: article.featured ? 'true' : 'false',
          toc: article.toc,
          publishedAt: article.publishedAt,
          images: article.images,
          deletedImages: article.deletedImages,
          slug: article.slug,
          ...(typeof thumbnail === 'string' ? {} : { newThumbnail: thumbnail }),
        },
        UpdateArticleDto
      );
      if (error) {
        const message = Object.values(error).join('\n');
        toast.error(`Lỗi validation:\n${message}`);
        throw new Error('Lỗi validation');
      }
      const formData = new FormData();
      if (updatedArticle.title) {
        formData.append('title', updatedArticle.title);
      }
      if (updatedArticle.slug) {
        formData.append('slug', updatedArticle.slug);
      }
      if (updatedArticle.content) {
        formData.append('content', updatedArticle.content);
      }
      if (updatedArticle.categoryId) {
        formData.append('categoryId', updatedArticle.categoryId);
      }
      if (updatedArticle.summary) {
        formData.append('summary', updatedArticle.summary);
      }
      if (updatedArticle.status) {
        formData.append('status', updatedArticle.status);
      }
      if (updatedArticle.featured) {
        formData.append('featured', updatedArticle.featured);
      }
      if (updatedArticle.newThumbnail) {
        formData.append('thumbnail', updatedArticle.newThumbnail);
      }
      if (updatedArticle.extras) {
        formData.append('extras', JSON.stringify(updatedArticle.extras));
      }
      if (updatedArticle.toc) {
        formData.append('toc', JSON.stringify(updatedArticle.toc));
      }
      if (updatedArticle.publishedAt) {
        formData.append('publishedAt', updatedArticle.publishedAt);
      }
      if (updatedArticle.images && updatedArticle.images.length > 0) {
        formData.append('imagesUrl', JSON.stringify(updatedArticle.images));
      }
      if (
        updatedArticle.deletedImages &&
        updatedArticle.deletedImages.length > 0
      ) {
        formData.append(
          'deletedImages',
          JSON.stringify(updatedArticle.deletedImages)
        );
      }
      return ApiArticle.updateArticle(article.id!, formData);
    }
  };

  const submitArticle = useMutation({
    mutationFn: handleSubmitArticle,
    onSuccess: () => {
      if (isEditMode) {
        toast.success('Chỉnh sửa bài viết thành công');
      } else {
        toast.success('Tạo bài viết thành công');
      }
      setThumbnail(null);
      dispatch(resetArticle({}));
      localStorage.removeItem('editorContent');
    },
    onError: (error: IDataError) => {
      toast.error(
        `Lỗi khi ${isEditMode ? 'chỉnh sửa' : 'tạo'} bài viết: ${error.errorMessage || 'Vui lòng thử lại'}`
      );
    },
  });

  const header = useMemo(
    () => (
      <Breadcrumbs aria-label="breadcrumb">
        <Link to={userRole === EUserRole.ADMIN ? '/admin' : '/doctor'}>
          Trang chủ
        </Link>
        <Link
          to={
            userRole === EUserRole.ADMIN
              ? '/admin/articles'
              : '/doctor/articles'
          }
        >
          Quản lý bài viết
        </Link>
        <p className="font-bold text-black">
          {isEditMode ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
        </p>
      </Breadcrumbs>
    ),
    [isEditMode]
  );

  return (
    <ArticleLayout header={header}>
      <div className="flex flex-col md:flex-row gap-6 mt-[50px]">
        <main className="w-full md:w-[70%]">
          <div className="space-y-6">
            <ArticleTitle />
            {getDetailArticle.isLoading && isEditMode ? (
              <div className="border border-[rgb(204,204,204)] h-[1000px] flex justify-center items-center">
                <CircularProgress />
              </div>
            ) : (
              <EditorTool ref={functionsRef} />
            )}
          </div>
        </main>
        <aside className="w-full md:w-[30%]">
          <CategoriesBox />
          <FeaturedImageBox
            image={thumbnail}
            onChange={handleThumbnailChange}
          />
          <ExcerptBox />
          <PublishBox
            saveArticle={functionsRef.current?.save}
            submitArticle={submitArticle.mutateAsync}
          />
        </aside>
      </div>
    </ArticleLayout>
  );
}
