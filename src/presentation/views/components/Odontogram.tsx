import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	ScrollView,
	Alert,
} from 'react-native';
import { theme } from '../../../core/theme';
import { apiService } from '../../../data/services/ApiService';

interface OdontogramProps {
	patientId: string;
	data: any;
	isChild?: boolean;
	isEditable?: boolean;
	onUpdate?: (updatedOdontogram: any) => void;
}

type LesionType = 'CARIES' | 'OBTURACION' | 'CORONA' | 'AUSENTE' | 'ENDODONCIA';
type Face = 'VESTIBULAR' | 'PALATINO' | 'MESIAL' | 'DISTAL' | 'OCLUSAL';

interface LesionTypeOption {
	value: LesionType;
	label: string;
	color: string;
}

export const Odontogram: React.FC<OdontogramProps> = ({
	patientId,
	data,
	isChild = false,
	isEditable = false,
	onUpdate,
}) => {
	// HOOK: useState - Estado para tipo de lesión seleccionado
	const [selectedLesion, setSelectedLesion] = useState<LesionType>('CARIES');

	// HOOK: useState - Estado para loading
	const [loading, setLoading] = useState(false);

	// HOOK: useState - Estado para datos de dientes
	const [toothData, setToothData] = useState<{ [key: string]: { [face: string]: LesionType } }>({});

	// HOOK: useState - Estado para ID de odontograma
	const [odontogramId, setOdontogramId] = useState<string | null>(null);

	// HOOK: useMemo - Tipos de lesiones disponibles
	const lesionTypes: LesionTypeOption[] = useMemo(
		() => [
			{ value: 'CARIES', label: 'Caries', color: '#ef4444' }, // red-500
			{ value: 'OBTURACION', label: 'Obturación', color: '#22c55e' }, // green-500
			{ value: 'CORONA', label: 'Corona', color: '#eab308' }, // yellow-500
			{ value: 'AUSENTE', label: 'Ausente', color: '#6b7280' }, // gray-500
			{ value: 'ENDODONCIA', label: 'Endodoncia', color: '#a855f7' }, // purple-500
		],
		[]
	);

	// HOOK: useMemo - IDs de dientes según si es niño o adulto
	const teethIds = useMemo(() => {
		return isChild
			? [
					'55',
					'54',
					'53',
					'52',
					'51',
					'61',
					'62',
					'63',
					'64',
					'65',
					'85',
					'84',
					'83',
					'82',
					'81',
					'71',
					'72',
					'73',
					'74',
					'75',
				] // Dientes temporales
			: [
					'18',
					'17',
					'16',
					'15',
					'14',
					'13',
					'12',
					'11',
					'21',
					'22',
					'23',
					'24',
					'25',
					'26',
					'27',
					'28',
					'48',
					'47',
					'46',
					'45',
					'44',
					'43',
					'42',
					'41',
					'31',
					'32',
					'33',
					'34',
					'35',
					'36',
					'37',
					'38',
				]; // Dientes permanentes
	}, [isChild]);

	// HOOK: useEffect - Inicializar datos del odontograma
	useEffect(() => {
		if (data) {
			// Si ya tenemos datos del odontograma, usarlos
			if (data.teeth) {
				// Backend format: { teeth: { "11": { faces: { "VESTIBULAR": "CARIES" } } } }
				const formattedData: { [key: string]: { [face: string]: LesionType } } = {};
				Object.keys(data.teeth).forEach(toothId => {
					if (data.teeth[toothId].faces) {
						formattedData[toothId] = data.teeth[toothId].faces;
					}
				});
				setToothData(formattedData);
			} else if (data.dientes) {
				// Frontend format: { dientes: { "11": { "VESTIBULAR": "CARIES" } } }
				setToothData(data.dientes);
			}
			setOdontogramId(data.id || data.odontogramId || null);
		} else {
			// Si no hay data, inicializamos con un objeto vacío
			setToothData({});
			// Generar ID de odontograma basado en el ID del paciente según la arquitectura del backend
			if (patientId) {
				setOdontogramId(`odontogram_${patientId}`);
			}
		}
	}, [data, patientId]);

	// HOOK: useMemo - Función para obtener color de una cara
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

	// HOOK: useCallback - Manejar clic en una cara del diente
	const handleFaceClick = useCallback(
		async (toothId: string, face: Face) => {
			if (!isEditable || loading || !odontogramId) return;

			const tooth = toothData[toothId] || {};
			const currentLesion = tooth[face];

			setLoading(true);

			try {
				if (currentLesion) {
					// Remover lesión
					const response = await apiService.removeLesion(odontogramId, toothId, face);
					const updatedOdontogram = response.data;

					// Actualizar estado local desde la respuesta del backend
					if (updatedOdontogram && updatedOdontogram.teeth) {
						const formattedData: { [key: string]: { [face: string]: LesionType } } = {};
						Object.keys(updatedOdontogram.teeth).forEach(tId => {
							if (updatedOdontogram.teeth[tId].faces) {
								formattedData[tId] = updatedOdontogram.teeth[tId].faces;
							}
						});
						setToothData(formattedData);
					} else {
						// Fallback: actualizar estado local manualmente
						const updatedToothData = { ...toothData };
						if (updatedToothData[toothId]) {
							delete updatedToothData[toothId][face];
							if (Object.keys(updatedToothData[toothId]).length === 0) {
								delete updatedToothData[toothId];
							}
						}
						setToothData(updatedToothData);
					}
				} else {
					// Añadir lesión
					const response = await apiService.addLesion(odontogramId, toothId, face, selectedLesion);
					const updatedOdontogram = response.data;

					// Actualizar estado local desde la respuesta del backend
					if (updatedOdontogram && updatedOdontogram.teeth) {
						const formattedData: { [key: string]: { [face: string]: LesionType } } = {};
						Object.keys(updatedOdontogram.teeth).forEach(tId => {
							if (updatedOdontogram.teeth[tId].faces) {
								formattedData[tId] = updatedOdontogram.teeth[tId].faces;
							}
						});
						setToothData(formattedData);
					} else {
						// Fallback: actualizar estado local manualmente
						const updatedToothData = { ...toothData };
						if (!updatedToothData[toothId]) {
							updatedToothData[toothId] = {};
						}
						updatedToothData[toothId][face] = selectedLesion;
						setToothData(updatedToothData);
					}
				}

				// Notificar al componente padre si es necesario
				if (onUpdate) {
					onUpdate({
						id: odontogramId,
						teeth: toothData,
					});
				}
			} catch (error: any) {
				console.error('Error al actualizar odontograma:', error);

				// Mostrar mensaje de error
				Alert.alert(
					'Error',
					error.message || 'Error al actualizar el odontograma. Inténtalo de nuevo.'
				);
			} finally {
				setLoading(false);
			}
		},
		[isEditable, loading, odontogramId, toothData, selectedLesion, onUpdate]
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

	const upperTeeth = teethIds.slice(0, Math.floor(teethIds.length / 2));
	const lowerTeeth = teethIds.slice(Math.floor(teethIds.length / 2));

	return (
		<View style={styles.container}>
			{isEditable && (
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
									onPress={() => setSelectedLesion(type.value)}
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
			)}

			{loading && (
				<View style={styles.loadingOverlay}>
					<ActivityIndicator size="large" color={theme.colors.primary} />
				</View>
			)}

			<ScrollView horizontal showsHorizontalScrollIndicator={true}>
				<View style={styles.odontogramContainer}>
					{/* Dientes superiores */}
					<View style={styles.teethRow}>
						{upperTeeth.map(toothId => (
							<View key={toothId} style={styles.toothContainer}>
								<Text style={styles.toothNumber}>{toothId}</Text>
								<View style={styles.toothGraphic}>
									{/* Cara oclusal (central) */}
									<TouchableOpacity
										style={[
											styles.toothFace,
											styles.toothFaceOcclusal,
											{ backgroundColor: getFaceColor(toothId, 'OCLUSAL') },
											isEditable && styles.toothFaceEditable,
										]}
										onPress={() => handleFaceClick(toothId, 'OCLUSAL')}
										disabled={!isEditable || loading}
									/>

									{/* Cara vestibular (superior) */}
									<TouchableOpacity
										style={[
											styles.toothFace,
											styles.toothFaceVestibularUpper,
											{ backgroundColor: getFaceColor(toothId, 'VESTIBULAR') },
											isEditable && styles.toothFaceEditable,
										]}
										onPress={() => handleFaceClick(toothId, 'VESTIBULAR')}
										disabled={!isEditable || loading}
									/>

									{/* Cara palatina (inferior) */}
									<TouchableOpacity
										style={[
											styles.toothFace,
											styles.toothFacePalatinoUpper,
											{ backgroundColor: getFaceColor(toothId, 'PALATINO') },
											isEditable && styles.toothFaceEditable,
										]}
										onPress={() => handleFaceClick(toothId, 'PALATINO')}
										disabled={!isEditable || loading}
									/>

									{/* Cara mesial (izquierda) */}
									<TouchableOpacity
										style={[
											styles.toothFace,
											styles.toothFaceMesial,
											{ backgroundColor: getFaceColor(toothId, 'MESIAL') },
											isEditable && styles.toothFaceEditable,
										]}
										onPress={() => handleFaceClick(toothId, 'MESIAL')}
										disabled={!isEditable || loading}
									/>

									{/* Cara distal (derecha) */}
									<TouchableOpacity
										style={[
											styles.toothFace,
											styles.toothFaceDistal,
											{ backgroundColor: getFaceColor(toothId, 'DISTAL') },
											isEditable && styles.toothFaceEditable,
										]}
										onPress={() => handleFaceClick(toothId, 'DISTAL')}
										disabled={!isEditable || loading}
									/>
								</View>
							</View>
						))}
					</View>

					{/* Línea divisoria */}
					<View style={styles.divider} />

					{/* Dientes inferiores */}
					<View style={styles.teethRow}>
						{lowerTeeth.map(toothId => (
							<View key={toothId} style={styles.toothContainer}>
								<View style={styles.toothGraphic}>
									{/* Cara oclusal (central) */}
									<TouchableOpacity
										style={[
											styles.toothFace,
											styles.toothFaceOcclusal,
											{ backgroundColor: getFaceColor(toothId, 'OCLUSAL') },
											isEditable && styles.toothFaceEditable,
										]}
										onPress={() => handleFaceClick(toothId, 'OCLUSAL')}
										disabled={!isEditable || loading}
									/>

									{/* Cara vestibular (inferior) */}
									<TouchableOpacity
										style={[
											styles.toothFace,
											styles.toothFaceVestibularLower,
											{ backgroundColor: getFaceColor(toothId, 'VESTIBULAR') },
											isEditable && styles.toothFaceEditable,
										]}
										onPress={() => handleFaceClick(toothId, 'VESTIBULAR')}
										disabled={!isEditable || loading}
									/>

									{/* Cara palatina (superior) */}
									<TouchableOpacity
										style={[
											styles.toothFace,
											styles.toothFacePalatinoLower,
											{ backgroundColor: getFaceColor(toothId, 'PALATINO') },
											isEditable && styles.toothFaceEditable,
										]}
										onPress={() => handleFaceClick(toothId, 'PALATINO')}
										disabled={!isEditable || loading}
									/>

									{/* Cara mesial (izquierda) */}
									<TouchableOpacity
										style={[
											styles.toothFace,
											styles.toothFaceMesial,
											{ backgroundColor: getFaceColor(toothId, 'MESIAL') },
											isEditable && styles.toothFaceEditable,
										]}
										onPress={() => handleFaceClick(toothId, 'MESIAL')}
										disabled={!isEditable || loading}
									/>

									{/* Cara distal (derecha) */}
									<TouchableOpacity
										style={[
											styles.toothFace,
											styles.toothFaceDistal,
											{ backgroundColor: getFaceColor(toothId, 'DISTAL') },
											isEditable && styles.toothFaceEditable,
										]}
										onPress={() => handleFaceClick(toothId, 'DISTAL')}
										disabled={!isEditable || loading}
									/>
								</View>
								<Text style={styles.toothNumber}>{toothId}</Text>
							</View>
						))}
					</View>
				</View>
			</ScrollView>

			{/* Leyenda */}
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
	divider: {
		height: 1,
		backgroundColor: theme.colors.gray[300],
		marginVertical: theme.spacing.md,
	},
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
