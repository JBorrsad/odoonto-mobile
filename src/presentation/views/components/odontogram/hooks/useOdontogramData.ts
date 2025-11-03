import { useMemo } from 'react';
import { LesionType, Face, LESION_TYPES, ADULT_TEETH_IDS, CHILD_TEETH_IDS } from './types';

export const useOdontogramData = (data: any, patientId: string, isChild: boolean) => {
	const teethIds = useMemo(() => {
		return isChild ? CHILD_TEETH_IDS : ADULT_TEETH_IDS;
	}, [isChild]);

	const lesionTypes = useMemo(() => LESION_TYPES, []);

	return {
		teethIds,
		lesionTypes,
	};
};
