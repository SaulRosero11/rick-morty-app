import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../styles/theme';

interface LoadingSpinnerProps {
  text?: string;
}

export const LoadingSpinner = ({ text }: LoadingSpinnerProps) => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color={theme.colors.primary} />
    {text ? <Text style={styles.text}>{text}</Text> : null}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  text: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
  },
});
