import { BaseApiService } from './BaseApiService';
import { ENDPOINTS } from '../../core/constants/api';

export class OdontogramApiService extends BaseApiService {
	getOdontogramById(id: string) {
		return this.client.get(`${ENDPOINTS.ODONTOGRAMS}/${id}`);
	}

	addLesion(odontogramId: string, toothNumber: string, face: string, lesionType: string) {
		return this.client.post(
			`${ENDPOINTS.ODONTOGRAMS}/${odontogramId}/teeth/${toothNumber}/faces/${face}/lesions`,
			null,
			{ params: { lesionType } }
		);
	}

	removeLesion(odontogramId: string, toothNumber: string, face: string) {
		return this.client.delete(
			`${ENDPOINTS.ODONTOGRAMS}/${odontogramId}/teeth/${toothNumber}/faces/${face}/lesions`
		);
	}

	addTreatment(odontogramId: string, toothNumber: string, treatmentType: string) {
		return this.client.post(
			`${ENDPOINTS.ODONTOGRAMS}/${odontogramId}/teeth/${toothNumber}/treatments`,
			null,
			{ params: { treatmentType } }
		);
	}

	removeTreatment(odontogramId: string, toothNumber: string) {
		return this.client.delete(`${ENDPOINTS.ODONTOGRAMS}/${odontogramId}/teeth/${toothNumber}/treatments`);
	}
}
