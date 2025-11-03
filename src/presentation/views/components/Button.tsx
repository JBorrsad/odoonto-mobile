import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { theme } from '../../../core/theme';

interface ButtonProps {
	title: string;
	onPress: () => void;
	variant?: 'primary' | 'secondary' | 'danger' | 'success';
	disabled?: boolean;
	loading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
	title,
	onPress,
	variant = 'primary',
	disabled = false,
	loading = false,
}) => {
	const variantStyles = {
		primary: { backgroundColor: theme.colors.primary, color: theme.colors.white },
		secondary: { backgroundColor: theme.colors.gray[200], color: theme.colors.gray[900] },
		danger: { backgroundColor: theme.colors.danger, color: theme.colors.white },
		success: { backgroundColor: theme.colors.success, color: theme.colors.white },
	};

	const style = variantStyles[variant];

	return (
		<TouchableOpacity
			style={[
				styles.button,
				{ backgroundColor: style.backgroundColor },
				(disabled || loading) && styles.disabled,
			]}
			onPress={onPress}
			disabled={disabled || loading}
			activeOpacity={0.7}
		>
			{loading ? (
				<ActivityIndicator color={style.color} />
			) : (
				<Text style={[styles.buttonText, { color: style.color }]}>{title}</Text>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		paddingVertical: theme.spacing.sm,
		paddingHorizontal: theme.spacing.md,
		borderRadius: theme.borderRadius.md,
		alignItems: 'center',
		justifyContent: 'center',
		minHeight: 44,
	},
	buttonText: {
		fontSize: theme.fontSizes.md,
		fontWeight: '600',
	},
	disabled: {
		opacity: 0.5,
	},
});

