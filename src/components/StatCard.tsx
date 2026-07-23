import { Paper, Typography } from '@mui/material';

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
}

export default function StatCard({ title, value, subtitle }: StatCardProps) {
  return (
    <Paper elevation={0} sx={{ p: { xs: 2.25, md: 2.75 }, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider', borderRadius: 3, boxShadow: '0 10px 24px rgba(15,23,42,0.04)', transition: 'all 200ms ease', '&:hover': { boxShadow: '0 12px 28px rgba(15,23,42,0.08)', transform: 'translateY(-2px)' } }}>
      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textTransform: 'uppercase', letterSpacing: '0.16em', fontWeight: 700, fontSize: '0.72rem' }}>
        {title}
      </Typography>
      <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.1 }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
        {subtitle}
      </Typography>
    </Paper>
  );
}
