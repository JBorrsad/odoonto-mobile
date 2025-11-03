import { Patient } from '../entities';
import { IPatientRepository } from '../repositories';

export class GetPatientsUseCase {
	constructor(private readonly patientRepository: IPatientRepository) {}

	async execute(): Promise<Patient[]> {
		return this.patientRepository.getAll();
	}
}

export class GetPatientByIdUseCase {
	constructor(private readonly patientRepository: IPatientRepository) {}

	async execute(id: string): Promise<Patient> {
		return this.patientRepository.getById(id);
	}
}

export class CreatePatientUseCase {
	constructor(private readonly patientRepository: IPatientRepository) {}

	async execute(patient: Omit<Patient, 'id'>): Promise<Patient> {
		return this.patientRepository.create(patient);
	}
}

export class UpdatePatientUseCase {
	constructor(private readonly patientRepository: IPatientRepository) {}

	async execute(id: string, patient: Partial<Patient>): Promise<Patient> {
		return this.patientRepository.update(id, patient);
	}
}

export class DeletePatientUseCase {
	constructor(private readonly patientRepository: IPatientRepository) {}

	async execute(id: string): Promise<void> {
		return this.patientRepository.delete(id);
	}
}

export class SearchPatientsUseCase {
	constructor(private readonly patientRepository: IPatientRepository) {}

	async execute(query: string): Promise<Patient[]> {
		return this.patientRepository.search(query);
	}
}

