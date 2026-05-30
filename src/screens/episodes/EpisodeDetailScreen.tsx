import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { Character, Episode } from '../../types/api';
import { getEpisodeById, getCharactersByIds } from '../../api/episodeService';
import { ErrorState } from '../../components/common/ErrorState';
import { theme } from '../../styles/theme';
import { RootStackParamList } from '../../navigation/types';
import { useTabBarHeight } from '../../hooks/useTabBarHeight';

type Props = NativeStackScreenProps<RootStackParamList, 'EpisodeDetail'>;

const extractIds = (urls: string[], max = 10): number[] =>
  urls.slice(0, max)
    .map((url) => parseInt(url.split('/').pop() ?? '0', 10))
    .filter((id) => id > 0);

export const EpisodeDetailScreen = ({ route, navigation }: Props) => {
  const { episodeId } = route.params;
  const [episode, setEpisode] = useState<Episode | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [charsLoading, setCharsLoading] = useState(false);
  const [charactersError, setCharactersError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const tabBarHeight = useTabBarHeight();

  useEffect(() => {
    getEpisodeById(episodeId)
      .then(async (ep) => {
        setEpisode(ep);
        navigation.setOptions({ title: ep.name });
        if (ep.characters.length > 0) {
          setCharsLoading(true);
          const ids = extractIds(ep.characters);
          try {
            const chars = await getCharactersByIds(ids);
            setCharacters(chars);
          } catch {
            setCharactersError(true);
          } finally {
            setCharsLoading(false);
          }
        }
      })
      .catch(() => setError('No se pudo cargar el episodio.'))
      .finally(() => setLoading(false));
  }, [episodeId, navigation]);

  if (loading) return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </View>
  );
  if (error || !episode) return (
    <ErrorState
      message={error ?? 'Episodio no encontrado'}
      onRetry={() => navigation.goBack()}
      actionLabel="Volver"
    />
  );

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: tabBarHeight }]} showsVerticalScrollIndicator={false}>
        <View style={styles.heroCard}>
          <View style={styles.codeBadge}>
            <Text style={styles.codeText}>{episode.episode}</Text>
          </View>
          <Text style={styles.name}>{episode.name}</Text>
          <View style={styles.metaRow}>
            <Ionicons name="calendar-outline" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.metaText}>{episode.air_date}</Text>
          </View>
        </View>

        <View style={styles.statRow}>
          <View style={styles.stat}>
            <Ionicons name="people" size={20} color={theme.colors.primary} />
            <Text style={styles.statNumber}>{episode.characters.length}</Text>
            <Text style={styles.statLabel}>Personajes</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          {episode.characters.length === 0
            ? 'Personajes'
            : `Personajes (mostrando ${Math.min(10, episode.characters.length)} de ${episode.characters.length})`}
        </Text>

        {episode.characters.length === 0 ? (
          <Text style={styles.emptyText}>Sin personajes registrados</Text>
        ) : charsLoading ? (
          <ActivityIndicator color={theme.colors.primary} style={{ marginTop: 16 }} />
        ) : charactersError ? (
          <Text style={styles.emptyText}>No se pudieron cargar los personajes</Text>
        ) : (
          <View style={styles.grid}>
            {characters.map((char) => (
              <View key={char.id} style={styles.charItem}>
                <Image
                  source={{ uri: char.image }}
                  style={styles.charAvatar}
                  contentFit="cover"
                  transition={200}
                />
                <View style={[styles.statusDot, {
                  backgroundColor: char.status === 'Alive' ? theme.colors.primary
                    : char.status === 'Dead' ? theme.colors.error
                    : theme.colors.textDisabled
                }]} />
                <Text style={styles.charName} numberOfLines={2}>{char.name}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export const episodeDetailScreenOptions = {
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
    borderColor: 'rgba(151,206,76,0.2)',
    padding: theme.spacing.xl,
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  codeBadge: {
    backgroundColor: 'rgba(151,206,76,0.15)',
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  codeText: { ...theme.typography.h3, color: theme.colors.primary, fontWeight: '800' },
  name: { ...theme.typography.h2, color: theme.colors.textPrimary, textAlign: 'center' },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: theme.spacing.sm },
  metaText: { ...theme.typography.caption, color: theme.colors.textSecondary },
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
  charItem: { alignItems: 'center', width: 72, gap: 4 },
  charAvatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: theme.colors.surface },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginTop: -4, borderWidth: 1.5, borderColor: theme.colors.background },
  charName: { ...theme.typography.caption, color: theme.colors.textSecondary, textAlign: 'center' },
});
