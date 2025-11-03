const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Asegurar que TypeScript esté en las extensiones de fuente
if (!config.resolver.sourceExts.includes('ts')) {
	config.resolver.sourceExts.push('ts');
}
if (!config.resolver.sourceExts.includes('tsx')) {
	config.resolver.sourceExts.push('tsx');
}

// Configurar resolución de módulos para que busque index.ts cuando se importa un directorio
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;

