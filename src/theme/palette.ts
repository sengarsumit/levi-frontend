import type { PaletteOptions } from '@mui/material/styles';

// Split-complementary scheme: teal primary, coral secondary/accent. Error/warning/info/success
// are deliberately kept hue-distinct from both brand colors (warning is shifted toward amber
// rather than a coral-adjacent orange, success toward lime rather than a teal-adjacent green) so
// status colors never read as "another shade of the brand" on badges/chips.
//
// Dark mode is not an inversion of light mode: hues are lightened/desaturated rather than kept
// fully saturated (which would glow/vibrate against a dark background), the background is a
// teal-tinted near-black rather than pure #000/#121212, `paper` is one step lighter for tonal
// elevation, and text is off-white rather than pure white to reduce halation.

export const lightPalette: PaletteOptions = {
  mode: 'light',
  primary: { main: '#0D9488', light: '#2DD4BF', dark: '#115E59' },
  secondary: { main: '#F0653E', light: '#FF8B6B', dark: '#C2410C' },
  error: { main: '#DC2626' },
  warning: { main: '#CA8A04' },
  info: { main: '#0284C7' },
  success: { main: '#65A30D' },
  background: { default: '#F7FAF9', paper: '#FFFFFF' },
  text: { primary: '#0B1F1C', secondary: '#4B6461' },
  divider: '#DCEAE7',
};

export const darkPalette: PaletteOptions = {
  mode: 'dark',
  primary: { main: '#2DD4BF', light: '#5EEAD4', dark: '#14B8A6' },
  secondary: { main: '#FF9478', light: '#FFB199', dark: '#E56B4C' },
  error: { main: '#F87171' },
  warning: { main: '#FBBF24' },
  info: { main: '#38BDF8' },
  success: { main: '#84CC16' },
  background: { default: '#0C1614', paper: '#14201D' },
  text: { primary: '#E6F2F0', secondary: '#93ACA8' },
  divider: '#1F2E2A',
};
