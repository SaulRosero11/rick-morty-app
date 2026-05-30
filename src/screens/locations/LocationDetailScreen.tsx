import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Character, Location } from '../../types/api';
import { getLocationById, getCharactersByIds } from '../../api/locationService';
import { ErrorState } from '../../components/common/ErrorState';
import { theme } from '../../styles/theme';
import { RootStackParamList } from '../../navigation/types';
import { useTabBarHeight } from '../../hooks/useTabBarHeight';

type Props = NativeStackScreenProps<RootStackParamList, 'LocationDetail'>;

const extractIds = (urls: string[], max = 10): number[] =>
  urls.slice(0, max)
    .map((url) => parseInt(url.split('/').pop() ?? '0', 10))
    .filter((id) => id > 0);

const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon as any} size={16} color={theme.colors.secondary} />
    <View style={{ flex: 1 }}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || 'Desconocido'}</Text>
    </View>
  </View>
);

export const LocationDetailScreen = ({ route, navigation }: Props) => {
  const { locationId } = route.params;
  const tabBarHeight = useTabBarHeight();
  const [location, setLocation] = useState<Location | null>(null);
  const [residents, setResidents] = useState<Character[]>([]);
  const [residentsLoading, setResidentsLoading] = useState(false);
  const [residentsError, setResidentsError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLocationById(locationId)
      .then(async (loc) => {
        setLocation(loc);
        navigation.setOptions({ title: loc.name });
        if (loc.residents.length > 0) {
          setResidentsLoading(true);
          const ids = extractIds(loc.residents);
          try {
            const chars = await getCharactersByIds(ids);
            setResidents(chars);
          } catch {
            setResidentsError(true);
          } finally {
            setResidentsLoading(false);
          }
        }
      })
      .catch(() => setError('No se pudo cargar la ubicación.'))
      .finally(() => setLoading(false));
  }, [locationId, navigation]);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
  if (error || !location) return (
    <ErrorState
      message={error ?? 'Ubicación no encontrada'}
      onRetry={() => navigation.goBack()}
      actionLabel="Volver"
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: tabBarHeight }]} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="planet" size={40} color={theme.colors.secondary} />
          </View>
          <Text style={styles.name}>{location.name}</Text>
        </View>

        <View style={styles.card}>
          <InfoRow icon="layers-outline" label="Tipo" value={location.type} />
          <InfoRow icon="globe-outline" label="Dimensión" value={location.dimension} />
        </View>

        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Ionicons name="people" size={20} color={theme.colors.primary} />
            <Text style={styles.statNumber}>{location.residents.length}</Text>
            <Text style={styles.statLabel}>Residentes</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          {location.residents.length === 0
            ? 'Residentes'
            : `Residentes (mostrando ${Math.min(10, location.residents.length)} de ${location.residents.length})`}
        </Text>

        {location.residents.length === 0 ? (
          <Text style={styles.emptyText}>Sin residentes registrados</Text>
        ) : residentsLoading ? (
          <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 16 }} />
        ) : residentsError ? (
          <Text style={styles.emptyText}>No se pudieron cargar los residentes</Text>
        ) : (
          <View style={styles.grid}>
            {residents.map((char) => (
              <View key={char.id} style={styles.residentItem}>
                <Image
                  source={{ uri: char.image }}
                  style={styles.residentAvatar}
                  contentFit="cover"
                  transition={200}
                />
                <View style={[styles.statusDot, {
                  backgroundColor: char.status === 'Alive' ? theme.colors.primary
                    : char.status === 'Dead' ? theme.colors.error
                    : theme.colors.textDisabled
                }]} />
                <Text style={styles.residentName} numberOfLines={2}>{char.name}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export const locationDetailScreenOptions = {
  headerStyle: { backgroundColor: theme.colors.background },
  headerTintColor: theme.colors.primary,
  headerTitleStyle: { color: theme.colors.textPrimary, fontWeight: '700' as const },
  headerShadowVisible: false,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  scroll: { padding: theme.spacing.lg, gap: theme.spacing.lg },
  heroCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.card,
    borderWidth: 1,
    borderColor: 'rgba(0,181,204,0.2)',
    padding: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  heroIcon: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: 'rgba(0,181,204,0.1)',
    justifyContent: 'center', alignItems: 'center',
  },
  name: { ...theme.typography.h2, color: theme.colors.textPrimary, textAlign: 'center' },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md },
  infoLabel: { ...theme.typography.caption, color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },
  infoValue: { ...theme.typography.bodyMedium, color: theme.colors.textPrimary, marginTop: 1 },
  statRow: { flexDirection: 'row', gap: theme.spacing.md },
  stat: {
    flex: 1, backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg, borderWidth: 1, borderColor: theme.colors.border,
    padding: theme.spacing.md, alignItems: 'center', gap: 4,
  },
  statNumber: { ...theme.typography.h2, color: theme.colors.textPrimary },
  statLabel: { ...theme.typography.caption, color: theme.colors.textSecondary },
  sectionTitle: { ...theme.typography.label, color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },
  emptyText: { ...theme.typography.body, color: theme.colors.textSecondary },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.md },
  residentItem: { alignItems: 'center', width: 72, gap: 4 },
  residentAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: theme.colors.surface },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginTop: -4, borderWidth: 1.5, borderColor: theme.colors.background },
  residentName: { ...theme.typography.caption, color: theme.colors.textSecondary, textAlign: 'center' },
});
