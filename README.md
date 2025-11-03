# Odoonto Mobile

Esta es la versión movil de mi ERP para clinicas dentales, hecha con React Native y Expo. Esta aplicación permite gestionar pacientes, doctores, citas y odontogramas desde dispositivos móviles.

## Sobre el Proyecto

Desarrollé esta aplicación móvil usando React Native desde cero. Decidí usar Expo porque simplifica mucho el proceso de desarrollo y despliegue, especialmente para empezar rápido. La aplicación está construida con TypeScript para tener mejor tipado y menos errores en tiempo de desarrollo.

He organizado el código siguiendo Clean Architecture y el patrón MVP. Esto me permite separar claramente las responsabilidades y mantener el código mantenible. La estructura por capas hace que sea más fácil trabajar en equipo y entender el flujo de datos.

## Estructura del Proyecto

He organizado el proyecto en capas claramente definidas:

```
odoonto-mobile/
├── src/
│   ├── domain/                  # Lógica de negocio pura
│   │   ├── entities/            # Entidades del dominio
│   │   ├── use-cases/           # Casos de uso
│   │   └── repositories/        # Interfaces de repositorios
│   ├── data/                    # Implementación de datos
│   │   ├── repositories/        # Repositorios concretos
│   │   ├── services/            # Servicios API
│   │   ├── data-sources/        # Fuentes de datos
│   │   └── models/              # DTOs y modelos de datos
│   ├── presentation/            # Capa de presentación
│   │   ├── view-models/         # ViewModels y Presenters
│   │   ├── views/
│   │   │   ├── screens/         # Pantallas
│   │   │   ├── components/      # Componentes reutilizables
│   │   │   └── layout/          # Layouts compartidos
│   │   └── hooks/               # Hooks personalizados
│   └── core/                    # Infraestructura compartida
│       ├── navigation/          # Configuración de navegación
│       ├── theme/               # Tema de la aplicación
│       ├── utils/               # Utilidades
│       ├── constants/           # Constantes
│       └── types/                # Tipos TypeScript compartidos
└── app/                         # Expo Router (file-based routing)
```

Esta estructura me permite mantener separadas las preocupaciones. El dominio no sabe nada de React Native ni de la API, los casos de uso encapsulan la lógica de negocio, y la presentación se encarga únicamente de mostrar datos y manejar interacciones del usuario.

## Hooks Personalizados

He creado varios hooks personalizados para encapsular la lógica de cada entidad y reutilizarla en diferentes componentes. Esto me evita duplicar código y hace que los componentes sean más limpios y fáciles de leer.

### usePatient

Hook para gestionar pacientes. Maneja el estado de carga, errores y las operaciones CRUD completas:

```typescript
const { patients, loading, error, loadPatients, createPatient } = usePatient(
  getPatientsUseCase,
  searchPatientsUseCase
);
```

Utiliza `useState` para el estado local, `useEffect` para cargar datos al montar, y `useCallback` para memoizar las funciones y evitar renders innecesarios.

### useDoctor

Similar a usePatient pero para la gestión de doctores. Cada hook está especializado en su entidad correspondiente.

### useAppointment

Gestiona las citas y su relación con doctores y pacientes. Maneja la lógica de validación de horarios y conflictos.

### useOdontogram

Hook para gestionar odontogramas. Maneja la creación y actualización de lesiones y tratamientos en los dientes.

### useApi

Hook base para configuración de la API. Centraliza la configuración de Axios y maneja errores comunes.

## Componentes

He creado componentes reutilizables que encapsulan estilos y comportamientos comunes:

### Button

Componente de botón con variantes predefinidas. Acepta diferentes estilos según el contexto (primary, secondary, danger) y maneja estados de carga y deshabilitado.

### Card

Componente de tarjeta que proporciona un contenedor consistente con sombras y bordes redondeados. Se usa para mostrar información estructurada.

### Modal

Modal personalizado que maneja la presentación y el cierre. Incluye animaciones y manejo del estado de visibilidad.

### Odontogram

Componente complejo que renderiza el odontograma dental. Muestra los dientes en una cuadrícula y permite interactuar con cada diente para añadir lesiones o tratamientos.

