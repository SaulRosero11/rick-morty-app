import React, { useCallback, useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { Character } from "../../types/api";
import { getCharacters } from "../../api/characterService";
import { usePaginatedList } from "../../hooks/usePaginatedList";
import { useTabBarHeight } from "../../hooks/useTabBarHeight";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { ErrorState } from "../../components/common/ErrorState";
import { SkeletonList } from "../../components/common/SkeletonList";
import { SearchBar } from "../../components/ui/SearchBar";
import { theme } from "../../styles/theme";
import { AppTabParamList } from "../../navigation/types";

type Props = BottomTabScreenProps<AppTabParamList, "Characters">;

const STATUS_COLORS: Record<string, string> = {
  Alive: theme.colors.primary,
  Dead: theme.colors.error,
  unknown: theme.colors.textDisabled,
};

const CharacterItem = React.memo(
  ({ item, onPress }: { item: Character; onPress: () => void }) => (
    <Pressable
      style={styles.item}
      onPress={onPress}
      android_ripple={{ color: theme.colors.surface }}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.avatar}
        contentFit="cover"
        transition={200}
        placeholderContentFit="cover"
      />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.itemSpecies} numberOfLines={1}>
          {item.species}
        </Text>
        <View style={styles.badge}>
          <View
            style={[
              styles.dot,
              {
                backgroundColor:
                  STATUS_COLORS[item.status] ?? theme.colors.textDisabled,
              },
            ]}
          />
          <Text style={styles.badgeText}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  )
);

export const CharactersScreen = ({ navigation }: Props) => {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Reset search when leaving this tab
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
    (page: number) => getCharacters(page, searchQuery || undefined),
    [searchQuery]
  );

  const { data, loading, initialLoading, error, loadMore, refresh } =
    usePaginatedList(fetchFn);
  const tabBarHeight = useTabBarHeight();

  const renderItem = useCallback(
    ({ item }: { item: Character }) => (
      <CharacterItem
        item={item}
        onPress={() =>
          navigation.navigate('CharacterDetail' as any, { characterId: item.id })
        }
      />
    ),
    [navigation]
  );

  const keyExtractor = useCallback((item: Character) => item.id.toString(), []);

  const ListFooter = useCallback(
    () =>
      loading && !initialLoading ? (
        <ActivityIndicator color={theme.colors.primary} style={styles.footer} />
      ) : null,
    [loading, initialLoading]
  );

  if (initialLoading) return <LoadingSpinner text="Cargando personajes..." />;
  if (error && data.length === 0)
    return <ErrorState message={error} onRetry={refresh} />;

  // Skeleton while a search query is loading (data cleared, waiting for results)
  const showSkeleton = loading && data.length === 0;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <Text style={styles.header}>Personajes</Text>
      <SearchBar
        value={inputValue}
        onChangeText={setInputValue}
        placeholder="Buscar personaje..."
      />
      {showSkeleton ? (
        <SkeletonList count={8} variant="avatar" />
      ) : <FlatList
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
        ListEmptyComponent={
          <Text style={styles.empty}>
            {searchQuery ? 'No se encontraron personajes con ese nombre' : 'No se encontraron personajes'}
          </Text>
        }
      />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    ...theme.typography.h2,
    color: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  list: {
    paddingHorizontal: theme.spacing.md,
    paddingBottom: 110,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.sm,
    overflow: "hidden",
  },
  avatar: {
    width: 72,
    height: 72,
    backgroundColor: theme.colors.surface,
  },
  itemInfo: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    gap: 3,
  },
  itemName: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textPrimary,
    fontWeight: "700",
  },
  itemSpecies: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  badge: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  badgeText: { ...theme.typography.caption, color: theme.colors.textSecondary },
  chevron: {
    fontSize: 22,
    color: theme.colors.textDisabled,
    paddingRight: theme.spacing.md,
  },
  footer: { paddingVertical: theme.spacing.lg },
  empty: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 40,
  },
});
