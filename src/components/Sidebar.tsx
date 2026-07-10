import { Box, List, ListItemButton, ListItemText, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface SidebarProps {
  pathname: string;
}

const navItems = [
  { label: 'Dashboard', path: '/', enabled: true },
  { label: 'Assets', path: '/assets', enabled: true },
  { label: 'Incidents', path: '/incidents', enabled: false },
  { label: 'Vulnerabilities', path: '/vulnerabilities', enabled: false },
  { label: 'Audit', path: '/audit', enabled: false },
  { label: 'Compliance', path: '/compliance', enabled: false },
  { label: 'DevSecOps', path: '/devsecops', enabled: false },
];

export default function Sidebar({ pathname }: SidebarProps) {
  return (
    <Box sx={{ width: { xs: '100%', md: 260 }, bgcolor: '#07131d', minHeight: { md: '100vh' }, borderRight: { md: '1px solid rgba(255,255,255,0.08)' }, py: 2 }}>
      <Typography variant="overline" sx={{ px: 3, color: 'rgba(255,255,255,0.48)', display: 'block', mb: 2 }}>
        SecureOps
      </Typography>
      <List disablePadding>
        {navItems.map((item) => {
          const active = pathname === item.path;
          return (
            <ListItemButton
              key={item.label}
              component={Link}
              to={item.path}
              disabled={!item.enabled}
              selected={active}
              sx={{
                mx: 1.5,
                mb: 0.75,
                borderRadius: 2,
                color: active ? '#fff' : 'rgba(255,255,255,0.78)',
                bgcolor: active ? 'rgba(220, 38, 38, 0.18)' : 'transparent',
                '&.Mui-disabled': {
                  opacity: 0.45,
                },
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
