import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#5b3df5' },
    secondary: { main: '#19a974' },
    background: {
      default: '#f6f7fb',
      paper: '#ffffff',
    },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily:
      'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h6: { fontWeight: 600 },
  },
});
