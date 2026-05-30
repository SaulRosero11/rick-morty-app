import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Location } from '../../types/api';
import { getLocations } from '../../api/locationService';
import { usePaginatedList } from '../../hooks/usePaginatedList';
import { LoadingSpinner } from '../../components/common/LoadingSpinner';
import { ErrorState } from '../../components/common/ErrorState';
import { SkeletonList } from '../../components/common/SkeletonList';
import { SearchBar } from '../../components/ui/SearchBar';
import { theme } from '../../styles/theme';
import { AppTabParamList } from '../../navigation/types';
import { useTabBarHeight } from '../../hooks/useTabBarHeight';

type Props = BottomTabScreenProps<AppTabParamList, 'Locations'>;

const LocationItem = React.memo(
  ({ item, onPress }: { item: Location; onPress: () => void }) => (
    <Pressable style={styles.item} onPress={onPress} android_ripple={{ color: theme.colors.surface }}>
      <View style={styles.iconWrapper}>
        <Ionicons name="planet-outline" size={28} color={theme.colors.secondary} />
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.itemType} numberOfLines={1}>{item.type}</Text>
        <Text style={styles.itemDimension} numberOfLines={1}>{item.dimension}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  )
);

export const LocationsScreen = ({ navigation }: Props) => {
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
    (page: number) => getLocations(page, searchQuery || undefined),
    [searchQuery]
  );

  const { data, loading, initialLoading, error, loadMore, refresh } =
    usePaginatedList(fetchFn);
  const tabBarHeight = useTabBarHeight();

  const renderItem = useCallback(
    ({ item }: { item: Location }) => (
      <LocationItem
        item={item}
        onPress={() => navigation.navigate('LocationDetail' as any, { locationId: item.id })}
      />
    ),
    [navigation]
  );

  const keyExtractor = useCallback((item: Location) => item.id.toString(), []);
  const ListFooter = useCallback(
    () => loading && !initialLoading ? <ActivityIndicator color={theme.colors.primary} style={styles.footer} /> : null,
    [loading, initialLoading]
  );

  if (initialLoading) return <LoadingSpinner text="Cargando ubicaciones..." />;
  if (error && data.length === 0) return <ErrorState message={error} onRetry={refresh} />;

  const showSkeleton = loading && data.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.header}>Ubicaciones</Text>
      <SearchBar value={inputValue} onChangeText={setInputValue} placeholder="Buscar ubicación..." />
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
        ListEmptyComponent={<Text style={styles.empty}>{searchQuery ? 'No se encontraron ubicaciones con ese nombre' : 'No se encontraron ubicaciones'}</Text>}
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
  iconWrapper: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(0,181,204,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: theme.spacing.md,
  },
  itemInfo: { flex: 1, gap: 2 },
  itemName: { ...theme.typography.bodyMedium, color: theme.colors.textPrimary, fontWeight: '700' },
  itemType: { ...theme.typography.caption, color: theme.colors.secondary },
  itemDimension: { ...theme.typography.caption, color: theme.colors.textDisabled },
  chevron: { fontSize: 22, color: theme.colors.textDisabled, paddingLeft: theme.spacing.sm },
  footer: { paddingVertical: theme.spacing.lg },
  empty: { ...theme.typography.body, color: theme.colors.textSecondary, textAlign: 'center', marginTop: 40 },
});
