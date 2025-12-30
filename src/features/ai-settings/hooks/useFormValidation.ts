import { useMemo } from 'react';
import { useTranslation } from '@/shared/i18n';
import type { ZodSchema, ZodError, ZodIssue } from 'zod';

/**
 * Field-level validation errors
 */
export type ValidationErrors = Record<string, string>;

/**
 * Hook to validate form data using Zod schemas with i18n support
 * 
 * @param schema - Zod schema to validate against
 * @param data - Data to validate
 * @returns Object containing validation errors and isValid flag
 * 
 * @example
 * ```tsx
 * const { errors, isValid } = useFormValidation(openAIConfigSchema, config);
 * 
 * <FormInput value={config.apiKey} onChange={...} />
 * <FieldError error={errors.apiKey} />
 * ```
 */
export function useFormValidation<T>(
  schema: ZodSchema<T>,
  data: T
): { errors: ValidationErrors; isValid: boolean } {
  const { t } = useTranslation();

  const { errors, isValid } = useMemo(() => {
    const validationErrors: ValidationErrors = {};
    
    try {
      schema.parse(data);
      return { errors: validationErrors, isValid: true };
    } catch (error) {
      if (error && typeof error === 'object' && 'issues' in error) {
        const zodError = error as ZodError;
        zodError.issues.forEach((err: ZodIssue) => {
          const field = err.path[0] as string;
          // Use the error message as i18n key
          const i18nKey = `ai.${err.message}`;
          validationErrors[field] = t(i18nKey);
        });
      }
      return { errors: validationErrors, isValid: false };
    }
  }, [schema, data, t]);

  return { errors, isValid };
}
