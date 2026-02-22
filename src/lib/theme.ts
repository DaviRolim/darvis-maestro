export const theme = {
  bg: '#0D0D0F',
  cardBg: '#1A1A1F',
  cardBorder: '#2E2E38',
  headerBg: '#121217',
  neonPurple: '#AD4DFF',
  neonMagenta: '#ED45AD',
  neonCyan: '#4DD9F2',
  statusGreen: '#4DD973',
  statusAmber: '#F2BF33',
  statusGray: '#80808C',
  statusRed: '#F24D59',
  textPrimary: '#EBEBF2',
  textSecondary: '#8C8C9E',
  textMuted: '#616173',
} as const;

export const statusColors: Record<string, string> = {
  planning: theme.neonPurple,
  executing: theme.neonCyan,
  measuring: theme.statusAmber,
  proven: theme.statusGreen,
  archived: theme.statusGray,
};

export const statusLabels: Record<string, string> = {
  planning: 'Planning',
  executing: 'Executing',
  measuring: 'Measuring',
  proven: 'Proven',
  archived: 'Archived',
};
