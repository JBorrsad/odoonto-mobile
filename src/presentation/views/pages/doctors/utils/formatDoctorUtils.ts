export const formatDoctorUtils = {
	generateInitials: (nombreCompleto: string): string => {
		const nameParts = nombreCompleto ? nombreCompleto.split(' ') : ['D', 'R'];
		return `${nameParts[0]?.charAt(0) || 'D'}${nameParts.length > 1 ? nameParts[1].charAt(0) : 'R'}`;
	},

	generateWorkingDays: (doctorId: string): number[] => {
		const workingDays: number[] = [];
		const idSeed = doctorId.slice(-4);
		for (let i = 0; i < 7; i++) {
			if (idSeed.charCodeAt(i % idSeed.length) % 2 === 0) {
				workingDays.push(i);
			}
		}
		return workingDays;
	},

	generatePhone: (doctorId: string): string => {
		const idSum = doctorId.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
		return `${100 + (idSum % 900)} 555-${(1000 + (idSum % 9000)).toString().padStart(4, '0')}`;
	},

	generateEmail: (nombreCompleto: string): string => {
		const nameParts = nombreCompleto ? nombreCompleto.split(' ') : ['doctor'];
		return `${nameParts[0].toLowerCase()}@avicena.com`;
	},

	generateServices: (especialidad: string): string[] => {
		const services: string[] = [];
		if (
			especialidad.includes('1') ||
			especialidad.includes('3') ||
			especialidad.includes('5')
		) {
			services.push('Dental service');
		}
		if (especialidad.includes('2') || especialidad.includes('4')) {
			services.push('Oral Disease service');
		}
		if (services.length === 0) {
			services.push('Dental service');
		}
		return services;
	},
};
