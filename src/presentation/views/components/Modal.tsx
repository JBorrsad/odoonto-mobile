import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { theme } from '../../../core/theme';

interface ModalProps {
	visible: boolean;
	onClose: () => void;
	title?: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
}

export const CustomModal: React.FC<ModalProps> = ({ visible, onClose, title, children, footer }) => {
	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<TouchableWithoutFeedback onPress={onClose}>
				<View style={styles.overlay}>
					<TouchableWithoutFeedback>
						<View style={styles.modal}>
							{title && (
								<View style={styles.header}>
									<Text style={styles.title}>{title}</Text>
									<TouchableOpacity onPress={onClose} style={styles.closeButton}>
										<Text style={styles.closeText}>✕</Text>
									</TouchableOpacity>
								</View>
							)}
							<View style={styles.content}>{children}</View>
							{footer && <View style={styles.footer}>{footer}</View>}
						</View>
					</TouchableWithoutFeedback>
				</View>
			</TouchableWithoutFeedback>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		justifyContent: 'center',
		alignItems: 'center',
		padding: theme.spacing.md,
	},
	modal: {
		backgroundColor: theme.colors.white,
		borderRadius: theme.borderRadius.lg,
		width: '100%',
		maxWidth: 500,
		maxHeight: '90%',
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: theme.spacing.md,
		borderBottomWidth: 1,
		borderBottomColor: theme.colors.gray[200],
	},
	title: {
		fontSize: theme.fontSizes.lg,
		fontWeight: '600',
		color: theme.colors.gray[900],
	},
	closeButton: {
		padding: theme.spacing.xs,
	},
	closeText: {
		fontSize: theme.fontSizes.xl,
		color: theme.colors.gray[400],
	},
	content: {
		padding: theme.spacing.md,
	},
	footer: {
		padding: theme.spacing.md,
		borderTopWidth: 1,
		borderTopColor: theme.colors.gray[200],
		backgroundColor: theme.colors.gray[50],
		flexDirection: 'row',
		justifyContent: 'flex-end',
	},
});

