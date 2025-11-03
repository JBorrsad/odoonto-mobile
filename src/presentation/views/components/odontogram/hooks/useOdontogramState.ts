import { useState, useEffect, useCallback } from 'react';
import { Alert } from 'react-native';
import { apiService } from '../../../../data/services/ApiService';
import { LesionType, Face } from '../types';

interface UseOdontogramStateProps {
	data: any;
	patientId: string;
	isEditable: boolean;
	onUpdate?: (updatedOdontogram: any) => void;
}

export const useOdontogramState = ({
	data,
	patientId,
	isEditable,
	onUpdate,
}: UseOdontogramStateProps) => {
	const [selectedLesion, setSelectedLesion] = useState<LesionType>('CARIES');
	const [loading, setLoading] = useState(false);
	const [toothData, setToothData] = useState<{ [key: string]: { [face: string]: LesionType } }>({});
	const [odontogramId, setOdontogramId] = useState<string | null>(null);

	useEffect(() => {
		if (data) {
			if (data.teeth) {
				const formattedData: { [key: string]: { [face: string]: LesionType } } = {};
				Object.keys(data.teeth).forEach(toothId => {
					if (data.teeth[toothId].faces) {
						formattedData[toothId] = data.teeth[toothId].faces;
					}
				});
				setToothData(formattedData);
			} else if (data.dientes) {
				setToothData(data.dientes);
			}
			setOdontogramId(data.id || data.odontogramId || null);
		} else {
			setToothData({});
			if (patientId) {
				setOdontogramId(`odontogram_${patientId}`);
			}
		}
	}, [data, patientId]);

	const formatOdontogramData = useCallback((odontogramData: any) => {
		if (!odontogramData || !odontogramData.teeth) return {};
		const formattedData: { [key: string]: { [face: string]: LesionType } } = {};
		Object.keys(odontogramData.teeth).forEach(toothId => {
			if (odontogramData.teeth[toothId].faces) {
				formattedData[toothId] = odontogramData.teeth[toothId].faces;
			}
		});
		return formattedData;
	}, []);

	const handleFaceClick = useCallback(
		async (toothId: string, face: Face) => {
			if (!isEditable || loading || !odontogramId) return;

			const tooth = toothData[toothId] || {};
			const currentLesion = tooth[face];

			setLoading(true);

			try {
				if (currentLesion) {
					const response = await apiService.odontograms.removeLesion(odontogramId, toothId, face);
					const updatedOdontogram = response.data;
					const formattedData = formatOdontogramData(updatedOdontogram);
					if (Object.keys(formattedData).length > 0) {
						setToothData(formattedData);
					} else {
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
					const response = await apiService.odontograms.addLesion(odontogramId, toothId, face, selectedLesion);
					const updatedOdontogram = response.data;
					const formattedData = formatOdontogramData(updatedOdontogram);
					if (Object.keys(formattedData).length > 0) {
						setToothData(formattedData);
					} else {
						const updatedToothData = { ...toothData };
						if (!updatedToothData[toothId]) {
							updatedToothData[toothId] = {};
						}
						updatedToothData[toothId][face] = selectedLesion;
						setToothData(updatedToothData);
					}
				}

				if (onUpdate) {
					onUpdate({
						id: odontogramId,
						teeth: toothData,
					});
				}
			} catch (error: any) {
				console.error('Error al actualizar odontograma:', error);
				Alert.alert('Error', error.message || 'Error al actualizar el odontograma. Inténtalo de nuevo.');
			} finally {
				setLoading(false);
			}
		},
		[isEditable, loading, odontogramId, toothData, selectedLesion, onUpdate, formatOdontogramData]
	);

	return {
		selectedLesion,
		setSelectedLesion,
		loading,
		toothData,
		odontogramId,
		handleFaceClick,
	};
};
