import React, { useMemo, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { theme } from '../../../core/theme';
import { Face, LesionType } from './odontogram/types';
import { useOdontogramData } from './odontogram/hooks/useOdontogramData';
import { useOdontogramState } from './odontogram/hooks/useOdontogramState';
import { LesionSelector } from './odontogram/components/LesionSelector';
import { OdontogramView } from './odontogram/components/OdontogramView';
import { OdontogramLegend } from './odontogram/components/OdontogramLegend';

interface OdontogramProps {
	patientId: string;
	data: any;
	isChild?: boolean;
	isEditable?: boolean;
	onUpdate?: (updatedOdontogram: any) => void;
}

export const Odontogram: React.FC<OdontogramProps> = ({
	patientId,
	data,
	isChild = false,
	isEditable = false,
	onUpdate,
}) => {
	const { teethIds, lesionTypes } = useOdontogramData(data, patientId, isChild);

	const {
		selectedLesion,
		setSelectedLesion,
		loading,
		toothData,
		handleFaceClick,
	} = useOdontogramState({
		data,
		patientId,
		isEditable,
		onUpdate,
	});

	const getFaceColor = useCallback(
		(toothId: string, face: Face): string => {
			const tooth = toothData[toothId] || {};
			const lesion = tooth[face];

			if (!lesion) return theme.colors.white;

			const lesionObj = lesionTypes.find(l => l.value === lesion);
			return lesionObj ? lesionObj.color : theme.colors.gray[200];
		},
		[toothData, lesionTypes]
	);

	const upperTeeth = useMemo(
		() => teethIds.slice(0, Math.floor(teethIds.length / 2)),
		[teethIds]
	);
	const lowerTeeth = useMemo(
		() => teethIds.slice(Math.floor(teethIds.length / 2)),
		[teethIds]
	);

	if (!patientId) {
		return (
			<View style={styles.errorContainer}>
				<Text style={styles.errorText}>Error: ID de paciente requerido.</Text>
			</View>
		);
	}

	if (!data && !isEditable) {
		return (
			<View style={styles.emptyContainer}>
				<Text style={styles.emptyText}>No hay datos de odontograma disponibles.</Text>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{isEditable && (
				<LesionSelector
					lesionTypes={lesionTypes}
					selectedLesion={selectedLesion}
					onSelectLesion={setSelectedLesion}
					loading={loading}
				/>
			)}

			{loading && (
				<View style={styles.loadingOverlay}>
					<ActivityIndicator size="large" color={theme.colors.primary} />
				</View>
			)}

			<OdontogramView
				upperTeeth={upperTeeth}
				lowerTeeth={lowerTeeth}
				toothData={toothData}
				getFaceColor={getFaceColor}
				onFaceClick={handleFaceClick}
				isEditable={isEditable}
				loading={loading}
			/>

			<OdontogramLegend lesionTypes={lesionTypes} />
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		position: 'relative',
	},
	errorContainer: {
		padding: theme.spacing.md,
		backgroundColor: theme.colors.danger + '20',
		borderRadius: theme.borderRadius.md,
		borderWidth: 1,
		borderColor: theme.colors.danger,
	},
	errorText: {
		color: theme.colors.danger,
		fontSize: theme.fontSizes.sm,
	},
	emptyContainer: {
		padding: theme.spacing.md,
		backgroundColor: theme.colors.gray[50],
		borderRadius: theme.borderRadius.md,
		borderWidth: 1,
		borderColor: theme.colors.gray[200],
	},
	emptyText: {
		color: theme.colors.gray[600],
		fontSize: theme.fontSizes.sm,
		textAlign: 'center',
	},
	loadingOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(255, 255, 255, 0.8)',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 10,
		borderRadius: theme.borderRadius.md,
	},
});