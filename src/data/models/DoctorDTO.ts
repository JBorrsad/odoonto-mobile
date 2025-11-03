import { Doctor } from '../../domain/entities';

export interface DoctorDTO {
	id: string;
	nombreCompleto: string;
	especialidad: string;
}

export const mapDoctorDTOToEntity = (dto: DoctorDTO): Doctor => ({
	id: dto.id,
	nombreCompleto: dto.nombreCompleto,
	especialidad: dto.especialidad,
});

export const mapEntityToDoctorDTO = (entity: Doctor): DoctorDTO => ({
	id: entity.id,
	nombreCompleto: entity.nombreCompleto,
	especialidad: entity.especialidad,
});

