import React from 'react';
import { Dialog } from '@/shared/ui';
import { useTranslation } from '@/shared/i18n';
import { PresetManager } from './PresetManager';
import type { TransformPreset } from '../../types';

interface PresetManagerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  presets: TransformPreset[];
  onAdd: (title: string, description: string) => Promise<void>;
  onUpdate: (preset: TransformPreset) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
}

export const PresetManagerDialog: React.FC<PresetManagerDialogProps> = ({
  isOpen,
  onClose,
  presets,
  onAdd,
  onUpdate,
  onDelete,
  isLoading,
}) => {
  const { t } = useTranslation();

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title={t('editor.aiTransformer.presetDialog.title')}
      size="medium"
    >
      <PresetManager
        presets={presets}
        onAdd={onAdd}
        onUpdate={onUpdate}
        onDelete={onDelete}
        isLoading={isLoading}
      />
    </Dialog>
  );
};

PresetManagerDialog.displayName = 'PresetManagerDialog';
