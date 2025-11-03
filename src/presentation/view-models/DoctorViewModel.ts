import { Doctor } from '../../domain/entities';
import {
	GetDoctorsUseCase,
	GetDoctorByIdUseCase,
	CreateDoctorUseCase,
	UpdateDoctorUseCase,
	DeleteDoctorUseCase,
	SearchDoctorsUseCase,
} from '../../domain/use-cases';
import { BaseViewModel } from './BaseViewModel';

// ViewModel para la lista de doctores - Maneja la carga y búsqueda de doctores
export class DoctorListViewModel extends BaseViewModel {
	doctors: Doctor[] = [];

	constructor(
		private getDoctorsUseCase: GetDoctorsUseCase,
		private searchDoctorsUseCase: SearchDoctorsUseCase
	) {
		super();
	}

	async loadDoctors(): Promise<void> {
		await this.executeWithLoading(
			async () => {
				this.doctors = await this.getDoctorsUseCase.execute();
			},
			'Error al cargar doctores'
		);
	}

	async searchDoctors(query: string): Promise<void> {
		await this.executeWithLoading(
			async () => {
				this.doctors = await this.searchDoctorsUseCase.execute(query);
			},
			'Error al buscar doctores'
		);
	}
}

// ViewModel para formularios de doctor - Maneja la creación y actualización de doctores
export class DoctorFormViewModel extends BaseViewModel {
	constructor(
		private createDoctorUseCase: CreateDoctorUseCase,
		private updateDoctorUseCase: UpdateDoctorUseCase
	) {
		super();
	}

	async createDoctor(doctor: Omit<Doctor, 'id'>): Promise<Doctor> {
		return await this.executeWithErrorHandling(
			async () => {
				return await this.createDoctorUseCase.execute(doctor);
			},
			'Error al crear doctor'
		);
	}

	async updateDoctor(id: string, doctor: Partial<Doctor>): Promise<Doctor> {
		return await this.executeWithErrorHandling(
			async () => {
				return await this.updateDoctorUseCase.execute(id, doctor);
			},
			'Error al actualizar doctor'
		);
	}
}

