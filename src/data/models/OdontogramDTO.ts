import { Odontogram, ToothData } from '../../domain/entities';

export interface OdontogramDTO {
	id: string;
	patientId: string;
	teeth: Record<string, ToothData>;
	isTemporary?: boolean;
}

export const mapOdontogramDTOToEntity = (dto: OdontogramDTO): Odontogram => ({
	id: dto.id,
	patientId: dto.patientId,
	teeth: dto.teeth,
	isTemporary: dto.isTemporary,
});

export const mapEntityToOdontogramDTO = (entity: Odontogram): OdontogramDTO => ({
	id: entity.id,
	patientId: entity.patientId,
	teeth: entity.teeth,
	isTemporary: entity.isTemporary,
});

