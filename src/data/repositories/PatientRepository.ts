import { Patient } from '../../domain/entities';
import { IPatientRepository } from '../../domain/repositories';
import { apiService } from '../services/ApiService';
import { mapPatientDTOToEntity, mapEntityToPatientDTO, PatientDTO } from '../models/PatientDTO';

export class PatientRepository implements IPatientRepository {
	async getAll(): Promise<Patient[]> {
		const response = await apiService.patients.getPatients();
		return response.data.map((dto: PatientDTO) => mapPatientDTOToEntity(dto));
	}

	async getById(id: string): Promise<Patient> {
		const response = await apiService.patients.getPatientById(id);
		return mapPatientDTOToEntity(response.data);
	}

	async create(patient: Omit<Patient, 'id'>): Promise<Patient> {
		const dto = mapEntityToPatientDTO(patient as Patient);
		const response = await apiService.patients.createPatient(dto);
		return mapPatientDTOToEntity(response.data);
	}

	async update(id: string, patient: Partial<Patient>): Promise<Patient> {
		const response = await apiService.patients.updatePatient(id, patient);
		return mapPatientDTOToEntity(response.data);
	}

	async delete(id: string): Promise<void> {
		await apiService.patients.deletePatient(id);
	}

	async search(query: string): Promise<Patient[]> {
		const response = await apiService.patients.searchPatients(query);
		return response.data.map((dto: PatientDTO) => mapPatientDTOToEntity(dto));
	}
}

