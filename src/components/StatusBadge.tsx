import { Chip } from '@mui/material';

interface StatusBadgeProps {
  status: string;
}

const palette: Record<string, 'success' | 'warning' | 'error'> = {
  healthy: 'success',
  warning: 'warning',
  critical: 'error',
  low: 'success',
  medium: 'warning',
  high: 'error',
  resolved: 'success',
  open: 'error',
  assigned: 'warning',
  investigation: 'warning',
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  return <Chip label={status} color={palette[status.toLowerCase()] ?? 'default'} size="small" />;
}
