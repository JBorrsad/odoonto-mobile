import { Doctor } from '../../domain/entities';
import {
	GetDoctorsUseCase,
	GetDoctorByIdUseCase,
	CreateDoctorUseCase,
	UpdateDoctorUseCase,
	DeleteDoctorUseCase,
	SearchDoctorsUseCase,
} from '../../domain/use-cases';

export class DoctorListViewModel {
	// HOOK: useState - Estado para doctores
	doctors: Doctor[] = [];
	loading = false;
	error: string | null = null;

	constructor(
		private getDoctorsUseCase: GetDoctorsUseCase,
		private searchDoctorsUseCase: SearchDoctorsUseCase
	) {}

	async loadDoctors(): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			this.doctors = await this.getDoctorsUseCase.execute();
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al cargar doctores';
		} finally {
			this.loading = false;
		}
	}

	async searchDoctors(query: string): Promise<void> {
		this.loading = true;
		this.error = null;
		try {
			this.doctors = await this.searchDoctorsUseCase.execute(query);
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al buscar doctores';
		} finally {
			this.loading = false;
		}
	}
}

export class DoctorFormViewModel {
	// HOOK: useState - Estado para formulario
	loading = false;
	error: string | null = null;

	constructor(
		private createDoctorUseCase: CreateDoctorUseCase,
		private updateDoctorUseCase: UpdateDoctorUseCase
	) {}

	async createDoctor(doctor: Omit<Doctor, 'id'>): Promise<Doctor> {
		this.loading = true;
		this.error = null;
		try {
			return await this.createDoctorUseCase.execute(doctor);
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al crear doctor';
			throw err;
		} finally {
			this.loading = false;
		}
	}

	async updateDoctor(id: string, doctor: Partial<Doctor>): Promise<Doctor> {
		this.loading = true;
		this.error = null;
		try {
			return await this.updateDoctorUseCase.execute(id, doctor);
		} catch (err) {
			this.error = err instanceof Error ? err.message : 'Error al actualizar doctor';
			throw err;
		} finally {
			this.loading = false;
		}
	}
}

