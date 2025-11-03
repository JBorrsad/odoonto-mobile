import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../../../../../core/theme';

interface PatientsHeaderProps {
	patientCount: number;
	viewMode: 'table' | 'grid';
	onViewModeChange: (mode: 'table' | 'grid') => void;
	searchQuery: string;
	onSearchChange: (query: string) => void;
}

export const PatientsHeader: React.FC<PatientsHeaderProps> = ({
	patientCount,
	viewMode,
	onViewModeChange,
	searchQuery,
	onSearchChange,
}) => {
	const router = useRouter();

	return (
		<View>
			{/* Header con contador y botones */}
			<View style={styles.header}>
				<View style={styles.headerLeft}>
					<Text style={styles.patientCount}>{patientCount || 0}</Text>
					<Text style={styles.patientCountLabel}>total patients</Text>
				</View>

				<View style={styles.headerRight}>
					{/* Botón de filtro */}
					<TouchableOpacity style={styles.filterButton}>
						<Text style={styles.filterIcon}>⚙</Text>
					</TouchableOpacity>

					{/* Botones de vista */}
					<View style={styles.viewModeButtons}>
						<TouchableOpacity
							style={[
								styles.viewModeButton,
								styles.viewModeButtonLeft,
								viewMode === 'grid' && styles.viewModeButtonActive,
							]}
							onPress={() => onViewModeChange('grid')}
						>
							<Text style={[styles.viewModeIcon, viewMode === 'grid' && styles.viewModeIconActive]}>
								⊞
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							style={[
								styles.viewModeButton,
								styles.viewModeButtonRight,
								viewMode === 'table' && styles.viewModeButtonActive,
							]}
							onPress={() => onViewModeChange('table')}
						>
							<Text style={[styles.viewModeIcon, viewMode === 'table' && styles.viewModeIconActive]}>
								☰
							</Text>
						</TouchableOpacity>
					</View>

					{/* Botón de añadir paciente */}
					<TouchableOpacity style={styles.addButton} onPress={() => router.push('/patients/new')}>
						<Text style={styles.addButtonIcon}>+</Text>
						<Text style={styles.addButtonText}>Add Patient</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* Búsqueda */}
			<View style={styles.searchContainer}>
				<TextInput
					style={styles.searchInput}
					placeholder="Buscar pacientes..."
					value={searchQuery}
					onChangeText={onSearchChange}
					placeholderTextColor={theme.colors.gray[400]}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: theme.spacing.md,
		backgroundColor: theme.colors.white,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.gray[200],
	},
	headerLeft: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	patientCount: {
		fontSize: theme.fontSizes.md,
		fontWeight: '600',
		color: theme.colors.gray[900],
		marginRight: theme.spacing.xs,
	},
	patientCountLabel: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.gray[500],
	},
	headerRight: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.spacing.sm,
	},
	filterButton: {
		padding: theme.spacing.sm,
		backgroundColor: theme.colors.gray[100],
		borderRadius: theme.borderRadius.md,
	},
	filterIcon: {
		fontSize: theme.fontSizes.md,
	},
	viewModeButtons: {
		flexDirection: 'row',
		borderWidth: 1,
		borderColor: theme.colors.gray[300],
		borderRadius: theme.borderRadius.md,
		overflow: 'hidden',
	},
	viewModeButton: {
		padding: theme.spacing.sm,
		backgroundColor: theme.colors.white,
	},
	viewModeButtonLeft: {
		borderRightWidth: 1,
		borderRightColor: theme.colors.gray[300],
	},
	viewModeButtonRight: {},
	viewModeButtonActive: {
		backgroundColor: theme.colors.primary + '20',
	},
	viewModeIcon: {
		fontSize: theme.fontSizes.md,
		color: theme.colors.gray[500],
	},
	viewModeIconActive: {
		color: theme.colors.primary,
	},
	addButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: theme.colors.primary,
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
		borderRadius: theme.borderRadius.md,
	},
	addButtonIcon: {
		color: theme.colors.white,
		fontSize: theme.fontSizes.md,
		marginRight: theme.spacing.xs,
		fontWeight: '600',
	},
	addButtonText: {
		color: theme.colors.white,
		fontWeight: '600',
		fontSize: theme.fontSizes.sm,
	},
	searchContainer: {
		padding: theme.spacing.md,
		backgroundColor: theme.colors.white,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.gray[200],
	},
	searchInput: {
		backgroundColor: theme.colors.gray[100],
		padding: theme.spacing.sm,
		borderRadius: theme.borderRadius.md,
		fontSize: theme.fontSizes.md,
		color: theme.colors.gray[900],
	},
});


