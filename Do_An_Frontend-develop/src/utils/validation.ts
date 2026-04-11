import { ZodError, ZodIssue, ZodObject } from 'zod';

type ValidationResult<T> = [T, null] | [null, Record<string, string>];

const validationData = <T = any>(
  data: any,
  schema: ZodObject<any>
): ValidationResult<T> => {
  try {
    const validatedData = schema.parse(data) as T;
    return [validatedData, null];
  } catch (error: any) {
    if (error instanceof ZodError) {
      const details = error.issues.reduce(
        (acc: Record<string, string>, err: ZodIssue) => {
          acc[err.path.join('.')] = err.message;
          return acc;
        },
        {}
      );
      return [null, details];
    }
    return [null, { error: 'Unknown validation error' }];
  }
};

export default validationData;