## Uso de Hooks

En los componentes uso los hooks estándar de React de manera consistente:

- `useState` para estado local del componente
- `useEffect` para efectos secundarios como cargar datos o suscribirse a eventos
- `useCallback` para memoizar funciones que se pasan como props o dependencias
- `useMemo` cuando necesito computar valores costosos

Los hooks personalizados internamente utilizan estos hooks estándar, creando una capa de abstracción que simplifica el uso en los componentes.

## Dependencias

Las dependencias principales que uso son:

- **React Native 0.81.5**: Framework base para desarrollo móvil
- **Expo ~54.0.20**: Plataforma que simplifica el desarrollo y despliegue
- **Expo Router ~6.0.14**: Sistema de navegación basado en archivos, similar a Next.js
- **TypeScript ~5.9.2**: Para tipado estático y mejor experiencia de desarrollo
- **Axios ^1.13.1**: Cliente HTTP para comunicarme con la API
- **React Native Web ^0.21.2**: Para soporte web usando el mismo código

Las dependencias de desarrollo incluyen ESLint y Prettier para mantener el código consistente, y TypeScript con plugins específicos para React y React Hooks.

## Tema

He centralizado el tema en `src/core/theme/` para mantener consistencia visual en toda la aplicación. El tema incluye:

- **Colores**: Paleta de colores principal con variantes para estados (primary, secondary, success, error)
- **Espaciado**: Sistema de espaciado consistente usando múltiplos de 4
- **Tamaños de fuente**: Escala tipográfica predefinida
- **Bordes redondeados**: Valores estándar para bordes redondeados

Todo el tema está tipado con TypeScript, así que tengo autocompletado en los componentes y detecto errores si uso valores incorrectos.

## Navegación

Uso Expo Router para la navegación basada en archivos. La estructura de carpetas en `app/` define automáticamente las rutas:

- `/` - Página principal
- `/patients` - Lista de pacientes
- `/patients/[id]` - Detalle de paciente
- `/patients/new` - Formulario de nuevo paciente
- `/doctors` - Lista de doctores
- `/schedule` - Calendario de citas

Esto hace que la navegación sea más intuitiva y fácil de mantener. Cada archivo en `app/` es una ruta automáticamente.

## Configuración de la API

La configuración de la API está centralizada en `src/core/constants/api.ts`. Por defecto usa `http://localhost:3000` pero se puede cambiar mediante la variable de entorno `EXPO_PUBLIC_API_BASE_URL`.

El servicio de API usa Axios con interceptores configurados para manejar errores comunes y transformar respuestas. Los repositorios en la capa de datos utilizan este servicio para comunicarse con el backend.

## Arquitectura y Decisiones

Decidí usar Clean Architecture porque quería mantener el código organizado y desacoplado. Esto me permite cambiar la implementación de la API sin afectar la lógica de negocio, o cambiar de React Native a otro framework sin tener que reescribir todo.

El patrón MVP separa la lógica de presentación de la vista. Los ViewModels contienen la lógica y el estado, mientras que los componentes solo se encargan de renderizar. Esto hace que los componentes sean más simples y fáciles de testear.

Los casos de uso encapsulan la lógica de negocio específica. Cada caso de uso tiene una responsabilidad clara y puede ser reutilizado en diferentes contextos. Por ejemplo, el caso de uso de crear paciente se puede usar tanto desde el formulario como desde otra pantalla si fuera necesario.

## Prerrequisitos

- Node.js v18 o superior
- npm o yarn
- Expo CLI instalado globalmente
- Backend corriendo en `http://localhost:3000` o configurar `EXPO_PUBLIC_API_BASE_URL`

## Instalación

```bash
npm install
npm start
```

Para ejecutar en plataforma específica:

```bash
npm run android   # Android
npm run ios       # iOS (requiere macOS)
npm run web       # Web
```

## Scripts Disponibles

- `npm start` - Inicia el servidor de desarrollo
- `npm run android` - Ejecuta en Android
- `npm run ios` - Ejecuta en iOS
- `npm run web` - Ejecuta en navegador
- `npm run lint` - Ejecuta el linter
- `npm run format` - Formatea el código con Prettier