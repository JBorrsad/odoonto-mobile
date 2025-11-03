import { Odontogram, LesionType, Face } from '../entities';

export interface IOdontogramRepository {
	getById(id: string): Promise<Odontogram>;
	getByPatientId(patientId: string): Promise<Odontogram | null>;
	addLesion(
		odontogramId: string,
		toothNumber: string,
		face: Face,
		lesionType: LesionType
	): Promise<Odontogram>;
	removeLesion(odontogramId: string, toothNumber: string, face: Face): Promise<Odontogram>;
	addTreatment(odontogramId: string, toothNumber: string, treatmentType: string): Promise<Odontogram>;
	removeTreatment(odontogramId: string, toothNumber: string): Promise<Odontogram>;
}

