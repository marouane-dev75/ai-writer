/**
 * Model Status Indicator - displays AI model loading status
 */

import React from 'react';
import type { ModelStatus } from '../types';
import { LoadingSpinner } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n/contexts';

interface ModelStatusIndicatorProps {
  status: ModelStatus | null;
}

export const ModelStatusIndicator: React.FC<ModelStatusIndicatorProps> = ({ status }) => {
  const { t } = useTranslation();

  if (!status) {
    return null;
  }

  const getStatusIcon = () => {
    switch (status.status) {
      case 'Unloaded':
        return <span className="status-icon">⚪</span>;
      case 'Loading':
        return <LoadingSpinner />;
      case 'Loaded':
        return <span className="status-icon">✅</span>;
      case 'Error':
        return <span className="status-icon">❌</span>;
    }
  };

  const getStatusText = () => {
    switch (status.status) {
      case 'Unloaded':
        return t('ai.modelStatus.noModel');
      case 'Loading':
        return t('ai.modelStatus.loading', { provider: status.provider });
      case 'Loaded':
        return t('ai.modelStatus.loaded', { provider: status.provider, model: status.model });
      case 'Error':
        return t('ai.modelStatus.error', { provider: status.provider });
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case 'Unloaded':
        return 'text-gray-500';
      case 'Loading':
        return 'text-blue-500';
      case 'Loaded':
        return 'text-green-500';
      case 'Error':
        return 'text-red-500';
    }
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800">
      {getStatusIcon()}
      <span className={`text-sm font-medium ${getStatusColor()}`}>
        {getStatusText()}
      </span>
    </div>
  );
};

ModelStatusIndicator.displayName = 'ModelStatusIndicator';
