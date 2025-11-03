import { Doctor } from '../../domain/entities';
import { IDoctorRepository } from '../../domain/repositories';
import { apiService } from '../services/ApiService';
import { mapDoctorDTOToEntity, mapEntityToDoctorDTO, DoctorDTO } from '../models/DoctorDTO';

export class DoctorRepository implements IDoctorRepository {
	async getAll(): Promise<Doctor[]> {
		const response = await apiService.getDoctors();
		return response.data.map((dto: DoctorDTO) => mapDoctorDTOToEntity(dto));
	}

	async getById(id: string): Promise<Doctor> {
		const response = await apiService.getDoctorById(id);
		return mapDoctorDTOToEntity(response.data);
	}

	async create(doctor: Omit<Doctor, 'id'>): Promise<Doctor> {
		const dto = mapEntityToDoctorDTO(doctor as Doctor);
		const response = await apiService.createDoctor(dto);
		return mapDoctorDTOToEntity(response.data);
	}

	async update(id: string, doctor: Partial<Doctor>): Promise<Doctor> {
		const response = await apiService.updateDoctor(id, doctor);
		return mapDoctorDTOToEntity(response.data);
	}

	async delete(id: string): Promise<void> {
		await apiService.deleteDoctor(id);
	}

	async search(query: string): Promise<Doctor[]> {
		const response = await apiService.searchDoctors(query);
		return response.data.map((dto: DoctorDTO) => mapDoctorDTOToEntity(dto));
	}

	async getByEspecialidad(especialidad: string): Promise<Doctor[]> {
		const response = await apiService.getDoctorsByEspecialidad(especialidad);
		return response.data.map((dto: DoctorDTO) => mapDoctorDTOToEntity(dto));
	}
}

