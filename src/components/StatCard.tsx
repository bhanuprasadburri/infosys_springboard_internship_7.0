import { Paper, Typography } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
}

export default function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3 }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: 1.2 }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, color: '#f5f7fa' }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        {subtitle}
      </Typography>
    </Paper>
  );
}
