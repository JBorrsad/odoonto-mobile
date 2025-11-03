import { Doctor } from '../../domain/entities';
import { IDoctorRepository } from '../../domain/repositories';
import { apiService } from '../services/ApiService';
import { mapDoctorDTOToEntity, mapEntityToDoctorDTO, DoctorDTO } from '../models/DoctorDTO';

export class DoctorRepository implements IDoctorRepository {
	async getAll(): Promise<Doctor[]> {
		const response = await apiService.doctors.getDoctors();
		return response.data.map((dto: DoctorDTO) => mapDoctorDTOToEntity(dto));
	}

	async getById(id: string): Promise<Doctor> {
		const response = await apiService.doctors.getDoctorById(id);
		return mapDoctorDTOToEntity(response.data);
	}

	async create(doctor: Omit<Doctor, 'id'>): Promise<Doctor> {
		const dto = mapEntityToDoctorDTO(doctor as Doctor);
		const response = await apiService.doctors.createDoctor(dto);
		return mapDoctorDTOToEntity(response.data);
	}

	async update(id: string, doctor: Partial<Doctor>): Promise<Doctor> {
		const response = await apiService.doctors.updateDoctor(id, doctor);
		return mapDoctorDTOToEntity(response.data);
	}

	async delete(id: string): Promise<void> {
		await apiService.doctors.deleteDoctor(id);
	}

	async search(query: string): Promise<Doctor[]> {
		const response = await apiService.doctors.searchDoctors(query);
		return response.data.map((dto: DoctorDTO) => mapDoctorDTOToEntity(dto));
	}

	async getByEspecialidad(especialidad: string): Promise<Doctor[]> {
		const response = await apiService.doctors.getDoctorsByEspecialidad(especialidad);
		return response.data.map((dto: DoctorDTO) => mapDoctorDTOToEntity(dto));
	}
}

