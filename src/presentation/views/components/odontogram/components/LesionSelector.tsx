import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../../../../core/theme';
import { LesionType, LesionTypeOption } from '../types';

interface LesionSelectorProps {
	lesionTypes: LesionTypeOption[];
	selectedLesion: LesionType;
	onSelectLesion: (lesion: LesionType) => void;
	loading: boolean;
}

export const LesionSelector: React.FC<LesionSelectorProps> = ({
	lesionTypes,
	selectedLesion,
	onSelectLesion,
	loading,
}) => {
	return (
		<View style={styles.lesionSelectorContainer}>
			<Text style={styles.lesionSelectorTitle}>Selecciona el tipo de lesión:</Text>
			<ScrollView horizontal showsHorizontalScrollIndicator={false}>
				<View style={styles.lesionSelector}>
					{lesionTypes.map(type => (
						<TouchableOpacity
							key={type.value}
							style={[
								styles.lesionButton,
								{
									backgroundColor:
										selectedLesion === type.value ? type.color : theme.colors.white,
									borderColor:
										selectedLesion === type.value ? type.color : theme.colors.gray[300],
								},
							]}
							onPress={() => onSelectLesion(type.value)}
							disabled={loading}
						>
							<Text
								style={[
									styles.lesionButtonText,
									{
										color:
											selectedLesion === type.value
												? theme.colors.white
												: theme.colors.gray[700],
									},
								]}
							>
								{type.label}
							</Text>
						</TouchableOpacity>
					))}
				</View>
			</ScrollView>
		</View>
	);
};

const styles = StyleSheet.create({
	lesionSelectorContainer: {
		marginBottom: theme.spacing.md,
		padding: theme.spacing.md,
		backgroundColor: theme.colors.gray[50],
		borderRadius: theme.borderRadius.md,
		borderWidth: 1,
		borderColor: theme.colors.gray[200],
	},
	lesionSelectorTitle: {
		fontSize: theme.fontSizes.sm,
		fontWeight: '600',
		color: theme.colors.gray[700],
		marginBottom: theme.spacing.sm,
	},
	lesionSelector: {
		flexDirection: 'row',
		gap: theme.spacing.sm,
	},
	lesionButton: {
		paddingHorizontal: theme.spacing.md,
		paddingVertical: theme.spacing.sm,
		borderRadius: theme.borderRadius.md,
		borderWidth: 2,
		marginRight: theme.spacing.sm,
	},
	lesionButtonText: {
		fontSize: theme.fontSizes.xs,
		fontWeight: '600',
	},
});
