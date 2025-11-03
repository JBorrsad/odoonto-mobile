import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../core/theme';

interface DoctorAvatarProps {
	nombreCompleto?: string;
	initial?: string;
}

export const DoctorAvatar: React.FC<DoctorAvatarProps> = ({ nombreCompleto, initial }) => {
	// HOOK: useMemo - Memoizar iniciales para evitar recálculos
	const initials = React.useMemo(() => {
		if (initial) return initial;
		if (nombreCompleto) {
			const parts = nombreCompleto.split(' ');
			return `${parts[0]?.charAt(0).toUpperCase() || ''}${
				parts.length > 1 ? parts[1].charAt(0).toUpperCase() : ''
			}`;
		}
		return 'DR';
	}, [nombreCompleto, initial]);

	// HOOK: useMemo - Memoizar color del avatar
	const avatarColor = React.useMemo(() => {
		const colors: { [key: string]: { bg: string; text: string } } = {
			R: { bg: '#fce7f3', text: '#9f1239' }, // pink-200, pink-900
			D: { bg: '#dbeafe', text: '#1e40af' }, // blue-200, blue-800
			P: { bg: '#dbeafe', text: '#1e40af' },
			J: { bg: '#d1fae5', text: '#065f46' }, // green-200, green-800
			M: { bg: '#e9d5ff', text: '#6b21a8' }, // violet-200, violet-900
			DR: { bg: '#fef3c7', text: '#92400e' }, // amber-200, amber-800
		};

		const color = colors[initials] || { bg: theme.colors.gray[100], text: theme.colors.gray[700] };
		return color;
	}, [initials]);

	return (
		<View
			style={[
				styles.avatar,
				{ backgroundColor: avatarColor.bg },
			]}
		>
			<Text style={[styles.avatarText, { color: avatarColor.text }]}>{initials}</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	avatar: {
		width: 32,
		height: 32,
		borderRadius: 16,
		alignItems: 'center',
		justifyContent: 'center',
	},
	avatarText: {
		fontSize: theme.fontSizes.sm,
		fontWeight: '600',
	},
});


