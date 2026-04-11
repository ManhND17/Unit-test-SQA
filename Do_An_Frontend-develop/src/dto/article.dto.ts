import { z } from 'zod';

export const CreateArticleDto = z.object({
  slug: z.string().optional(),
  title: z.string().min(3, 'Tiêu đề phải có ít nhất 3 ký tự'),
  content: z.string().min(10, 'Nội dung phải có ít nhất 10 ký tự'),
  summary: z.string().optional(),
  categoryId: z.uuid('Category ID không hợp lệ'),
  authorId: z.uuid('Author ID không hợp lệ').optional(),
  status: z
    .enum(['draft', 'pending_review', 'published', 'rejected'])
    .optional()
    .default('draft'),
  featured: z.string().optional(),
  toc: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        level: z.number(),
      })
    )
    .optional(),
  publishedAt: z
    .string()
    .optional()
    .refine((v) => v === 'now' || (v && !Number.isNaN(Date.parse(v))), {
      message: 'publishedAt phải là ISO date hợp lệ',
    }),
  images: z
    .array(z.string())
    .optional()
    .transform((val) => val || []),
  deletedImages: z
    .array(z.string())
    .optional()
    .transform((val) => val || []),
  thumbnail: z
    .file()
    .refine(
      (file) => file.size <= 5 * 1024 * 1024 && file.type.startsWith('image/'),
      {
        message:
          'Kích thước tệp phải nhỏ hơn hoặc bằng 5MB và phải là hình ảnh',
      }
    )
    .optional(),
});

export const UpdateArticleDto = z.object({
  slug: z.string().optional(),
  title: z
    .string()
    .optional()
    .pipe(z.string().min(3, 'Tiêu đề phải có ít nhất 3 ký tự').optional()),
  content: z
    .string()
    .optional()
    .pipe(z.string().min(10, 'Nội dung phải có ít nhất 10 ký tự').optional()),
  summary: z
    .string()
    .optional()
    .transform((val) => (val === '' ? undefined : val)),
  categoryId: z
    .string()
    .optional()
    .pipe(z.string().uuid('Category ID không hợp lệ').optional()),
  status: z
    .enum(['draft', 'pending_review', 'published', 'rejected'])
    .optional(),
  featured: z.string().optional(),
  toc: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        level: z.number(),
      })
    )
    .optional(),
  publishedAt: z
    .string()
    .optional()
    .refine((v) => v === 'now' || (v && !Number.isNaN(Date.parse(v))), {
      message: 'publishedAt phải là ISO date hợp lệ',
    }),
  thumbnail: z.string().optional(),
  images: z.array(z.string()).optional(),
  deletedImages: z.array(z.string()).optional(),
  newThumbnail: z
    .file()
    .refine(
      (file) => file.size <= 5 * 1024 * 1024 && file.type.startsWith('image/'),
      {
        message:
          'Kích thước tệp phải nhỏ hơn hoặc bằng 5MB và phải là hình ảnh',
      }
    )
    .optional(),
});

export type CreateArticleDataDto = z.infer<typeof CreateArticleDto>;
export type UpdateArticleDataDto = z.infer<typeof UpdateArticleDto>;
