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
		const response = await apiService.odontograms.getOdontogramById(id);
		return mapOdontogramDTOToEntity(response.data);
	}

	async getByPatientId(patientId: string): Promise<Odontogram | null> {
		try {
			const response = await apiService.patients.getPatientOdontogram(patientId);
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
		const response = await apiService.odontograms.addLesion(odontogramId, toothNumber, face, lesionType);
		return mapOdontogramDTOToEntity(response.data);
	}

	async removeLesion(odontogramId: string, toothNumber: string, face: Face): Promise<Odontogram> {
		const response = await apiService.odontograms.removeLesion(odontogramId, toothNumber, face);
		return mapOdontogramDTOToEntity(response.data);
	}

	async addTreatment(odontogramId: string, toothNumber: string, treatmentType: string): Promise<Odontogram> {
		const response = await apiService.odontograms.addTreatment(odontogramId, toothNumber, treatmentType);
		return mapOdontogramDTOToEntity(response.data);
	}

	async removeTreatment(odontogramId: string, toothNumber: string): Promise<Odontogram> {
		const response = await apiService.odontograms.removeTreatment(odontogramId, toothNumber);
		return mapOdontogramDTOToEntity(response.data);
	}
}

