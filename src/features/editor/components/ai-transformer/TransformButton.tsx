import React from 'react';
import { Button } from '@/shared/ui';

interface TransformButtonProps {
  onClick: () => void;
  disabled: boolean;
  label: string;
  title?: string;
}

export const TransformButton: React.FC<TransformButtonProps> = ({
  onClick,
  disabled,
  label,
}) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant="primary"
      className="w-full text-sm"
    >
      {label}
    </Button>
  );
};
