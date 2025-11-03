import { Patient } from '../../domain/entities';
import {
	GetPatientsUseCase,
	GetPatientByIdUseCase,
	CreatePatientUseCase,
	UpdatePatientUseCase,
	DeletePatientUseCase,
	SearchPatientsUseCase,
} from '../../domain/use-cases';
import { BaseViewModel } from './BaseViewModel';

// ViewModel para la lista de pacientes - Maneja la carga y búsqueda de pacientes
export class PatientListViewModel extends BaseViewModel {
	patients: Patient[] = [];

	constructor(
		private getPatientsUseCase: GetPatientsUseCase,
		private searchPatientsUseCase: SearchPatientsUseCase
	) {
		super();
	}

	async loadPatients(): Promise<void> {
		await this.executeWithLoading(
			async () => {
				this.patients = await this.getPatientsUseCase.execute();
			},
			'Error al cargar pacientes'
		);
	}

	async searchPatients(query: string): Promise<void> {
		await this.executeWithLoading(
			async () => {
				this.patients = await this.searchPatientsUseCase.execute(query);
			},
			'Error al buscar pacientes'
		);
	}
}

// ViewModel para el detalle de un paciente - Maneja operaciones CRUD sobre un paciente específico
export class PatientDetailViewModel extends BaseViewModel {
	patient: Patient | null = null;

	constructor(
		private getPatientByIdUseCase: GetPatientByIdUseCase,
		private updatePatientUseCase: UpdatePatientUseCase,
		private deletePatientUseCase: DeletePatientUseCase
	) {
		super();
	}

	async loadPatient(id: string): Promise<void> {
		await this.executeWithLoading(
			async () => {
				this.patient = await this.getPatientByIdUseCase.execute(id);
			},
			'Error al cargar paciente'
		);
	}

	async updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
		const updated = await this.executeWithErrorHandling(
			async () => {
				const result = await this.updatePatientUseCase.execute(id, patient);
				this.patient = result;
				return result;
			},
			'Error al actualizar paciente'
		);
		return updated;
	}

	async deletePatient(id: string): Promise<void> {
		await this.executeWithErrorHandling(
			async () => {
				await this.deletePatientUseCase.execute(id);
			},
			'Error al eliminar paciente'
		);
	}
}

// ViewModel para formularios de paciente - Maneja la creación y actualización de pacientes
export class PatientFormViewModel extends BaseViewModel {
	constructor(
		private createPatientUseCase: CreatePatientUseCase,
		private updatePatientUseCase: UpdatePatientUseCase
	) {
		super();
	}

	async createPatient(patient: Omit<Patient, 'id'>): Promise<Patient> {
		return await this.executeWithErrorHandling(
			async () => {
				return await this.createPatientUseCase.execute(patient);
			},
			'Error al crear paciente'
		);
	}

	async updatePatient(id: string, patient: Partial<Patient>): Promise<Patient> {
		return await this.executeWithErrorHandling(
			async () => {
				return await this.updatePatientUseCase.execute(id, patient);
			},
			'Error al actualizar paciente'
		);
	}
}

