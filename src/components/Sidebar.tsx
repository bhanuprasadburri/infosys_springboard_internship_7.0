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
    <Box sx={{ width: { xs: '100%', md: 270 }, bgcolor: 'background.paper', minHeight: { md: '100vh' }, py: 2.5, borderRight: { md: '1px solid' }, borderColor: 'divider', position: { md: 'sticky' }, top: 0 }}>
      <Typography variant="overline" sx={{ px: 3, color: 'text.secondary', display: 'block', mb: 2, fontWeight: 700, letterSpacing: '0.18em' }}>
        SecureOps
      </Typography>
      <List disablePadding sx={{ px: 1.5 }}>
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <ListItemButton
              key={item.label}
              component={Link}
              to={item.path}
              selected={active}
              sx={{
                mb: 0.75,
                px: 1.75,
                py: 1.1,
                borderRadius: 1.75,
                bgcolor: active ? 'primary.main' : 'transparent',
                color: active ? 'common.white' : 'text.secondary',
                fontWeight: active ? 700 : 500,
                '& .MuiListItemText-primary': { fontSize: '0.95rem' },
                '&:hover': { bgcolor: active ? 'primary.dark' : 'action.hover', color: active ? 'common.white' : 'text.primary' },
                transition: 'all 200ms ease',
              }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );
}
