// Script de verificación - Verifica que todos los archivos importantes existen
import * as fs from 'fs';
import * as path from 'path';

const requiredFiles = [
	'app/_layout.tsx',
	'app/index.tsx',
	'app/patients/index.tsx',
	'app/patients/[id].tsx',
	'app/patients/new.tsx',
	'app/doctors/index.tsx',
	'app/schedule/index.tsx',
	'src/presentation/views/components/layout/BottomNavigationBar.tsx',
	'src/presentation/views/components/Odontogram.tsx',
	'src/presentation/views/components/schedule/TimeColumn.tsx',
	'src/presentation/views/components/schedule/Appointment.tsx',
	'src/presentation/views/components/schedule/DentistColumn.tsx',
	'src/presentation/views/components/schedule/CalendarHeader.tsx',
	'src/presentation/views/components/schedule/CalendarView.tsx',
	'src/presentation/views/components/schedule/AppointmentForm.tsx',
	'src/presentation/views/components/schedule/AppointmentDetail.tsx',
];

console.log('Verificando archivos requeridos...');
let hasErrors = false;

requiredFiles.forEach(file => {
	const filePath = path.join(__dirname, file);
	if (!fs.existsSync(filePath)) {
		console.error(`❌ Falta: ${file}`);
		hasErrors = true;
	} else {
		console.log(`✅ ${file}`);
	}
});

if (hasErrors) {
	console.error('\n❌ Hay archivos faltantes. Revisa los errores arriba.');
	process.exit(1);
} else {
	console.log('\n✅ Todos los archivos requeridos existen.');
}


