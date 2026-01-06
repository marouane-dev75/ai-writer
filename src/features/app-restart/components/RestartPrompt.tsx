import { useTranslation } from '@/shared/i18n';
import { Button } from '@/shared/ui';
import { HiExclamationTriangle, HiXMark } from 'react-icons/hi2';
import { ImSpinner2 } from 'react-icons/im';
import { useAppRestart } from '../hooks/useAppRestart';
import { useAppRestartContext } from '../contexts/AppRestartContext';

/**
 * Component that displays a restart prompt with a button to restart the application
 * Designed to be shown as an overlay at the highest level of the app
 * Automatically controlled by AppRestartContext - only renders when showRestartPrompt is true
 */
export const RestartPrompt = () => {
  const { t } = useTranslation();
  const { showRestartPrompt, setShowRestartPrompt } = useAppRestartContext();
  const { service } = useAppRestartContext();
  const { restart, close, isRestarting, error } = useAppRestart(service);

  // Don't render if not shown
  if (!showRestartPrompt) {
    return null;
  }

  // Choose action and message based on dev mode
  const isDevMode = import.meta.env.DEV;
  const handleAction = isDevMode ? close : restart;
  const buttonText = isDevMode 
    ? (isRestarting ? t('common.loading') : t('appRestart.closeButton'))
    : (isRestarting ? t('common.loading') : t('appRestart.button'));
  const message = isDevMode ? t('appRestart.devMessage') : t('appRestart.message');

  const handleDismiss = () => {
    setShowRestartPrompt(false);
  };

  return (
    <div 
      className="fixed top-0 left-0 right-0 z-50 animate-slide-down"
      role="alert"
      aria-live="assertive"
    >
      {/* Gradient background banner */}
      <div className="bg-linear-to-r from-red-500 via-red-600 to-red-700 dark:from-red-600 dark:via-red-700 dark:to-red-800 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-start md:items-center gap-4">
            {/* Warning Icon */}
            <div className="shrink-0 mt-0.5 md:mt-0">
              <HiExclamationTriangle className="w-6 h-6 text-white animate-pulse" />
            </div>

            {/* Message Content */}
            <div className="flex-1 min-w-0">
              <p className="text-sm md:text-base font-semibold text-white leading-relaxed">
                {message}
              </p>
              {error && (
                <p className="text-xs md:text-sm text-red-100 dark:text-red-200 mt-1.5 font-medium">
                  {t('appRestart.error')}: {error}
                </p>
              )}
            </div>

            {/* Action Button */}
            <div className="shrink-0">
              <Button
                onClick={handleAction}
                disabled={isRestarting}
                variant="outline"
                className="bg-white dark:bg-gray-900 text-red-600 dark:text-red-400 border-2 border-white dark:border-gray-700 hover:bg-red-50 dark:hover:bg-gray-800 font-bold px-4 py-2 md:px-6 md:py-2.5 text-sm md:text-base shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-2">
                  {isRestarting && (
                    <ImSpinner2 className="animate-spin h-4 w-4" />
                  )}
                  {buttonText}
                </span>
              </Button>
            </div>

            {/* Close/Dismiss Button */}
            <div className="shrink-0">
              <button
                onClick={handleDismiss}
                className="p-2 rounded-lg text-white hover:bg-white/20 dark:hover:bg-black/20 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                aria-label={t('appRestart.dismiss')}
                title={t('appRestart.dismiss')}
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom shadow for depth */}
      <div className="h-1 bg-linear-to-b from-black/10 to-transparent" />
    </div>
  );
};
