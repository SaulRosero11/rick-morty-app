import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Character } from '../../types/api';
import { getCharacterById } from '../../api/characterService';
import { ErrorState } from '../../components/common/ErrorState';
import { theme } from '../../styles/theme';
import { useTabBarHeight } from '../../hooks/useTabBarHeight';
import { RootStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CharacterDetail'>;

const STATUS_COLORS: Record<string, string> = {
  Alive: theme.colors.primary,
  Dead: theme.colors.error,
  unknown: theme.colors.textDisabled,
};

const extractEpisodeCode = (url: string): string => {
  const id = parseInt(url.split('/').pop() ?? '0', 10);
  if (!id) return '';
  const season = Math.ceil(id / 10);
  const ep = id % 10 === 0 ? 10 : id % 10;
  return `E${String(id).padStart(2, '0')}`;
};

const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Ionicons name={icon as any} size={18} color={theme.colors.secondary} style={styles.infoIcon} />
    <View style={{ flex: 1 }}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue} numberOfLines={2}>{value || 'Desconocido'}</Text>
    </View>
  </View>
);

export const CharacterDetailScreen = ({ route, navigation }: Props) => {
  const { characterId } = route.params;
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tabBarHeight = useTabBarHeight();

  useEffect(() => {
    getCharacterById(characterId)
      .then((data) => {
        setCharacter(data);
        navigation.setOptions({ title: data.name });
      })
      .catch(() => setError('No se pudo cargar el personaje.'))
      .finally(() => setLoading(false));
  }, [characterId, navigation]);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );

  if (error || !character) return (
    <ErrorState
      message={error ?? 'Personaje no encontrado'}
      onRetry={() => navigation.goBack()}
      actionLabel="Volver"
    />
  );

  const statusColor = STATUS_COLORS[character.status] ?? theme.colors.textDisabled;
  const episodeIds = character.episode.slice(0, 8).map((url) =>
    parseInt(url.split('/').pop() ?? '0', 10)
  ).filter((id) => id > 0);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: tabBarHeight }]} showsVerticalScrollIndicator={false}>
        <Image
          source={{ uri: character.image }}
          style={styles.hero}
          contentFit="cover"
          transition={300}
        />

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <Text style={styles.name}>{character.name}</Text>
            <View style={[styles.statusBadge, { borderColor: statusColor }]}>
              <View style={[styles.dot, { backgroundColor: statusColor }]} />
              <Text style={[styles.statusText, { color: statusColor }]}>{character.status}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <InfoRow icon="body-outline" label="Especie" value={character.species} />
            {character.type ? (
              <InfoRow icon="flask-outline" label="Tipo" value={character.type} />
            ) : null}
            <InfoRow icon="male-female-outline" label="Género" value={character.gender} />
            <InfoRow icon="planet-outline" label="Origen" value={character.origin.name} />
            <InfoRow icon="location-outline" label="Ubicación actual" value={character.location.name} />
          </View>

          {character.episode.length > 0 && (
            <View style={styles.episodeSection}>
              <Text style={styles.sectionTitle}>
                Episodios
                <Text style={styles.sectionCount}> ({character.episode.length} en total)</Text>
              </Text>
              <View style={styles.episodePills}>
                {episodeIds.map((id) => (
                  <View key={id} style={styles.pill}>
                    <Text style={styles.pillText}>EP {String(id).padStart(2, '0')}</Text>
                  </View>
                ))}
                {character.episode.length > 8 && (
                  <View style={[styles.pill, styles.pillMore]}>
                    <Text style={styles.pillTextMore}>+{character.episode.length - 8}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export const characterDetailScreenOptions = {
  headerStyle: { backgroundColor: theme.colors.background },
  headerTintColor: theme.colors.primary,
  headerTitleStyle: { color: theme.colors.textPrimary, fontWeight: '700' as const },
  headerShadowVisible: false,
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background },
  scroll: { paddingBottom: 120 },
  hero: {
    width: '100%',
    height: 300,
    backgroundColor: theme.colors.surface,
  },
  content: { padding: theme.spacing.lg, gap: theme.spacing.lg },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  name: { ...theme.typography.h2, color: theme.colors.textPrimary, flex: 1 },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 4,
  },
  dot: { width: 7, height: 7, borderRadius: 4 },
  statusText: { ...theme.typography.caption, fontWeight: '700' },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: theme.spacing.md },
  infoIcon: { marginTop: 2 },
  infoLabel: { ...theme.typography.caption, color: theme.colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 },
  infoValue: { ...theme.typography.bodyMedium, color: theme.colors.textPrimary, marginTop: 1 },
  episodeSection: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  sectionTitle: { ...theme.typography.label, color: theme.colors.textPrimary },
  sectionCount: { ...theme.typography.caption, color: theme.colors.textSecondary, fontWeight: '400' },
  episodePills: { flexDirection: 'row', flexWrap: 'wrap', gap: theme.spacing.sm },
  pill: {
    backgroundColor: 'rgba(151, 206, 76, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(151, 206, 76, 0.3)',
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
  },
  pillText: { ...theme.typography.caption, color: theme.colors.primary, fontWeight: '700' },
  pillMore: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.border,
  },
  pillTextMore: { ...theme.typography.caption, color: theme.colors.textSecondary, fontWeight: '700' },
});
