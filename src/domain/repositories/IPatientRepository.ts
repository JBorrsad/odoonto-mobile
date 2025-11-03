import { Patient } from '../entities';

export interface IPatientRepository {
	getAll(): Promise<Patient[]>;
	getById(id: string): Promise<Patient>;
	create(patient: Omit<Patient, 'id'>): Promise<Patient>;
	update(id: string, patient: Partial<Patient>): Promise<Patient>;
	delete(id: string): Promise<void>;
	search(query: string): Promise<Patient[]>;
}

