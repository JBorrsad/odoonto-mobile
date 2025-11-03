import { Doctor } from '../entities';

export interface IDoctorRepository {
	getAll(): Promise<Doctor[]>;
	getById(id: string): Promise<Doctor>;
	create(doctor: Omit<Doctor, 'id'>): Promise<Doctor>;
	update(id: string, doctor: Partial<Doctor>): Promise<Doctor>;
	delete(id: string): Promise<void>;
	search(query: string): Promise<Doctor[]>;
	getByEspecialidad(especialidad: string): Promise<Doctor[]>;
}

