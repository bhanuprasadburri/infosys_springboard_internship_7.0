import { createTheme } from '@mui/material/styles';

export const createAppTheme = (mode: 'light' | 'dark' = 'light') => {
  const isDark = mode === 'dark';
  const palette = {
    mode,
    primary: { main: '#2563EB', light: '#60A5FA', dark: '#1D4ED8', contrastText: '#FFFFFF' },
    secondary: { main: '#7C3AED', light: '#A78BFA', dark: '#5B21B6', contrastText: '#FFFFFF' },
    success: { main: '#16A34A' },
    warning: { main: '#D97706' },
    error: { main: '#E11D48' },
    background: {
      default: isDark ? '#07111F' : '#F8FAFC',
      secondary: isDark ? '#0F172A' : '#F8FAFC',
      paper: isDark ? '#111C2F' : '#FFFFFF',
    },
    text: { primary: isDark ? '#E5EEF9' : '#111827', secondary: isDark ? '#94A3B8' : '#64748B' },
    divider: isDark ? 'rgba(148, 163, 184, 0.24)' : '#E2E8F0',
  };

  return createTheme({
    palette,
    typography: {
      fontFamily: ['Inter', 'Roboto', 'Segoe UI', 'system-ui', 'sans-serif'].join(','),
      h1: { fontWeight: 700, color: palette.text.primary },
      h2: { fontWeight: 700, color: palette.text.primary },
      h3: { fontWeight: 600, color: palette.text.primary },
      h4: { fontWeight: 700, color: palette.text.primary },
      h5: { fontWeight: 700, color: palette.text.primary },
      h6: { fontWeight: 700, color: palette.text.primary },
      body1: { color: palette.text.primary },
      body2: { color: palette.text.secondary },
      button: { textTransform: 'none', fontWeight: 600 },
      caption: { color: palette.text.secondary, lineHeight: 1.5 },
    },
    shape: { borderRadius: 14 },
    spacing: 8,
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: palette.background.default,
            color: palette.text.primary,
            WebkitFontSmoothing: 'antialiased',
            transition: 'background-color 200ms ease, color 200ms ease',
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '10px 16px',
            transition: 'all 200ms ease',
            boxShadow: 'none',
          },
          containedPrimary: {
            background: 'linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)',
            boxShadow: '0 10px 24px rgba(37,99,235,0.18)',
          },
          outlined: {
            borderWidth: 1,
            borderColor: isDark ? 'rgba(148, 163, 184, 0.3)' : 'rgba(15, 23, 42, 0.08)',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            backgroundClip: 'padding-box',
            boxShadow: isDark ? '0 16px 42px rgba(2, 6, 23, 0.36)' : '0 12px 34px rgba(15, 23, 42, 0.06)',
            transition: 'box-shadow 200ms ease, background-color 200ms ease',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: isDark ? '0 16px 42px rgba(2, 6, 23, 0.32)' : '0 14px 36px rgba(15, 23, 42, 0.06)',
            border: `1px solid ${palette.divider}`,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.72)' : '#FFFFFF',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: palette.divider,
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 18,
            padding: 8,
            boxShadow: isDark ? '0 20px 50px rgba(2, 6, 23, 0.45)' : '0 20px 50px rgba(15, 23, 42, 0.12)',
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            background: palette.background.secondary,
            borderRight: `1px solid ${palette.divider}`,
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: {
            borderBottom: `1px solid ${palette.divider}`,
            paddingTop: 12,
            paddingBottom: 12,
          },
          head: {
            fontWeight: 700,
            color: palette.text.secondary,
            backgroundColor: palette.background.secondary,
          },
        },
      },
      MuiSnackbarContent: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            boxShadow: isDark ? '0 12px 30px rgba(2, 6, 23, 0.35)' : '0 10px 26px rgba(15, 23, 42, 0.08)',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            fontWeight: 600,
          },
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            transition: 'all 200ms ease',
          },
        },
      },
    },
  });
};

export default createAppTheme('light');
