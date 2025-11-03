import React, { useEffect, useState } from 'react';
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	TouchableOpacity,
	ActivityIndicator,
} from 'react-native';
import { theme } from '../src/core/theme';
import { Card } from '../src/presentation/views/components/Card';
import { apiService } from '../src/data/services/ApiService';
import { API_BASE_URL } from '../src/core/constants/api';

type EndpointState = {
	loading: boolean;
	data: any;
	error: string | null;
};

export default function HomePage() {
	const [data, setData] = useState({
		patients: { loading: true, data: null, error: null } as EndpointState,
		doctors: { loading: true, data: null, error: null } as EndpointState,
		appointments: { loading: true, data: null, error: null } as EndpointState,
		odontogram: { loading: true, data: null, error: null } as EndpointState,
	});

	const [expandedSection, setExpandedSection] = useState({
		patients: false,
		doctors: false,
		appointments: false,
		odontogram: false,
	});

	useEffect(() => {
		const fetchData = async (endpoint: string, fetchFunction: () => Promise<any>) => {
			try {
				const response = await fetchFunction();
				const result = response.data;

				setData(prev => ({
					...prev,
					[endpoint]: { loading: false, data: result, error: null },
				}));
			} catch (error: any) {
				setData(prev => ({
					...prev,
					[endpoint]: {
						loading: false,
						data: null,
						error: error.message || 'Error loading data',
					},
				}));
			}
		};

		// Load data from all endpoints
		fetchData('patients', () => apiService.getPatients());
		fetchData('doctors', () => apiService.getDoctors());
		fetchData('appointments', () => apiService.getAppointments());

		// For odontogram we need an ID, we'll try to get the first available
		fetchData('odontogram', async () => {
			const patientsResponse = await apiService.getPatients();
			const patients = patientsResponse.data;
			if (patients && patients.length > 0) {
				return await apiService.getPatientOdontogram(patients[0].id);
			}
			throw new Error('No patients available to get odontogram');
		});
	}, []);

	const toggleSection = (section: string) => {
		setExpandedSection(prev => ({
			...prev,
			[section]: !prev[section as keyof typeof prev],
		}));
	};

	const renderEndpoint = (
		title: string,
		path: string,
		method: string,
		dataState: EndpointState,
		section: string
	) => {
		const statusColor = dataState.error
			? { backgroundColor: theme.colors.danger + '20', color: theme.colors.danger }
			: !dataState.loading && dataState.data
				? { backgroundColor: theme.colors.success + '20', color: theme.colors.success }
				: { backgroundColor: theme.colors.gray[100], color: theme.colors.gray[600] };

		const statusText = dataState.loading
			? 'LOADING'
			: dataState.error
				? 'ERROR'
				: dataState.data
					? 'SUCCESS'
					: 'NO DATA';

		return (
			<View style={styles.endpointCard}>
				<TouchableOpacity style={styles.endpointHeader} onPress={() => toggleSection(section)}>
					<View
						style={[
							styles.methodBadge,
							{ backgroundColor: method === 'GET' ? '#dbeafe' : '#dcfce7' },
						]}
					>
						<Text style={[styles.methodText, { color: method === 'GET' ? '#1e40af' : '#166534' }]}>
							{method}
						</Text>
					</View>
					<Text style={styles.endpointPath}>{path}</Text>
					<Text style={styles.endpointTitle}>{title}</Text>
					<View style={[styles.statusBadge, statusColor]}>
						<Text style={[styles.statusText, { color: statusColor.color }]}>{statusText}</Text>
					</View>
				</TouchableOpacity>

				{expandedSection[section as keyof typeof expandedSection] && (
					<View style={styles.endpointContent}>
						{dataState.loading ? (
							<View style={styles.loadingContainer}>
								<ActivityIndicator size="small" color={theme.colors.primary} />
								<Text style={styles.loadingText}>Loading data...</Text>
							</View>
						) : dataState.error ? (
							<View style={styles.errorContainer}>
								<Text style={styles.errorTitle}>Request failed</Text>
								<Text style={styles.errorMessage}>{dataState.error}</Text>
							</View>
						) : !dataState.data ||
						  (Array.isArray(dataState.data) && dataState.data.length === 0) ? (
							<View style={styles.noDataContainer}>
								<Text style={styles.noDataText}>No data available</Text>
							</View>
						) : (
							<View>
								<Text style={styles.responseLabel}>Response</Text>
								<View style={styles.jsonContainer}>
									<ScrollView nestedScrollEnabled={true}>
										<Text style={styles.jsonText}>{JSON.stringify(dataState.data, null, 2)}</Text>
									</ScrollView>
								</View>
								<Text style={styles.schemaLabel}>Response Schema</Text>
								<Text style={styles.schemaText}>
									{Array.isArray(dataState.data) ? `Array[${dataState.data.length}]` : 'Object'}
								</Text>
							</View>
						)}
					</View>
				)}
			</View>
		);
	};

	const allHaveErrors = Object.values(data).every(item => item.error !== null && !item.loading);

	return (
		<ScrollView style={styles.container}>
			<View style={styles.content}>
				<Text style={styles.title}>API Documentation</Text>
				<Text style={styles.subtitle}>
					This page provides documentation for all available API endpoints in the system. Tap on
					each endpoint to view request and response details.
				</Text>

				{allHaveErrors && (
					<Card style={styles.errorCard}>
						<Text style={styles.errorCardTitle}>Connection Error</Text>
						<Text style={styles.errorCardText}>
							Unable to connect to the backend API. Please ensure your backend server is running.
						</Text>
						<Text style={styles.errorCardText}>
							The application is trying to connect to:{' '}
							<Text style={styles.codeText}>{API_BASE_URL}</Text>
						</Text>
					</Card>
				)}

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Patient Endpoints</Text>
					{renderEndpoint('Get all patients', '/api/patients', 'GET', data.patients, 'patients')}
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Doctor Endpoints</Text>
					{renderEndpoint('Get all doctors', '/api/doctors', 'GET', data.doctors, 'doctors')}
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Appointment Endpoints</Text>
					{renderEndpoint(
						'Get all appointments',
						'/api/appointments',
						'GET',
						data.appointments,
						'appointments'
					)}
				</View>

				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Odontogram Endpoints</Text>
					{renderEndpoint(
						'Get patient odontogram',
						'/api/patients/{id}/odontogram',
						'GET',
						data.odontogram,
						'odontogram'
					)}
				</View>
			</View>
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: theme.colors.background,
	},
	content: {
		padding: theme.spacing.md,
	},
	title: {
		fontSize: theme.fontSizes.xxl,
		fontWeight: 'bold',
		color: theme.colors.gray[900],
		marginBottom: theme.spacing.xs,
	},
	subtitle: {
		fontSize: theme.fontSizes.md,
		color: theme.colors.gray[600],
		marginBottom: theme.spacing.lg,
	},
	section: {
		marginBottom: theme.spacing.lg,
	},
	sectionTitle: {
		fontSize: theme.fontSizes.xl,
		fontWeight: '600',
		color: theme.colors.gray[800],
		marginBottom: theme.spacing.md,
	},
	endpointCard: {
		backgroundColor: theme.colors.white,
		borderRadius: theme.borderRadius.md,
		marginBottom: theme.spacing.md,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: theme.colors.gray[200],
	},
	endpointHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: theme.spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.gray[200],
		backgroundColor: theme.colors.white,
		flexWrap: 'wrap',
	},
	methodBadge: {
		paddingHorizontal: theme.spacing.sm,
		paddingVertical: theme.spacing.xs,
		borderRadius: theme.borderRadius.sm,
		marginRight: theme.spacing.sm,
	},
	methodText: {
		fontSize: theme.fontSizes.xs,
		fontWeight: '600',
	},
	endpointPath: {
		fontSize: theme.fontSizes.md,
		fontWeight: '500',
		color: theme.colors.gray[700],
		flex: 1,
	},
	endpointTitle: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.gray[500],
		marginLeft: theme.spacing.sm,
	},
	statusBadge: {
		paddingHorizontal: theme.spacing.sm,
		paddingVertical: theme.spacing.xs,
		borderRadius: theme.borderRadius.sm,
		marginLeft: theme.spacing.md,
	},
	statusText: {
		fontSize: theme.fontSizes.xs,
		fontWeight: '600',
	},
	endpointContent: {
		padding: theme.spacing.md,
		backgroundColor: theme.colors.gray[50],
	},
	loadingContainer: {
		alignItems: 'center',
		paddingVertical: theme.spacing.md,
	},
	loadingText: {
		marginTop: theme.spacing.sm,
		fontSize: theme.fontSizes.sm,
		color: theme.colors.gray[600],
	},
	errorContainer: {
		backgroundColor: theme.colors.danger + '20',
		padding: theme.spacing.md,
		borderRadius: theme.borderRadius.md,
		borderWidth: 1,
		borderColor: theme.colors.danger + '40',
	},
	errorTitle: {
		fontSize: theme.fontSizes.md,
		fontWeight: '600',
		color: theme.colors.danger,
		marginBottom: theme.spacing.xs,
	},
	errorMessage: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.danger,
	},
	noDataContainer: {
		alignItems: 'center',
		paddingVertical: theme.spacing.md,
	},
	noDataText: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.gray[500],
	},
	responseLabel: {
		fontSize: theme.fontSizes.sm,
		fontWeight: '600',
		color: theme.colors.gray[700],
		marginBottom: theme.spacing.xs,
	},
	jsonContainer: {
		backgroundColor: theme.colors.gray[900],
		padding: theme.spacing.md,
		borderRadius: theme.borderRadius.md,
		maxHeight: 200,
		marginBottom: theme.spacing.md,
	},
	jsonText: {
		fontSize: theme.fontSizes.xs,
		fontFamily: 'monospace',
		color: theme.colors.white,
	},
	schemaLabel: {
		fontSize: theme.fontSizes.sm,
		fontWeight: '600',
		color: theme.colors.gray[700],
		marginBottom: theme.spacing.xs,
	},
	schemaText: {
		fontSize: theme.fontSizes.xs,
		color: theme.colors.gray[600],
	},
	errorCard: {
		marginBottom: theme.spacing.lg,
		backgroundColor: theme.colors.danger + '10',
		borderWidth: 1,
		borderColor: theme.colors.danger + '40',
	},
	errorCardTitle: {
		fontSize: theme.fontSizes.lg,
		fontWeight: 'bold',
		color: theme.colors.danger,
		marginBottom: theme.spacing.sm,
	},
	errorCardText: {
		fontSize: theme.fontSizes.sm,
		color: theme.colors.danger,
		marginTop: theme.spacing.sm,
	},
	codeText: {
		fontFamily: 'monospace',
		backgroundColor: theme.colors.danger + '30',
		paddingHorizontal: theme.spacing.xs,
		paddingVertical: 2,
		borderRadius: theme.borderRadius.sm,
	},
});
