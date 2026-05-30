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
import { Ionicons } from '@expo/vector-icons';
import { AuthStackParamList } from '../../navigation/types';
import { registerWithEmail } from '../../services/authService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { theme } from '../../styles/theme';
import { RegisterForm } from '../../types/auth';

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>;

const FIREBASE_ERRORS: Record<string, string> = {
  'auth/email-already-in-use': 'Ya existe una cuenta con ese email',
  'auth/invalid-email': 'El formato del email no es válido',
  'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
  'auth/network-request-failed': 'Sin conexión a internet',
};

const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const RegisterScreen = ({ navigation }: Props) => {
  const [form, setForm] = useState<RegisterForm>({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = { email: '', password: '', confirmPassword: '' };
    if (!isValidEmail(form.email)) newErrors.email = 'Ingresa un email válido';
    if (form.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password && !newErrors.confirmPassword;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await registerWithEmail(form);
    } catch (error: any) {
      const code: string = error?.code ?? '';
      if (code === 'auth/email-already-in-use') {
        Alert.alert(
          'Email en uso',
          'Ya existe una cuenta con ese email. ¿Quieres iniciar sesión?',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Ir al login', onPress: () => navigation.navigate('Login') },
          ]
        );
      } else {
        const message = FIREBASE_ERRORS[code] ?? 'Error al crear la cuenta';
        Alert.alert('Error de registro', message);
      }
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
          <View style={styles.header}>
            <View style={styles.iconWrapper}>
              <Ionicons name="planet-outline" size={48} color={theme.colors.primary} />
            </View>
            <Text style={styles.title}>Crear cuenta</Text>
            <Text style={styles.subtitle}>Únete al universo Rick & Morty</Text>
          </View>

          <View style={styles.card}>
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

            <Input
              label="Confirmar contraseña"
              placeholder="Repite tu contraseña"
              value={form.confirmPassword}
              onChangeText={(v) => setForm({ ...form, confirmPassword: v })}
              isPassword
              error={errors.confirmPassword}
            />

            <Button
              title="Crear cuenta"
              onPress={handleRegister}
              loading={loading}
              style={styles.button}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>¿Ya tienes cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Inicia sesión</Text>
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
  header: { alignItems: 'center', marginBottom: theme.spacing.xl },
  iconWrapper: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  title: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
  },
  subtitle: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
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
