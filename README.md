# Odoonto Mobile

Aplicación móvil desarrollada con React Native, Expo y TypeScript siguiendo Clean Architecture y el patrón MVP (Model-View-Presenter).

## 🏗️ Arquitectura

Este proyecto sigue los principios de Clean Architecture y MVP:

### Estructura de Carpetas

```
odoonto-mobile/
├── src/
│   ├── domain/                  # Capa de Dominio
│   │   ├── entities/            # Entidades del dominio (Patient, Doctor, Appointment, Odontogram)
│   │   ├── use-cases/           # Casos de uso (Interactors)
│   │   └── repositories/        # Interfaces de repositorios
│   ├── data/                    # Capa de Datos
│   │   ├── repositories/        # Implementaciones de repositorios
│   │   ├── services/            # Servicios API (Axios)
│   │   ├── data-sources/        # Fuentes de datos remotas/locales
│   │   └── models/              # DTOs (Data Transfer Objects)
│   ├── presentation/             # Capa de Presentación
│   │   ├── view-models/         # ViewModels/Presenters
│   │   ├── views/
│   │   │   ├── screens/         # Pantallas (Expo Router)
│   │   │   ├── components/       # Componentes reutilizables
│   │   │   └── layout/          # Layouts
│   │   └── hooks/               # Hooks personalizados (usePatient, useDoctor, etc.)
│   └── core/                    # Infraestructura
│       ├── navigation/          # Configuración de navegación
│       ├── theme/               # Tema de la aplicación
│       ├── utils/               # Utilidades
│       ├── constants/           # Constantes
│       └── types/                # Tipos TypeScript compartidos
└── app/                         # Expo Router (file-based routing)
```

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js (v18 o superior)
- npm o yarn
- Expo CLI (`npm install -g expo-cli`)
- Backend corriendo en `http://localhost:3000` (o configurar `EXPO_PUBLIC_API_BASE_URL`)

### Instalación

```bash
# Instalar dependencias
npm install

# Iniciar el servidor de desarrollo
npm start

# O ejecutar en plataforma específica
npm run web      # Web (react-native-web)
npm run android   # Android
npm run ios       # iOS (requiere macOS)
```

## 📱 Características

### Pantallas Implementadas

- **Home** (`/`) - Página principal con navegación
- **Pacientes** (`/patients`) - Lista de pacientes
- **Detalle Paciente** (`/patients/[id]`) - Detalle y gestión de paciente
- **Nuevo Paciente** (`/patients/new`) - Formulario de creación
- **Doctores** (`/doctors`) - Lista de doctores
- **Horario** (`/schedule`) - Gestión de citas (vista básica)

### Hooks Personalizados

Todos los hooks están marcados con comentarios explícitos para demostrar el uso de React Hooks:

- `usePatient` - Gestión de pacientes (lista, búsqueda)
- `usePatientDetail` - Detalle de paciente
- `usePatientForm` - Formulario de paciente
- `useDoctor` - Gestión de doctores
- `useAppointment` - Gestión de citas
- `useOdontogram` - Gestión de odontogramas
- `useApi` - Configuración de API

### Componentes

- `Button` - Botón reutilizable con variantes
- `Card` - Tarjeta con título opcional
- `Modal` - Modal personalizado

## 🎯 Principios SOLID

- **SRP** (Single Responsibility Principle): Cada clase/hook tiene una sola responsabilidad
- **OCP** (Open/Closed Principle): Extensible mediante interfaces
- **LSP** (Liskov Substitution Principle): Los repositorios siguen contratos definidos
- **ISP** (Interface Segregation Principle): Interfaces pequeñas y enfocadas
- **DIP** (Dependency Inversion Principle): Dependencias por abstracciones

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env` (opcional):

```env
EXPO_PUBLIC_API_BASE_URL=http://localhost:3000
```

### API Base URL

Por defecto, la aplicación usa `http://localhost:3000`. Puedes cambiarlo en:

`src/core/constants/api.ts`

## 📚 Uso de Hooks

Todos los hooks están documentados con comentarios explícitos:

```typescript
// HOOK: useState - Estado para pacientes
const [patients, setPatients] = useState<Patient[]>([]);

// HOOK: useEffect - Cargar pacientes al montar
useEffect(() => {
  loadPatients();
}, []);

// HOOK: useCallback - Función memoizada
const loadPatients = useCallback(async () => {
  // ...
}, [getPatientsUseCase]);
```

## 🧪 Testing

```bash
# Ejecutar linter
npm run lint

# Ejecutar formateador
npm run format
```

## 📦 Dependencias Principales

- **React Native** - Framework móvil
- **Expo** - Plataforma de desarrollo
- **Expo Router** - Navegación file-based
- **TypeScript** - Tipado estático
- **Axios** - Cliente HTTP
- **react-native-web** - Soporte web

## 🎨 Tema

El tema está centralizado en `src/core/theme/`:

- Colores
- Espaciado
- Tamaños de fuente
- Bordes redondeados

## 📝 Notas de Desarrollo

- Todos los hooks están marcados con comentarios `// HOOK:`
- Los custom hooks están marcados con `// CUSTOM HOOK:`
- La arquitectura sigue Clean Architecture estricta
- Los ViewModels gestionan el estado y la lógica de presentación
- Los Use Cases encapsulan la lógica de negocio

## 🚧 Próximas Mejoras

- [ ] Implementación completa del calendario de citas
- [ ] Componente de odontograma interactivo
- [ ] Búsqueda y filtros avanzados
- [ ] Soporte offline con AsyncStorage
- [ ] Autenticación y autorización
- [ ] Tests unitarios y de integración

## 📄 Licencia

Este proyecto es privado y confidencial.

## 👨‍💻 Autor

Desarrollado como demostración de habilidades en React Native, TypeScript y Clean Architecture.

