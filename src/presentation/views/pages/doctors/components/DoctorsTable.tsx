import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../../../core/theme';
import { FormattedDoctor } from '../hooks/useFormattedDoctors';
import { DoctorsTableRow } from './DoctorsTableRow';

interface DoctorsTableProps {
	doctors: FormattedDoctor[];
	onEdit: (doctor: any) => void;
	onDelete: (doctorId: string) => void;
}

export const DoctorsTable: React.FC<DoctorsTableProps> = ({ doctors, onEdit, onDelete }) => {
	if (doctors.length === 0) {
		return (
			<View style={styles.emptyContainer}>
				<Text style={styles.emptyText}>
					No se encontraron doctores en la base de datos. Por favor, verifica la conexión al
					servidor o agrega nuevos doctores.
				</Text>
			</View>
		);
	}

	return (
		<ScrollView horizontal style={styles.tableContainer}>
			<View style={styles.table}>
				<View style={styles.tableHeader}>
					<Text style={styles.tableHeaderText}>NAME</Text>
					<Text style={styles.tableHeaderText}>CONTACT</Text>
					<Text style={styles.tableHeaderText}>WORKING DAYS</Text>
					<Text style={styles.tableHeaderText}>ASSIGNED TREATMENT</Text>
					<Text style={styles.tableHeaderText}>TYPE</Text>
					<Text style={styles.tableHeaderText}></Text>
				</View>

				{doctors.map(doctor => (
					<DoctorsTableRow
						key={doctor.id}
						doctor={doctor}
						onEdit={onEdit}
						onDelete={onDelete}
					/>
				))}
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
	emptyContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: theme.spacing.md,
		backgroundColor: theme.colors.white,
		borderRadius: theme.borderRadius.md,
		margin: theme.spacing.md,
	},
	emptyText: {
		fontSize: theme.fontSizes.md,
		color: theme.colors.gray[500],
		textAlign: 'center',
	},
});
