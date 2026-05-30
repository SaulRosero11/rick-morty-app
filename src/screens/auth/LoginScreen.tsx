import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image } from 'expo-image';
import { AuthStackParamList } from '../../navigation/types';
import { loginWithEmail } from '../../services/authService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { theme } from '../../styles/theme';
import { LoginForm } from '../../types/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const RICK_IMAGE = 'https://rickandmortyapi.com/api/character/avatar/1.jpeg';

const FIREBASE_ERRORS: Record<string, string> = {
  'auth/user-not-found': 'Email o contraseña incorrectos',
  'auth/wrong-password': 'Email o contraseña incorrectos',
  'auth/invalid-credential': 'Email o contraseña incorrectos',
  'auth/invalid-email': 'El formato del email no es válido',
  'auth/too-many-requests': 'Demasiados intentos. Intenta de nuevo más tarde',
  'auth/network-request-failed': 'Sin conexión a internet',
};

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const LoginScreen = ({ navigation }: Props) => {
  const [form, setForm] = useState<LoginForm>({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = { email: '', password: '' };
    if (!isValidEmail(form.email)) newErrors.email = 'Ingresa un email válido';
    if (form.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await loginWithEmail(form);
    } catch (error: any) {
      const message = FIREBASE_ERRORS[error?.code] ?? 'Error al iniciar sesión';
      Alert.alert('Error de acceso', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.brandingContainer}>
            <View style={styles.avatarWrapper}>
              <Image
                source={{ uri: RICK_IMAGE }}
                style={styles.avatar}
                contentFit="cover"
                transition={300}
              />
            </View>
            <Text style={styles.appName}>Rick & Morty</Text>
            <Text style={styles.appSubtitle}>Universe Explorer</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Iniciar sesión</Text>

            <Input
              label="Correo electrónico"
              placeholder="ejemplo@correo.com"
              value={form.email}
              onChangeText={(v) => setForm({ ...form, email: v })}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Input
              label="Contraseña"
              placeholder="Mínimo 6 caracteres"
              value={form.password}
              onChangeText={(v) => setForm({ ...form, password: v })}
              isPassword
              error={errors.password}
            />

            <Button
              title="Iniciar Sesión"
              onPress={handleLogin}
              loading={loading}
              style={styles.button}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿No tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: theme.colors.background },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
    justifyContent: 'center',
  },
  brandingContainer: { alignItems: 'center', marginBottom: theme.spacing.xl },
  avatarWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    overflow: 'hidden',
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  avatar: { width: '100%', height: '100%' },
  appName: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    letterSpacing: 1,
  },
  appSubtitle: {
    ...theme.typography.caption,
    color: theme.colors.secondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: theme.spacing.xs,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  cardTitle: {
    ...theme.typography.h3,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  button: { marginTop: theme.spacing.sm },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
  },
  link: {
    ...theme.typography.bodyMedium,
    color: theme.colors.primary,
    fontWeight: '700',
  },
});
