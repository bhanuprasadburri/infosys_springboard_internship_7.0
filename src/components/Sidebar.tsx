import { Box, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Assets', path: '/assets' },
  { label: 'Incidents', path: '/incidents' },
  { label: 'Vulnerabilities', path: '/vulnerabilities' },
  { label: 'Audit', path: '/audit' },
  { label: 'Compliance', path: '/compliance' },
  { label: 'DevSecOps', path: '/devsecops' },
];

export default function Sidebar() {
  const location = useLocation();
  return (
    <Box sx={{ width: { xs: '100%', md: 260 }, bgcolor: '#07131d', minHeight: { md: '100vh' }, py: 2, borderRight: { md: '1px solid rgba(255,255,255,0.08)' } }}>
      <Typography variant="overline" sx={{ px: 3, color: 'rgba(255,255,255,0.6)', display: 'block', mb: 2 }}>
        SecureOps
      </Typography>
      <List disablePadding>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.label}
              component={Link}
              to={item.path}
              selected={active}
              sx={{ mx: 1.5, mb: 0.75, borderRadius: 2, bgcolor: active ? 'rgba(220,38,38,0.18)' : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,0.8)' }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
