import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../../../../core/theme';
import { Face, LesionType } from '../types';
import { Tooth } from './Tooth';

interface OdontogramViewProps {
	upperTeeth: string[];
	lowerTeeth: string[];
	toothData: { [key: string]: { [face: string]: LesionType } };
	getFaceColor: (toothId: string, face: Face) => string;
	onFaceClick: (toothId: string, face: Face) => void;
	isEditable: boolean;
	loading: boolean;
}

export const OdontogramView: React.FC<OdontogramViewProps> = ({
	upperTeeth,
	lowerTeeth,
	toothData,
	getFaceColor,
	onFaceClick,
	isEditable,
	loading,
}) => {
	return (
		<ScrollView horizontal showsHorizontalScrollIndicator={true}>
			<View style={styles.odontogramContainer}>
				<View style={styles.teethRow}>
					{upperTeeth.map(toothId => (
						<Tooth
							key={toothId}
							toothId={toothId}
							isUpper={true}
							toothData={toothData[toothId] || {}}
							getFaceColor={getFaceColor}
							onFaceClick={onFaceClick}
							isEditable={isEditable}
							loading={loading}
						/>
					))}
				</View>

				<View style={styles.divider} />

				<View style={styles.teethRow}>
					{lowerTeeth.map(toothId => (
						<Tooth
							key={toothId}
							toothId={toothId}
							isUpper={false}
							toothData={toothData[toothId] || {}}
							getFaceColor={getFaceColor}
							onFaceClick={onFaceClick}
							isEditable={isEditable}
							loading={loading}
						/>
					))}
				</View>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	odontogramContainer: {
		padding: theme.spacing.md,
		backgroundColor: theme.colors.white,
		borderRadius: theme.borderRadius.md,
		borderWidth: 1,
		borderColor: theme.colors.gray[200],
		minWidth: 800,
	},
	teethRow: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		flexWrap: 'wrap',
		marginVertical: theme.spacing.sm,
	},
	divider: {
		height: 1,
		backgroundColor: theme.colors.gray[300],
		marginVertical: theme.spacing.md,
	},
});
