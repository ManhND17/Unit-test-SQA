import '@wangeditor/editor/dist/css/style.css';
import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  useImperativeHandle,
  useCallback,
} from 'react';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import {
  IDomEditor,
  IEditorConfig,
  IToolbarConfig,
  i18nChangeLanguage,
  SlateElement,
} from '@wangeditor/editor';
import { useDispatch, useSelector } from 'react-redux';
import store, { IRootState } from '@src/redux/store';
import {
  updateArticleField,
  updateArticleFieldMany,
} from '@src/redux/slices/ArticleEditorSlice';
import {
  customCheckImageFn,
  customParseImageSrc,
} from '@src/config/wangeditor';
import config from '@src/config';
import { toast } from 'react-toastify';
import ApiUpload from '@src/api/ApiUpload';
import slugify from 'slugify';

type ImageElement = SlateElement & {
  src: string;
  alt: string;
  url: string;
  href: string;
};

type TocItem = {
  id: string;
  label: string;
  level: number;
};

i18nChangeLanguage('en');

const EditorTool = forwardRef(
  (_, ref: React.Ref<Record<string, (...args: any[]) => void>>) => {
    const { content, images, author } = useSelector(
      (state: IRootState) => state.articleEditor.article
    );
    const dispatch = useDispatch();
    // Editor instance
    const [editor, setEditor] = useState<IDomEditor | null>(null);

    const uploadedImages = useRef(new Set<string>(images || []));
    const toc = useRef<TocItem[]>([]);

    useImperativeHandle(ref, () => ({
      save: handleSave,
    }));

    // Generate slug from text for header IDs
    const generateSlug = useCallback((text: string): string => {
      return slugify(text, { lower: true, strict: true }).substring(0, 50);
    }, []);

    // Auto-generate IDs for headers in HTML content
    const addIdsToHeaders = useCallback(
      (htmlContent: string): string => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlContent, 'text/html');
        const headers = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

        headers.forEach((header) => {
          if (!header.id) {
            const text = header.textContent || 'heading';
            header.id = generateSlug(text);
          }
        });

        return doc.body.innerHTML;
      },
      [generateSlug]
    );

    // Editor content
    const toolbarConfig: Partial<IToolbarConfig> = {
      excludeKeys: ['uploadVideo', 'insertVideo'],
    };

    const editorConfig: Partial<IEditorConfig> = {
      placeholder: 'Nhập nội dung bài viết...',
      MENU_CONF: {
        insertImage: {
          onInsertedImage: (imageNode: ImageElement) => {
            if (imageNode == null) return;
            const src = imageNode.src;
            uploadedImages.current.add(src);
          },
          checkImage: customCheckImageFn,
          parseImageSrc: customParseImageSrc,
        },
        editImage: {
          onUpdatedImage: (imageNode: ImageElement | null) => {
            if (imageNode == null) return;
            const src = imageNode.src;
            uploadedImages.current.add(src);
          },
          checkImage: customCheckImageFn,
          parseImageSrc: customParseImageSrc,
        },
        uploadImage: {
          // Server address
          server: config.NETWORK_CONFIG.API_BASE_URL + '/uploads',

          // Form-data field name
          fieldName: 'files',

          // File size and type restrictions
          maxFileSize: 10 * 1024 * 1024, // 10MB
          maxNumberOfFiles: 5,
          allowedFileTypes: ['image/*'],

          // Custom headers (function để lấy token mới nhất)
          headers: () => {
            const token = store.getState().auth.accessToken;
            return {
              Authorization: `Bearer ${token}`,
            };
          },

          // Cross-origin settings
          withCredentials: false,
          timeout: 60 * 1000, // 60 seconds

          // Callbacks
          onFailed: (_file: File, res: any) => {
            toast.error(
              `Upload image failed: ${res?.message || 'Unknown error'}`
            );
          },
          onError: (_file: File, err: any) => {
            toast.error(
              `Upload image error: ${err?.message || 'Unknown error'}`
            );
          },

          // Custom insert - xử lý response từ server
          customInsert: (
            res: any,
            insertFn: (url: string, alt?: string, href?: string) => void
          ) => {
            if (res?.data?.url) {
              insertFn(res.data.url, res.data.alt || '', res.data.href || '');
            } else {
              toast.error('Upload image failed: Invalid server response');
            }
          },

          // Custom upload - tự xử lý upload nếu không dùng server mặc định
          customUpload: async (
            file: File,
            insertFn: (url: string, alt?: string, href?: string) => void
          ) => {
            try {
              const responses = await ApiUpload.uploadFiles([file]);
              if (responses && responses.length > 0) {
                responses.forEach((uploadedFile) => {
                  insertFn(uploadedFile.url, '', '');
                });
              }
            } catch {
              toast.error('Upload image failed');
            }
          },
        },
      },
    };

    // Save content handler
    const handleSave = () => {
      let content = editor?.getHtml() || '';

      // Add IDs to headers in HTML content
      content = addIdsToHeaders(content);

      // Parse content to build TOC
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, 'text/html');
      const headers = doc.querySelectorAll('h1, h2, h3, h4, h5, h6');

      // Reset TOC before rebuilding
      toc.current = [];

      headers.forEach((header) => {
        const tagName = header.tagName.toLowerCase();
        const level = parseInt(tagName.substring(1));
        if (!isNaN(level)) {
          toc.current.push({
            id: header.id || '',
            label: header.textContent || '',
            level,
          });
        }
      });

      dispatch(updateArticleField({ key: 'content', value: content }));
      localStorage.setItem(
        'editorContent',
        JSON.stringify({ content, author, toc: toc.current })
      );

      const imageElemes = editor!.getElemsByType('image');

      // Collect current images in the editor
      const imagesInEditor = new Set<string>(
        imageElemes.map((elem) => (elem as any).src as string)
      );

      // Determine removed images
      const deletedImages = [...uploadedImages.current].filter(
        (url) => !imagesInEditor.has(url)
      );

      dispatch(
        updateArticleFieldMany({
          images: [...imagesInEditor],
          deletedImages,
          toc: toc.current,
        } as any)
      );
    };

    // Timely destroy editor, important!
    useEffect(() => {
      return () => {
        if (editor == null) return;
        editor.destroy();
        setEditor(null);
      };
    }, [editor]);

    return (
      <div>
        <>
          <div style={{ border: '1px solid #ccc', zIndex: 100 }}>
            <Toolbar
              editor={editor}
              defaultConfig={toolbarConfig}
              mode="default"
              style={{ borderBottom: '1px solid #ccc' }}
            />
            <Editor
              defaultConfig={editorConfig}
              value={content}
              onCreated={setEditor}
              onChange={(editor) => {
                const htmlContent = editor.getHtml();
                const contentWithIds = addIdsToHeaders(htmlContent);
                dispatch(
                  updateArticleField({
                    key: 'content',
                    value: contentWithIds,
                  })
                );
              }}
              mode="default"
              style={{ height: '1000px', overflowY: 'hidden' }}
            />
          </div>
        </>
      </div>
    );
  }
);

export default EditorTool;
