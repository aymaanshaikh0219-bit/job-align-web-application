/**
 * JobAlign — Minimal Forest theme
 * Clean, accessible light and dark modes.
 */

export const theme = {
  brandName: 'JobAlign',
  tagline: 'Career companion',
  description:
    'Upload your resume, see how well you match each role, and find the skills worth learning next.',
  projectLabel: 'AVISHKAR Student Project',
  logoText: 'J',
  logoSrc: null as string | null,

  radius: '0.625rem',

  colors: {
    light: {
      background: '#F8FAF6',
      foreground: '#26352B',

      surface: '#FFFFFF',
      muted: '#EEF2EC',
      mutedForeground: '#657267',

      border: '#E0E6DD',

      primary: '#315B43',
      primaryForeground: '#FFFFFF',

      accent: '#E1EBDF',
      accentForeground: '#26352B',

      success: '#34734A',
      warning: '#986719',
      danger: '#B33D3D',
    },

    dark: {
      background: '#171F19',
      foreground: '#E8EEE8',

      surface: '#202A22',
      muted: '#29342B',
      mutedForeground: '#B1BDB1',

      border: '#364338',

      primary: '#A9C8AE',
      primaryForeground: '#1C2B20',

      accent: '#354A39',
      accentForeground: '#E8EEE8',

      success: '#8CC99A',
      warning: '#E5C178',
      danger: '#F09A9A',
    },
  },
}

type Palette = {
  background: string
  foreground: string
  surface: string
  muted: string
  mutedForeground: string
  border: string
  primary: string
  primaryForeground: string
  accent: string
  accentForeground: string
  success: string
  warning: string
  danger: string
}

function paletteToVars(p: Palette): string {
  return `
  --background: ${p.background};
  --foreground: ${p.foreground};
  --card: ${p.surface};
  --card-foreground: ${p.foreground};
  --popover: ${p.surface};
  --popover-foreground: ${p.foreground};
  --primary: ${p.primary};
  --primary-foreground: ${p.primaryForeground};
  --secondary: ${p.muted};
  --secondary-foreground: ${p.foreground};
  --muted: ${p.muted};
  --muted-foreground: ${p.mutedForeground};
  --accent: ${p.accent};
  --accent-foreground: ${p.accentForeground};
  --destructive: ${p.danger};
  --success: ${p.success};
  --warning: ${p.warning};
  --border: ${p.border};
  --input: ${p.border};
  --ring: ${p.primary};
  `
}

export const themeInitScript = `
try {
  var t = localStorage.getItem('jobalign-theme');

  if (
    t === 'dark' ||
    (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}
`

export function themeToCss(): string {
  return `
    :root {
      ${paletteToVars(theme.colors.light)}
      --radius: ${theme.radius};
    }

    .dark {
      ${paletteToVars(theme.colors.dark)}
    }
  `
}
