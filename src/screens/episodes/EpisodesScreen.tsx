import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { Episode } from '../../types/api';
import { getEpisodes } from '../../api/episodeService';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorState } from '../../components/common/ErrorState';
import { SkeletonList } from '../../components/common/SkeletonList';
import { SearchBar } from '../../components/ui/SearchBar';
import { theme } from '../../styles/theme';
import { AppTabParamList } from '../../navigation/types';
import { useTabBarHeight } from '../../hooks/useTabBarHeight';

type Props = BottomTabScreenProps<AppTabParamList, 'Episodes'>;

const EpisodeItem = React.memo(
  ({ item, onPress }: { item: Episode; onPress: () => void }) => (
    <Pressable style={styles.item} onPress={onPress} android_ripple={{ color: theme.colors.surface }}>
      <View style={styles.codeWrapper}>
        <Text style={styles.episodeCode}>{item.episode}</Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.itemDate}>{item.air_date}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  )
);

export const EpisodesScreen = ({ navigation }: Props) => {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      return () => {
        setInputValue('');
        setSearchQuery('');
      };
    }, [])
  );

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(inputValue.trim()), 400);
    return () => clearTimeout(timer);
  }, [inputValue]);

  const fetchFn = useCallback(
    (page: number) => getEpisodes(page, searchQuery || undefined),
    [searchQuery]
  );

  const { data, loading, initialLoading, error, loadMore, refresh } =
    usePaginatedList(fetchFn);
  const tabBarHeight = useTabBarHeight();

  const renderItem = useCallback(
    ({ item }: { item: Episode }) => (
      <EpisodeItem
        item={item}
        onPress={() => navigation.navigate('EpisodeDetail' as any, { episodeId: item.id })}
      />
    ),
    [navigation]
  );

  const keyExtractor = useCallback((item: Episode) => item.id.toString(), []);
  const ListFooter = useCallback(
    () => loading && !initialLoading ? <ActivityIndicator color={theme.colors.primary} style={styles.footer} /> : null,
    [loading, initialLoading]
  );

  if (initialLoading) return <LoadingSpinner text="Cargando episodios..." />;
  if (error && data.length === 0) return <ErrorState message={error} onRetry={refresh} />;

  const showSkeleton = loading && data.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.header}>Episodios</Text>
      <SearchBar value={inputValue} onChangeText={setInputValue} placeholder="Buscar episodio..." />
      {showSkeleton ? <SkeletonList count={8} variant="text" /> : <FlatList
        data={data}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        onEndReached={loadMore}
        onEndReachedThreshold={2.0}
        ListFooterComponent={ListFooter}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
        removeClippedSubviews={Platform.OS !== 'android'}
        contentContainerStyle={[styles.list, { paddingBottom: tabBarHeight }]}
        ListEmptyComponent={<Text style={styles.empty}>{searchQuery ? 'No se encontraron episodios con ese nombre' : 'No se encontraron episodios'}</Text>}
      />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: { ...theme.typography.h2, color: theme.colors.textPrimary, paddingHorizontal: theme.spacing.lg, paddingVertical: theme.spacing.md },
  list: { paddingHorizontal: theme.spacing.md, paddingBottom: 110 },
  item: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: theme.colors.surface, borderRadius: theme.borderRadius.card,
    borderWidth: 1, borderColor: theme.colors.border, marginBottom: theme.spacing.sm, padding: theme.spacing.md,
  },
  codeWrapper: {
    backgroundColor: 'rgba(151, 206, 76, 0.15)', borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.sm, paddingVertical: 4, marginRight: theme.spacing.md, minWidth: 60, alignItems: 'center',
  },
  episodeCode: { ...theme.typography.label, color: theme.colors.primary, fontWeight: '800' },
  itemInfo: { flex: 1, gap: 3 },
  itemName: { ...theme.typography.bodyMedium, color: theme.colors.textPrimary, fontWeight: '700' },
  itemDate: { ...theme.typography.caption, color: theme.colors.textSecondary },
  chevron: { fontSize: 22, color: theme.colors.textDisabled, paddingLeft: theme.spacing.sm },
  footer: { paddingVertical: theme.spacing.lg },
  empty: { ...theme.typography.body, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 40 },
});
