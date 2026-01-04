import { useTranslation } from '@/shared/i18n';
import { Button } from '@/shared/ui';
import { HiArrowPath } from 'react-icons/hi2';
import { useAppRestart } from '../hooks/useAppRestart';
import { useAppRestartContext } from '../contexts/AppRestartContext';

/**
 * Component that displays a restart prompt with a button to restart the application
 * Designed to be shown as an overlay at the highest level of the app
 * Automatically controlled by AppRestartContext - only renders when showRestartPrompt is true
 */
export const RestartPrompt = () => {
  const { t } = useTranslation();
  const { showRestartPrompt, service } = useAppRestartContext();
  const { restart, close, isDevMode, isRestarting, error } = useAppRestart(service);

  // Don't render if not shown
  if (!showRestartPrompt) {
    return null;
  }

  // Choose action and message based on dev mode
  const handleAction = isDevMode ? close : restart;
  const buttonText = isDevMode 
    ? (isRestarting ? t('common.loading') : t('appRestart.closeButton'))
    : (isRestarting ? t('common.loading') : t('appRestart.button'));
  const message = isDevMode ? t('appRestart.devMessage') : t('appRestart.message');

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-blue-600 dark:bg-blue-700 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left side: Action button */}
          <div className="shrink-0">
            <Button
              onClick={handleAction}
              disabled={isRestarting}
              className="bg-white text-blue-600 hover:bg-blue-50 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <HiArrowPath className={`w-5 h-5 ${isRestarting ? 'animate-spin' : ''}`} />
              {buttonText}
            </Button>
          </div>

          {/* Center: Message */}
          <div className="flex-1 text-center">
            <p className="text-sm md:text-base font-medium">
              {message}
            </p>
            {error && (
              <p className="text-xs md:text-sm text-red-200 dark:text-red-300 mt-1">
                {t('appRestart.error')}: {error}
              </p>
            )}
          </div>

          {/* Right side: Empty space for balance */}
          <div className="shrink-0 w-[120px] md:w-[140px]" />
        </div>
      </div>
    </div>
  );
};
