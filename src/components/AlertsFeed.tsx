import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import type { Alert } from '../types';

interface AlertsFeedProps {
  alerts: Alert[];
}

export default function AlertsFeed({ alerts }: AlertsFeedProps) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
      <Typography variant="h6" sx={{ color: '#f5f7fa', mb: 1.5 }}>
        Recent Alerts
      </Typography>
      <Stack spacing={1.2}>
        {alerts.map((alert) => (
          <Box key={alert.id} sx={{ p: 1.3, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.03)' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#f5f7fa' }}>{alert.message}</Typography>
              <Chip label={alert.severity} color={alert.severity === 'critical' || alert.severity === 'high' ? 'error' : alert.severity === 'medium' ? 'warning' : 'success'} size="small" />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.6 }}>
              {alert.source} • {alert.status} • {alert.timestamp}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
