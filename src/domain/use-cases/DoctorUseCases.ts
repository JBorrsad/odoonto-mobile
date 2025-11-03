import { Doctor } from '../entities';
import { IDoctorRepository } from '../repositories';

export class GetDoctorsUseCase {
	constructor(private readonly doctorRepository: IDoctorRepository) {}

	async execute(): Promise<Doctor[]> {
		return this.doctorRepository.getAll();
	}
}

export class GetDoctorByIdUseCase {
	constructor(private readonly doctorRepository: IDoctorRepository) {}

	async execute(id: string): Promise<Doctor> {
		return this.doctorRepository.getById(id);
	}
}

export class CreateDoctorUseCase {
	constructor(private readonly doctorRepository: IDoctorRepository) {}

	async execute(doctor: Omit<Doctor, 'id'>): Promise<Doctor> {
		return this.doctorRepository.create(doctor);
	}
}

export class UpdateDoctorUseCase {
	constructor(private readonly doctorRepository: IDoctorRepository) {}

	async execute(id: string, doctor: Partial<Doctor>): Promise<Doctor> {
		return this.doctorRepository.update(id, doctor);
	}
}

export class DeleteDoctorUseCase {
	constructor(private readonly doctorRepository: IDoctorRepository) {}

	async execute(id: string): Promise<void> {
		return this.doctorRepository.delete(id);
	}
}

export class SearchDoctorsUseCase {
	constructor(private readonly doctorRepository: IDoctorRepository) {}

	async execute(query: string): Promise<Doctor[]> {
		return this.doctorRepository.search(query);
	}
}

export class GetDoctorsByEspecialidadUseCase {
	constructor(private readonly doctorRepository: IDoctorRepository) {}

	async execute(especialidad: string): Promise<Doctor[]> {
		return this.doctorRepository.getByEspecialidad(especialidad);
	}
}

