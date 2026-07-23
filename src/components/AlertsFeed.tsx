import { Box, Chip, Paper, Stack, Typography } from '@mui/material';
import type { Alert } from '../types';

interface AlertsFeedProps {
  alerts: Alert[];
}

export default function AlertsFeed({ alerts }: AlertsFeedProps) {
  return (
    <Paper elevation={0} sx={{ p: { xs: 2.25, md: 2.75 }, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3, boxShadow: '0 10px 24px rgba(15,23,42,0.04)' }}>
      <Typography variant="h6" sx={{ color: 'text.primary', mb: 1.5, fontWeight: 700 }}>
        Recent Alerts
      </Typography>
      <Stack spacing={1.2}>
        {alerts.map((alert) => (
          <Box key={alert.id} sx={{ p: 1.4, borderRadius: 2, bgcolor: 'background.secondary', border: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, flex: 1 }}>{alert.message}</Typography>
              <Chip label={alert.severity} color={alert.severity === 'critical' || alert.severity === 'high' ? 'error' : alert.severity === 'medium' ? 'warning' : 'success'} size="small" />
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.75 }}>
              {alert.source} • {alert.status} • {alert.timestamp}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}
