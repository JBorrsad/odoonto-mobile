import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../core/theme';

interface PatientAvatarProps {
	nombre?: string;
	apellido?: string;
	initial?: string;
}

export const PatientAvatar: React.FC<PatientAvatarProps> = ({ nombre, apellido, initial }) => {
	// HOOK: useMemo - Memoizar iniciales para evitar recálculos
	const initials = React.useMemo(() => {
		return (
			initial ||
			`${nombre?.charAt(0).toUpperCase() || ''}${apellido?.charAt(0).toUpperCase() || ''}`
		);
	}, [nombre, apellido, initial]);

	// HOOK: useMemo - Memoizar color del avatar
	const avatarColor = React.useMemo(() => {
		const colors: { [key: string]: { bg: string; text: string } } = {
			W: { bg: '#fed7aa', text: '#9a3412' }, // orange-200, orange-800
			M: { bg: '#dbeafe', text: '#1e40af' }, // blue-200, blue-800
			T: { bg: '#dbeafe', text: '#1e40af' },
			D: { bg: '#fce7f3', text: '#9f1239' }, // pink-200, pink-900
			N: { bg: '#d1fae5', text: '#065f46' }, // green-200, green-800
			B: { bg: '#fef3c7', text: '#92400e' }, // amber-200, amber-800
			A: { bg: '#dbeafe', text: '#1e40af' },
			J: { bg: '#d1fae5', text: '#065f46' },
			K: { bg: '#fce7f3', text: '#9f1239' },
			MM: { bg: '#dbeafe', text: '#1e40af' },
			JH: { bg: '#d1fae5', text: '#065f46' },
		};

		const color = colors[initials] || { bg: theme.colors.gray[100], text: theme.colors.gray[700] };
		return color;
	}, [initials]);

	return (
		<View style={[styles.avatar, { backgroundColor: avatarColor.bg }]}>
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

