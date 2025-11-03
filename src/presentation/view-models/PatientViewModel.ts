import { Patient } from '../../domain/entities';
import {
	GetPatientsUseCase,
	GetPatientByIdUseCase,
	CreatePatientUseCase,
	UpdatePatientUseCase,
	DeletePatientUseCase,
	SearchPatientsUseCase,
} from '../../domain/use-cases';

export class PatientListViewModel {
	// HOOK: useState - Estado para pacientes
	patients: Patient[] = [];
	loading = false;
	error: string | null = null;

	constructor(
		private getPatientsUseCase: GetPatientsUseCase,
		private searchPatientsUseCase: SearchPatientsUseCase
	) {}

	async loadPatients(): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			this.patients = await this.getPatientsUseCase.execute();
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al cargar pacientes';
		} finally {
			this.loading = false;
		}
	}

	async searchPatients(query: string): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			this.patients = await this.searchPatientsUseCase.execute(query);
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al buscar pacientes';
		} finally {
			this.loading = false;
		}
	}
}

export class PatientDetailViewModel {
	// HOOK: useState - Estado para paciente
	patient: Patient | null = null;
	loading = false;
	error: string | null = null;

	constructor(
		private getPatientByIdUseCase: GetPatientByIdUseCase,
		private updatePatientUseCase: UpdatePatientUseCase,
		private deletePatientUseCase: DeletePatientUseCase
	) {}

	async loadPatient(id: string): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			this.patient = await this.getPatientByIdUseCase.execute(id);
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al cargar paciente';
		} finally {
			this.loading = false;
		}
	}

	async updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
		this.loading = true;
		this.error = null;
		try {
			const updated = await this.updatePatientUseCase.execute(id, patient);
			this.patient = updated;
			return updated;
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al actualizar paciente';
			throw err;
		} finally {
			this.loading = false;
		}
	}

	async deletePatient(id: string): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			await this.deletePatientUseCase.execute(id);
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al eliminar paciente';
			throw err;
		} finally {
			this.loading = false;
		}
	}
}

export class PatientFormViewModel {
	// HOOK: useState - Estado para formulario
	loading = false;
	error: string | null = null;

	constructor(
		private createPatientUseCase: CreatePatientUseCase,
		private updatePatientUseCase: UpdatePatientUseCase
	) {}

	async createPatient(patient: Omit<Patient, 'id'>): Promise<Patient> {
		this.loading = true;
		this.error = null;
		try {
			return await this.createPatientUseCase.execute(patient);
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al crear paciente';
			throw err;
		} finally {
			this.loading = false;
		}
	}

	async updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
		this.loading = true;
		this.error = null;
		try {
			return await this.updatePatientUseCase.execute(id, patient);
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al actualizar paciente';
			throw err;
		} finally {
			this.loading = false;
		}
	}
}

