import { Odontogram, LesionType, Face } from '../entities';
import { IOdontogramRepository } from '../repositories';

export class GetOdontogramUseCase {
	constructor(private readonly odontogramRepository: IOdontogramRepository) {}

	async execute(id: string): Promise<Odontogram> {
		return this.odontogramRepository.getById(id);
	}
}

export class GetOdontogramByPatientIdUseCase {
	constructor(private readonly odontogramRepository: IOdontogramRepository) {}

	async execute(patientId: string): Promise<Odontogram | null> {
		return this.odontogramRepository.getByPatientId(patientId);
	}
}

export class AddLesionUseCase {
	constructor(private readonly odontogramRepository: IOdontogramRepository) {}

	async execute(
		odontogramId: string,
		toothNumber: string,
		face: Face,
		lesionType: LesionType
	): Promise<Odontogram> {
		return this.odontogramRepository.addLesion(odontogramId, toothNumber, face, lesionType);
	}
}

export class RemoveLesionUseCase {
	constructor(private readonly odontogramRepository: IOdontogramRepository) {}

	async execute(odontogramId: string, toothNumber: string, face: Face): Promise<Odontogram> {
		return this.odontogramRepository.removeLesion(odontogramId, toothNumber, face);
	}
}

export class AddTreatmentUseCase {
	constructor(private readonly odontogramRepository: IOdontogramRepository) {}

	async execute(odontogramId: string, toothNumber: string, treatmentType: string): Promise<Odontogram> {
		return this.odontogramRepository.addTreatment(odontogramId, toothNumber, treatmentType);
	}
}

export class RemoveTreatmentUseCase {
	constructor(private readonly odontogramRepository: IOdontogramRepository) {}

	async execute(odontogramId: string, toothNumber: string): Promise<Odontogram> {
		return this.odontogramRepository.removeTreatment(odontogramId, toothNumber);
	}
}

