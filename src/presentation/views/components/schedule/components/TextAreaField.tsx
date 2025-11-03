import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { theme } from '../../../../../core/theme';

interface TextAreaFieldProps {
	label: string;
	value: string;
	onChangeText: (value: string) => void;
	placeholder?: string;
	error?: string;
	editable?: boolean;
}

export const TextAreaField: React.FC<TextAreaFieldProps> = ({
	label,
	value,
	onChangeText,
	placeholder,
	error,
	editable = true,
}) => {
	return (
		<View style={styles.field}>
			<Text style={styles.label}>{label}</Text>
			<TextInput
				style={styles.textArea}
				value={value}
				onChangeText={onChangeText}
				placeholder={placeholder}
				multiline
				numberOfLines={3}
				editable={editable}
				textAlignVertical="top"
			/>
			{error && <Text style={styles.errorText}>{error}</Text>}
		</View>
	);
};

const styles = StyleSheet.create({
	field: {
		marginBottom: theme.spacing.md,
	},
	label: {
		fontSize: theme.fontSizes.sm,
		fontWeight: '600',
		color: theme.colors.gray[700],
		marginBottom: theme.spacing.xs,
	},
	textArea: {
		borderWidth: 1,
		borderColor: theme.colors.gray[300],
		borderRadius: theme.borderRadius.md,
		padding: theme.spacing.sm,
		fontSize: theme.fontSizes.md,
		color: theme.colors.gray[900],
		backgroundColor: theme.colors.white,
		minHeight: 80,
	},
	errorText: {
		fontSize: theme.fontSizes.xs,
		color: theme.colors.danger,
		marginTop: theme.spacing.xs,
	},
});
