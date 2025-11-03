import { Odontogram, LesionType, Face } from '../../domain/entities';
import { IOdontogramRepository } from '../../domain/repositories';
import { apiService } from '../services/ApiService';
import {
	mapOdontogramDTOToEntity,
	mapEntityToOdontogramDTO,
	OdontogramDTO,
} from '../models/OdontogramDTO';

export class OdontogramRepository implements IOdontogramRepository {
	async getById(id: string): Promise<Odontogram> {
		const response = await apiService.getOdontogramById(id);
		return mapOdontogramDTOToEntity(response.data);
	}

	async getByPatientId(patientId: string): Promise<Odontogram | null> {
		try {
			const response = await apiService.getPatientOdontogram(patientId);
			return mapOdontogramDTOToEntity(response.data);
		} catch (error: unknown) {
			if ((error as { response?: { status?: number } }).response?.status === 404) {
				return null;
			}
			throw error;
		}
	}

	async addLesion(
		odontogramId: string,
		toothNumber: string,
		face: Face,
		lesionType: LesionType
	): Promise<Odontogram> {
		const response = await apiService.addLesion(odontogramId, toothNumber, face, lesionType);
		return mapOdontogramDTOToEntity(response.data);
	}

	async removeLesion(odontogramId: string, toothNumber: string, face: Face): Promise<Odontogram> {
		const response = await apiService.removeLesion(odontogramId, toothNumber, face);
		return mapOdontogramDTOToEntity(response.data);
	}

	async addTreatment(odontogramId: string, toothNumber: string, treatmentType: string): Promise<Odontogram> {
		const response = await apiService.addTreatment(odontogramId, toothNumber, treatmentType);
		return mapOdontogramDTOToEntity(response.data);
	}

	async removeTreatment(odontogramId: string, toothNumber: string): Promise<Odontogram> {
		const response = await apiService.removeTreatment(odontogramId, toothNumber);
		return mapOdontogramDTOToEntity(response.data);
	}
}

