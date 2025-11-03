import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { theme } from '../../../../core/theme';
import { Face, LesionType } from '../types';

interface ToothProps {
	toothId: string;
	isUpper: boolean;
	toothData: { [face: string]: LesionType };
	getFaceColor: (toothId: string, face: Face) => string;
	onFaceClick: (toothId: string, face: Face) => void;
	isEditable: boolean;
	loading: boolean;
}

export const Tooth: React.FC<ToothProps> = ({
	toothId,
	isUpper,
	toothData,
	getFaceColor,
	onFaceClick,
	isEditable,
	loading,
}) => {
	const handleFacePress = useCallback(
		(face: Face) => {
			onFaceClick(toothId, face);
		},
		[toothId, onFaceClick]
	);

	return (
		<View style={styles.toothContainer}>
			{isUpper && <Text style={styles.toothNumber}>{toothId}</Text>}
			<View style={styles.toothGraphic}>
				<TouchableOpacity
					style={[
						styles.toothFace,
						styles.toothFaceOcclusal,
						{ backgroundColor: getFaceColor(toothId, 'OCLUSAL') },
						isEditable && styles.toothFaceEditable,
					]}
					onPress={() => handleFacePress('OCLUSAL')}
					disabled={!isEditable || loading}
				/>
				<TouchableOpacity
					style={[
						styles.toothFace,
						isUpper ? styles.toothFaceVestibularUpper : styles.toothFaceVestibularLower,
						{ backgroundColor: getFaceColor(toothId, 'VESTIBULAR') },
						isEditable && styles.toothFaceEditable,
					]}
					onPress={() => handleFacePress('VESTIBULAR')}
					disabled={!isEditable || loading}
				/>
				<TouchableOpacity
					style={[
						styles.toothFace,
						isUpper ? styles.toothFacePalatinoUpper : styles.toothFacePalatinoLower,
						{ backgroundColor: getFaceColor(toothId, 'PALATINO') },
						isEditable && styles.toothFaceEditable,
					]}
					onPress={() => handleFacePress('PALATINO')}
					disabled={!isEditable || loading}
				/>
				<TouchableOpacity
					style={[
						styles.toothFace,
						styles.toothFaceMesial,
						{ backgroundColor: getFaceColor(toothId, 'MESIAL') },
						isEditable && styles.toothFaceEditable,
					]}
					onPress={() => handleFacePress('MESIAL')}
					disabled={!isEditable || loading}
				/>
				<TouchableOpacity
					style={[
						styles.toothFace,
						styles.toothFaceDistal,
						{ backgroundColor: getFaceColor(toothId, 'DISTAL') },
						isEditable && styles.toothFaceEditable,
					]}
					onPress={() => handleFacePress('DISTAL')}
					disabled={!isEditable || loading}
				/>
			</View>
			{!isUpper && <Text style={styles.toothNumber}>{toothId}</Text>}
		</View>
	);
};

const styles = StyleSheet.create({
	toothContainer: {
		alignItems: 'center',
		marginHorizontal: theme.spacing.xs,
		marginVertical: theme.spacing.xs,
	},
	toothNumber: {
		fontSize: theme.fontSizes.xs,
		fontWeight: '600',
		color: theme.colors.gray[700],
		marginBottom: theme.spacing.xs,
	},
	toothGraphic: {
		width: 40,
		height: 56,
		position: 'relative',
	},
	toothFace: {
		position: 'absolute',
		borderWidth: 1,
		borderColor: theme.colors.gray[300],
	},
	toothFaceEditable: {
		opacity: 0.8,
	},
	toothFaceOcclusal: {
		left: 8,
		top: 16,
		right: 8,
		bottom: 16,
	},
	toothFaceVestibularUpper: {
		left: 8,
		top: 0,
		right: 8,
		height: 16,
	},
	toothFaceVestibularLower: {
		left: 8,
		bottom: 0,
		right: 8,
		height: 16,
	},
	toothFacePalatinoUpper: {
		left: 8,
		bottom: 0,
		right: 8,
		height: 16,
	},
	toothFacePalatinoLower: {
		left: 8,
		top: 0,
		right: 8,
		height: 16,
	},
	toothFaceMesial: {
		left: 0,
		top: 0,
		width: 8,
		bottom: 0,
	},
	toothFaceDistal: {
		right: 0,
		top: 0,
		width: 8,
		bottom: 0,
	},
});
