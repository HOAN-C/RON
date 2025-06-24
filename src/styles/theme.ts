export const theme = {
  colors: {
    background: '#0e0e0e',
    surface: '#1f1f1f',
    text: {
      primary: '#e0e0e0',
      secondary: '#9ca3af',
    },
    team: {
      a: '#ef4444',
      b: '#3b82f6',
      aTransparent: 'rgba(59, 130, 246, 0.2)',
      bTransparent: 'rgba(239, 68, 68, 0.2)',
    },
  },
} as const;

export type Theme = typeof theme;
