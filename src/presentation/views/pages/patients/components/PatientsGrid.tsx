import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { theme } from '../../../../../core/theme';
import { PatientAvatar } from '../../../../../presentation/views/components/PatientAvatar';
import { FormattedPatient } from '../hooks/usePatientsPage';

interface PatientsGridProps {
	patients: FormattedPatient[];
	onPatientPress: (patientId: string) => void;
}

export const PatientsGrid: React.FC<PatientsGridProps> = ({ patients, onPatientPress }) => {
	// HOOK: useCallback - Renderizar tarjeta en modo grid
	const renderGridCard = useCallback(
		({ item }: { item: FormattedPatient }) => (
			<TouchableOpacity style={styles.gridCard} onPress={() => onPatientPress(item.id)}>
				<View style={styles.gridCardHeader}>
					<PatientAvatar nombre={item.nombre} apellido={item.apellido} initial={item.initials} />
					<Text style={styles.gridCardName}>{item.name}</Text>
				</View>
				<View style={styles.gridCardContent}>
					<View style={styles.gridCardRow}>
						<Text style={styles.gridCardLabel}>Teléfono:</Text>
						<Text style={styles.gridCardValue}>{item.phone}</Text>
					</View>
					<View style={styles.gridCardRow}>
						<Text style={styles.gridCardLabel}>Email:</Text>
						<Text style={styles.gridCardValue}>{item.email}</Text>
					</View>
					<View style={styles.gridCardRow}>
						<Text style={styles.gridCardLabel}>Dirección:</Text>
						<Text style={styles.gridCardValue} numberOfLines={1}>
							{item.address}
						</Text>
					</View>
					<View style={styles.gridCardRow}>
						<Text style={styles.gridCardLabel}>Registrado:</Text>
						<Text style={styles.gridCardValue}>{item.registered}</Text>
					</View>
				</View>
			</TouchableOpacity>
		),
		[onPatientPress]
	);

	return (
		<FlatList
			data={patients}
			renderItem={({ item }) => (
				<View style={styles.cardContainer}>{renderGridCard({ item })}</View>
			)}
			keyExtractor={item => item.id}
			contentContainerStyle={styles.gridContainer}
			numColumns={2}
		/>
	);
};

const styles = StyleSheet.create({
	gridContainer: {
		padding: theme.spacing.md,
		gap: theme.spacing.md,
	},
	cardContainer: {
		flex: 1,
		paddingHorizontal: theme.spacing.xs,
	},
	gridCard: {
		flex: 1,
		backgroundColor: theme.colors.white,
		borderRadius: theme.borderRadius.md,
		padding: theme.spacing.md,
		shadowColor: theme.colors.black,
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 5,
	},
	gridCardHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: theme.spacing.md,
		gap: theme.spacing.sm,
	},
	gridCardName: {
		fontSize: theme.fontSizes.md,
		fontWeight: '600',
		color: theme.colors.gray[900],
	},
	gridCardContent: {
		gap: theme.spacing.xs,
	},
	gridCardRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
	},
	gridCardLabel: {
		fontSize: theme.fontSizes.xs,
		color: theme.colors.gray[500],
	},
	gridCardValue: {
		fontSize: theme.fontSizes.xs,
		color: theme.colors.gray[900],
		flex: 1,
		textAlign: 'right',
	},
});

