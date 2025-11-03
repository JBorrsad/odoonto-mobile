import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../../../core/theme';

interface PatientSelectFieldProps {
	label: string;
	value: string;
	patientName?: string;
	error?: string;
	disabled?: boolean;
}

export const PatientSelectField: React.FC<PatientSelectFieldProps> = ({
	label,
	value,
	patientName,
	error,
	disabled = false,
}) => {
	return (
		<View style={styles.field}>
			<Text style={styles.label}>{label}</Text>
			<View style={[styles.selectContainer, disabled && styles.selectDisabled]}>
				<Text style={styles.select}>
					{value ? patientName || 'Paciente seleccionado' : 'Seleccionar paciente'}
				</Text>
			</View>
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
	selectContainer: {
		borderWidth: 1,
		borderColor: theme.colors.gray[300],
		borderRadius: theme.borderRadius.md,
		backgroundColor: theme.colors.white,
	},
	selectDisabled: {
		backgroundColor: theme.colors.gray[100],
	},
	select: {
		padding: theme.spacing.sm,
		fontSize: theme.fontSizes.md,
		color: theme.colors.gray[900],
	},
	errorText: {
		fontSize: theme.fontSizes.xs,
		color: theme.colors.danger,
		marginTop: theme.spacing.xs,
	},
});
