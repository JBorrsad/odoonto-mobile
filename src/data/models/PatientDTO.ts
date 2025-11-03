import { Patient, Address, Sex } from '../../domain/entities';

export interface PatientDTO {
	id: string;
	nombre: string;
	apellido: string;
	fechaNacimiento: string;
	sexo: Sex;
	telefono: string;
	email: string;
	direccion?: Address;
}

export const mapPatientDTOToEntity = (dto: PatientDTO): Patient => ({
	id: dto.id,
	nombre: dto.nombre,
	apellido: dto.apellido,
	fechaNacimiento: dto.fechaNacimiento,
	sexo: dto.sexo,
	telefono: dto.telefono,
	email: dto.email,
	direccion: dto.direccion,
});

export const mapEntityToPatientDTO = (entity: Patient): PatientDTO => ({
	id: entity.id,
	nombre: entity.nombre,
	apellido: entity.apellido,
	fechaNacimiento: entity.fechaNacimiento,
	sexo: entity.sexo,
	telefono: entity.telefono,
	email: entity.email,
	direccion: entity.direccion,
});

