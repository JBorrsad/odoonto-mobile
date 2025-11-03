import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { theme } from '../../../../core/theme';
import { FormattedDoctor } from '../hooks/useFormattedDoctors';
import { DoctorAvatar } from '../../../components/DoctorAvatar';
import { WorkingDays } from '../../../components/WorkingDays';

interface DoctorsTableRowProps {
	doctor: FormattedDoctor;
	onEdit: (doctor: any) => void;
	onDelete: (doctorId: string) => void;
}

export const DoctorsTableRow: React.FC<DoctorsTableRowProps> = ({ doctor, onEdit, onDelete }) => {
	const handleMenuPress = () => {
		Alert.alert(
			'Opciones',
			'Selecciona una opción',
			[
				{
					text: 'Editar',
					onPress: () => onEdit(doctor),
				},
				{
					text: 'Eliminar',
					style: 'destructive',
					onPress: () => onDelete(doctor.id),
				},
				{
					text: 'Cancelar',
					style: 'cancel',
				},
			]
		);
	};

	return (
		<View style={styles.tableRow}>
			<View style={styles.tableCell}>
				<View style={styles.doctorNameCell}>
					<DoctorAvatar nombreCompleto={doctor.nombreCompleto} initial={doctor.initials} />
					<View style={styles.doctorNameInfo}>
						<Text style={styles.doctorNameText}>{doctor.nombreCompleto}</Text>
						<Text style={styles.doctorSpecialtyText}>Pediatric Dentistry</Text>
					</View>
				</View>
			</View>
			<View style={styles.tableCell}>
				<Text style={styles.tableCellText}>{doctor.phone}</Text>
				<Text style={styles.tableCellTextSmall}>{doctor.email}</Text>
			</View>
			<View style={styles.tableCell}>
				<WorkingDays days={doctor.workingDays} />
			</View>
			<View style={styles.tableCell}>
				<Text style={styles.tableCellText}>
					{doctor.services.join(', ')}
					{doctor.services.length > 1 && (
						<Text style={styles.tableCellTextSmall}>
							{' '}
							+{doctor.services.length - 1}
						</Text>
					)}
				</Text>
			</View>
			<View style={styles.tableCell}>
				<View
					style={[
						styles.typeBadge,
						doctor.isFullTime ? styles.typeBadgeFullTime : styles.typeBadgePartTime,
					]}
				>
					<Text
						style={[
							styles.typeBadgeText,
							doctor.isFullTime ? styles.typeBadgeTextFullTime : styles.typeBadgeTextPartTime,
						]}
					>
						{doctor.isFullTime ? 'FULL-TIME' : 'PART-TIME'}
					</Text>
				</View>
			</View>
			<View style={styles.tableCell}>
				<TouchableOpacity style={styles.menuButton} onPress={handleMenuPress}>
					<Text style={styles.menuButtonText}>⋮</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
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
	doctorNameCell: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.spacing.sm,
	},
	doctorNameInfo: {
		flex: 1,
	},
	doctorNameText: {
		fontSize: theme.fontSizes.sm,
		fontWeight: '600',
		color: theme.colors.gray[900],
	},
	doctorSpecialtyText: {
		fontSize: theme.fontSizes.xs,
		color: theme.colors.gray[500],
		marginTop: theme.spacing.xs / 2,
	},
	tableCellText: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.primary,
	},
	tableCellTextSmall: {
		fontSize: theme.fontSizes.xs,
		color: theme.colors.gray[500],
	},
	typeBadge: {
		paddingHorizontal: theme.spacing.sm,
		paddingVertical: theme.spacing.xs,
		borderRadius: theme.borderRadius.full,
		alignSelf: 'flex-start',
	},
	typeBadgeFullTime: {
		backgroundColor: theme.colors.success + '20',
	},
	typeBadgePartTime: {
		backgroundColor: theme.colors.warning + '20',
	},
	typeBadgeText: {
		fontSize: theme.fontSizes.xs,
		fontWeight: '600',
	},
	typeBadgeTextFullTime: {
		color: theme.colors.success,
	},
	typeBadgeTextPartTime: {
		color: theme.colors.warning,
	},
	menuButton: {
		padding: theme.spacing.xs,
		alignSelf: 'flex-end',
	},
	menuButtonText: {
		fontSize: theme.fontSizes.xl,
		color: theme.colors.gray[400],
	},
});
