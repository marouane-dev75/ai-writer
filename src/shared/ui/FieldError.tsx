interface FieldErrorProps {
  error?: string;
}

/**
 * Displays validation error messages below form fields
 * 
 * @example
 * ```tsx
 * <FormInput label="Email" value={email} onChange={setEmail} />
 * <FieldError error={errors.email} />
 * ```
 */
export const FieldError = ({ error }: FieldErrorProps) => {
  if (!error) return null;
  
  return (
    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
      {error}
    </p>
  );
};

FieldError.displayName = 'FieldError';
