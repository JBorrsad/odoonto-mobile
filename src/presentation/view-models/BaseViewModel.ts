// Clase base para ViewModels - Maneja el estado común de loading y error
// Esto evita duplicar código en cada ViewModel y sigue el principio DRY
export abstract class BaseViewModel {
	loading = false;
	error: string | null = null;

	// Método protegido para manejar el estado de carga y errores
	protected async executeWithLoading<T>(
		operation: () => Promise<T>,
		errorMessage: string = 'Error en la operación'
	): Promise<T | null> {
		this.loading = true;
		this.error = null;
		try {
			return await operation();
		} catch (err) {
			this.error = err instanceof Error ? err.message : errorMessage;
			return null;
		} finally {
			this.loading = false;
		}
	}

	// Método protegido para operaciones que pueden lanzar excepciones
	protected async executeWithErrorHandling<T>(
		operation: () => Promise<T>,
		errorMessage: string = 'Error en la operación'
	): Promise<T> {
		this.loading = true;
		this.error = null;
		try {
			return await operation();
		} catch (err) {
			this.error = err instanceof Error ? err.message : errorMessage;
			throw err;
		} finally {
			this.loading = false;
		}
	}

	// Método para limpiar el estado de error
	clearError(): void {
		this.error = null;
	}
}

