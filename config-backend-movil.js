// Script rápido para configurar la URL del backend para móvil
// Ejecuta: node config-backend-movil.js TU_IP_LOCAL

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const ipAddress = args[0];

if (!ipAddress) {
	console.log('❌ Error: Debes proporcionar una IP local');
	console.log('');
	console.log('Uso: node config-backend-movil.js 192.168.1.105');
	console.log('');
	console.log('Para obtener tu IP:');
	console.log('  Windows: ipconfig');
	console.log('  Mac/Linux: ifconfig o ip addr');
	process.exit(1);
}

const apiFile = path.join(__dirname, 'src', 'core', 'constants', 'api.ts');
const content = `// API Base URL - Configura esto según tu entorno
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://${ipAddress}:3000';

// Endpoints
export const ENDPOINTS = {
	PATIENTS: '/api/patients',
	DOCTORS: '/api/doctors',
	APPOINTMENTS: '/api/appointments',
	ODONTOGRAMS: '/api/odontograms',
	MEDICAL_RECORDS: '/api/medical-records',
} as const;

`;

try {
	fs.writeFileSync(apiFile, content, 'utf8');
	console.log('✅ URL del backend configurada correctamente');
	console.log(`   API_BASE_URL: http://${ipAddress}:3000`);
	console.log('');
	console.log('⚠️  Asegúrate de que:');
	console.log('   1. El backend esté corriendo en el puerto 3000');
	console.log('   2. El backend acepte conexiones desde tu red local');
	console.log('   3. Tu firewall permita conexiones en el puerto 3000');
	console.log('');
	console.log('Ahora puedes ejecutar: npm start');
} catch (error) {
	console.error('❌ Error al escribir el archivo:', error.message);
	process.exit(1);
}


