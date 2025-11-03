import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../../../core/theme';
import { LesionTypeOption } from '../types';

interface OdontogramLegendProps {
	lesionTypes: LesionTypeOption[];
}

export const OdontogramLegend: React.FC<OdontogramLegendProps> = ({ lesionTypes }) => {
	return (
		<View style={styles.legendContainer}>
			<Text style={styles.legendTitle}>Leyenda:</Text>
			<View style={styles.legendGrid}>
				{lesionTypes.map(type => (
					<View key={type.value} style={styles.legendItem}>
						<View style={[styles.legendColor, { backgroundColor: type.color }]} />
						<Text style={styles.legendLabel}>{type.label}</Text>
					</View>
				))}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	legendContainer: {
		marginTop: theme.spacing.md,
		padding: theme.spacing.sm,
		backgroundColor: theme.colors.gray[50],
		borderRadius: theme.borderRadius.md,
		borderWidth: 1,
		borderColor: theme.colors.gray[200],
	},
	legendTitle: {
		fontSize: theme.fontSizes.sm,
		fontWeight: '600',
		color: theme.colors.gray[700],
		marginBottom: theme.spacing.sm,
	},
	legendGrid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		gap: theme.spacing.sm,
	},
	legendItem: {
		flexDirection: 'row',
		alignItems: 'center',
		marginRight: theme.spacing.md,
	},
	legendColor: {
		width: 12,
		height: 12,
		borderRadius: 2,
		marginRight: theme.spacing.xs,
	},
	legendLabel: {
		fontSize: theme.fontSizes.xs,
		color: theme.colors.gray[700],
	},
});
