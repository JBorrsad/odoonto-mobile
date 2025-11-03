import React from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { theme } from '../../../../../core/theme';

interface DoctorSelectFieldProps {
	label: string;
	value: string;
	doctorName?: string;
	error?: string;
	editable?: boolean;
}

export const DoctorSelectField: React.FC<DoctorSelectFieldProps> = ({
	label,
	value,
	doctorName,
	error,
	editable = false,
}) => {
	return (
		<View style={styles.field}>
			<Text style={styles.label}>{label}</Text>
			<TextInput
				style={[styles.input, error && styles.inputError]}
				value={value ? doctorName || '' : ''}
				placeholder="Seleccionar doctor"
				editable={editable}
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
	input: {
		borderWidth: 1,
		borderColor: theme.colors.gray[300],
		borderRadius: theme.borderRadius.md,
		padding: theme.spacing.sm,
		fontSize: theme.fontSizes.md,
		color: theme.colors.gray[900],
		backgroundColor: theme.colors.white,
	},
	inputError: {
		borderColor: theme.colors.danger,
	},
	errorText: {
		fontSize: theme.fontSizes.xs,
		color: theme.colors.danger,
		marginTop: theme.spacing.xs,
	},
});
