import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../../core/theme';
import { Button } from '../Button';

interface CalendarHeaderProps {
	date: Date;
	onPrevious: () => void;
	onNext: () => void;
	onToday: () => void;
	view: 'day' | 'week';
	onViewChange: (view: 'day' | 'week') => void;
	onDoctorChange?: (doctorId: string | null) => void;
	doctors?: any[];
	selectedDoctor?: string | null;
	appointmentsCount?: number;
}

export const CalendarHeader: React.FC<CalendarHeaderProps> = ({
	date,
	onPrevious,
	onNext,
	onToday,
	view,
	onViewChange,
	onDoctorChange,
	doctors = [],
	selectedDoctor,
	appointmentsCount = 0,
}) => {
	// HOOK: useMemo - Formatear fecha
	const formattedDate = useMemo(() => {
		return new Intl.DateTimeFormat('es-ES', {
			weekday: 'short',
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		}).format(date);
	}, [date]);

	return (
		<View style={styles.container}>
			{/* Contador de citas */}
			<View style={styles.leftSection}>
				<View style={styles.counterContainer}>
					<Text style={styles.counterIcon}>📅</Text>
					<Text style={styles.counterText}>{appointmentsCount}</Text>
				</View>
				<Text style={styles.counterLabel}>total appointments</Text>
			</View>

			{/* Navegación y fecha */}
			<View style={styles.centerSection}>
				<Button title="Today" onPress={onToday} variant="secondary" />
				<TouchableOpacity style={styles.navButton} onPress={onPrevious}>
					<Text style={styles.navIcon}>‹</Text>
				</TouchableOpacity>
				<Text style={styles.dateText}>{formattedDate}</Text>
				<TouchableOpacity style={styles.navButton} onPress={onNext}>
					<Text style={styles.navIcon}>›</Text>
				</TouchableOpacity>
			</View>

			{/* Controles de vista y filtros */}
			<View style={styles.rightSection}>
				{/* Botones de vista */}
				<View style={styles.viewButtons}>
					<TouchableOpacity
						style={[
							styles.viewButton,
							styles.viewButtonLeft,
							view === 'day' && styles.viewButtonActive,
						]}
						onPress={() => onViewChange('day')}
					>
						<Text
							style={[
								styles.viewButtonText,
								view === 'day' && styles.viewButtonTextActive,
							]}
						>
							Day
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.viewButton,
							styles.viewButtonRight,
							view === 'week' && styles.viewButtonActive,
						]}
						onPress={() => onViewChange('week')}
					>
						<Text
							style={[
								styles.viewButtonText,
								view === 'week' && styles.viewButtonTextActive,
							]}
						>
							Week
						</Text>
					</TouchableOpacity>
				</View>

				{/* Selector de doctores */}
				{onDoctorChange && (
					<View style={styles.doctorSelector}>
						<Text style={styles.doctorSelectorText}>
							{selectedDoctor
								? doctors.find(d => d.id === selectedDoctor)?.nombreCompleto || 'Doctor'
								: 'Todos los Doctores'}
						</Text>
					</View>
				)}

				{/* Botón de filtros */}
				<TouchableOpacity style={styles.filterButton}>
					<Text style={styles.filterIcon}>⚙</Text>
					<Text style={styles.filterText}>Filtros</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: theme.spacing.md,
		backgroundColor: theme.colors.white,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.gray[200],
		flexWrap: 'wrap',
		gap: theme.spacing.sm,
	},
	leftSection: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	counterContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: theme.colors.gray[50],
		borderWidth: 1,
		borderColor: theme.colors.gray[200],
		borderRadius: theme.borderRadius.md,
		padding: theme.spacing.sm,
		marginRight: theme.spacing.sm,
	},
	counterIcon: {
		fontSize: theme.fontSizes.md,
		marginRight: theme.spacing.xs,
	},
	counterText: {
		fontSize: theme.fontSizes.md,
		fontWeight: '600',
		color: theme.colors.gray[700],
	},
	counterLabel: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.gray[500],
	},
	centerSection: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.spacing.sm,
	},
	navButton: {
		width: 32,
		height: 32,
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: theme.borderRadius.full,
		backgroundColor: theme.colors.gray[100],
	},
	navIcon: {
		fontSize: theme.fontSizes.xl,
		color: theme.colors.gray[500],
		fontWeight: '600',
	},
	dateText: {
		fontSize: theme.fontSizes.md,
		fontWeight: '600',
		color: theme.colors.gray[800],
		minWidth: 150,
		textAlign: 'center',
	},
	rightSection: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.spacing.sm,
		flexWrap: 'wrap',
	},
	viewButtons: {
		flexDirection: 'row',
		borderWidth: 1,
		borderColor: theme.colors.gray[300],
		borderRadius: theme.borderRadius.md,
		overflow: 'hidden',
	},
	viewButton: {
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
		backgroundColor: theme.colors.white,
	},
	viewButtonLeft: {
		borderRightWidth: 1,
		borderRightColor: theme.colors.gray[300],
	},
	viewButtonRight: {},
	viewButtonActive: {
		backgroundColor: theme.colors.primary,
	},
	viewButtonText: {
		fontSize: theme.fontSizes.sm,
		fontWeight: '600',
		color: theme.colors.gray[700],
	},
	viewButtonTextActive: {
		color: theme.colors.white,
	},
	doctorSelector: {
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
		backgroundColor: theme.colors.white,
		borderWidth: 1,
		borderColor: theme.colors.gray[300],
		borderRadius: theme.borderRadius.md,
	},
	doctorSelectorText: {
		fontSize: theme.fontSizes.sm,
		fontWeight: '600',
		color: theme.colors.gray[700],
	},
	filterButton: {
		flexDirection: 'row',
		alignItems: 'center',
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
		backgroundColor: theme.colors.white,
		borderWidth: 1,
		borderColor: theme.colors.gray[300],
		borderRadius: theme.borderRadius.md,
		gap: theme.spacing.xs,
	},
	filterIcon: {
		fontSize: theme.fontSizes.sm,
	},
	filterText: {
		fontSize: theme.fontSizes.sm,
		fontWeight: '600',
		color: theme.colors.gray[700],
	},
});


