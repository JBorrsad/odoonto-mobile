import React, { useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../../../../../core/theme';
import { PatientAvatar } from '../../../../../presentation/views/components/PatientAvatar';
import { FormattedPatient } from '../hooks/usePatientsPage';

interface PatientsTableProps {
	patients: FormattedPatient[];
	onPatientPress: (patientId: string) => void;
}

export const PatientsTable: React.FC<PatientsTableProps> = ({ patients, onPatientPress }) => {
	// HOOK: useCallback - Renderizar fila de tabla
	const renderTableRow = useCallback(
		(item: FormattedPatient) => (
			<TouchableOpacity
				key={item.id}
				style={styles.tableRow}
				onPress={() => onPatientPress(item.id)}
			>
				<View style={styles.tableCell}>
					<View style={styles.patientNameCell}>
						<PatientAvatar nombre={item.nombre} apellido={item.apellido} initial={item.initials} />
						<Text style={styles.patientNameText}>{item.name}</Text>
					</View>
				</View>
				<View style={styles.tableCell}>
					<Text style={styles.tableCellText}>{item.phone}</Text>
				</View>
				<View style={styles.tableCell}>
					<Text style={styles.tableCellText}>{item.email}</Text>
				</View>
				<View style={styles.tableCell}>
					<Text style={styles.tableCellText}>{item.address}</Text>
				</View>
				<View style={styles.tableCell}>
					<Text style={styles.tableCellText}>{item.registered}</Text>
				</View>
				<View style={styles.tableCell}>
					<Text style={styles.tableCellText}>{item.lastVisit}</Text>
				</View>
				<View style={styles.tableCell}>
					<Text style={[styles.tableCellText, styles.lastTreatmentText]}>
						{item.lastTreatment}
					</Text>
				</View>
			</TouchableOpacity>
		),
		[onPatientPress]
	);

	return (
		<ScrollView horizontal style={styles.tableContainer}>
			<View style={styles.table}>
				{/* Header de tabla */}
				<View style={styles.tableHeader}>
					<Text style={styles.tableHeaderText}>Patient Name</Text>
					<Text style={styles.tableHeaderText}>Phone</Text>
					<Text style={styles.tableHeaderText}>Email</Text>
					<Text style={styles.tableHeaderText}>Address</Text>
					<Text style={styles.tableHeaderText}>Registered</Text>
					<Text style={styles.tableHeaderText}>Last Visit</Text>
					<Text style={styles.tableHeaderText}>Last Treatment</Text>
				</View>

				{/* Filas de tabla */}
				{patients.map(item => renderTableRow(item))}
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	tableContainer: {
		flex: 1,
	},
	table: {
		backgroundColor: theme.colors.white,
		borderRadius: theme.borderRadius.md,
		overflow: 'hidden',
		minWidth: '100%',
	},
	tableHeader: {
		flexDirection: 'row',
		backgroundColor: theme.colors.white,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.gray[200],
		padding: theme.spacing.md,
	},
	tableHeaderText: {
		fontSize: theme.fontSizes.xs,
		fontWeight: '600',
		color: theme.colors.gray[500],
		textTransform: 'uppercase',
		flex: 1,
		minWidth: 120,
	},
	tableRow: {
		flexDirection: 'row',
		padding: theme.spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.gray[200],
	},
	tableCell: {
		flex: 1,
		minWidth: 120,
		justifyContent: 'center',
	},
	patientNameCell: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.spacing.sm,
	},
	patientNameText: {
		fontSize: theme.fontSizes.sm,
		fontWeight: '600',
		color: theme.colors.gray[900],
	},
	tableCellText: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.gray[500],
	},
	lastTreatmentText: {
		color: theme.colors.gray[900],
	},
});

