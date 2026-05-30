import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../styles/theme';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  actionLabel?: string;
}

export const ErrorState = ({
  message = 'Algo salió mal. Intenta de nuevo.',
  onRetry,
  actionLabel = 'Reintentar',
}: ErrorStateProps) => (
  <View style={styles.container}>
    <Ionicons name="alert-circle-outline" size={56} color={theme.colors.error} />
    <Text style={styles.message}>{message}</Text>
    {onRetry && (
      <TouchableOpacity style={styles.button} onPress={onRetry} activeOpacity={0.8}>
        <Ionicons name="refresh-outline" size={16} color={theme.colors.textPrimary} />
        <Text style={styles.buttonText}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  message: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.button,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm + 2,
    marginTop: theme.spacing.sm,
  },
  buttonText: {
    ...theme.typography.label,
    color: theme.colors.textPrimary,
  },
});
