import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import type { Alert } from '../types';

interface AlertsFeedProps {
  alerts: Alert[];
}

const severityColors = {
  low: 'info',
  medium: 'warning',
  high: 'error',
  critical: 'error',
} as const;

export default function AlertsFeed({ alerts }: AlertsFeedProps) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#f5f7fa' }}>
        Recent Alerts
      </Typography>
      <Stack spacing={1.5}>
        {alerts.map((alert) => (
          <Box key={alert.id} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1}>
              <Typography variant="body2" sx={{ color: '#f5f7fa' }}>
                {alert.message}
              </Typography>
              <Chip label={alert.severity} color={severityColors[alert.severity]} size="small" />
            </Stack>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
              {alert.source} • {alert.status} • {alert.timestamp}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
