import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../../core/theme';
import { Button } from '../../../components/Button';

interface DoctorsStatsProps {
	doctorCount: number;
	onAddDoctor: () => void;
}

export const DoctorsStats: React.FC<DoctorsStatsProps> = ({ doctorCount, onAddDoctor }) => {
	return (
		<View style={styles.statsContainer}>
			<View style={styles.statsLeft}>
				<Text style={styles.doctorCount}>{doctorCount}</Text>
				<Text style={styles.doctorCountLabel}>Doctor</Text>
			</View>
			<View style={styles.statsRight}>
				<TouchableOpacity style={styles.filterButton}>
					<Text style={styles.filterButtonText}>Filters</Text>
				</TouchableOpacity>
				<Button title="Add Doctor" onPress={onAddDoctor} variant="primary" />
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	statsContainer: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: theme.spacing.md,
		backgroundColor: theme.colors.white,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.gray[200],
	},
	statsLeft: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	doctorCount: {
		fontSize: theme.fontSizes.xl,
		fontWeight: '600',
		color: theme.colors.gray[800],
		marginRight: theme.spacing.xs,
	},
	doctorCountLabel: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.gray[500],
	},
	statsRight: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: theme.spacing.sm,
	},
	filterButton: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: theme.colors.gray[100],
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
		borderRadius: theme.borderRadius.md,
		gap: theme.spacing.xs,
	},
	filterButtonText: {
		fontSize: theme.fontSizes.sm,
		fontWeight: '600',
		color: theme.colors.gray[700],
	},
});
