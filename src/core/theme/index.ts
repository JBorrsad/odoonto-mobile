import { colors } from './colors';
import { spacing } from './spacing';

export { colors, spacing };

export const theme = {
	colors,
	spacing,
	fontSizes: {
		xs: 12,
		sm: 14,
		md: 16,
		lg: 18,
		xl: 20,
		xxl: 24,
	},
	borderRadius: {
		sm: 4,
		md: 8,
		lg: 12,
		xl: 16,
		full: 9999,
	},
} as const;

export type Theme = typeof theme;

