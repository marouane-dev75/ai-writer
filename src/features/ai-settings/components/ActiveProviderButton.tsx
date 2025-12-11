import { useTranslation } from "@/shared/i18n";
import { Button } from "@/shared/ui";

interface ActiveProviderButtonProps {
  isActive: boolean;
  onSetActive: () => void;
}

/**
 * Button component that displays the active status of an AI provider
 * and allows setting it as the active provider.
 * 
 * @example
 * ```tsx
 * <ActiveProviderButton
 *   isActive={activeProvider === 'openai'}
 *   onSetActive={() => handleSetActive('openai')}
 * />
 * ```
 */
export const ActiveProviderButton = ({ isActive, onSetActive }: ActiveProviderButtonProps) => {
  const { t } = useTranslation();

  return (
    <div className="pt-4 flex justify-end">
      {isActive ? (
        <span 
          className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
          role="status"
          aria-live="polite"
        >
          {t('ai.activeProvider')}
        </span>
      ) : (
        <Button onClick={onSetActive} variant="primary">
          {t('ai.setActive')}
        </Button>
      )}
    </div>
  );
};

ActiveProviderButton.displayName = 'ActiveProviderButton';
