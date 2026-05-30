import React from 'react';
import { StyleSheet, View } from 'react-native';
import { theme } from '../../styles/theme';

const SKELETON_COLOR = 'rgba(255,255,255,0.08)';
const SKELETON_HIGHLIGHT = 'rgba(255,255,255,0.04)';

// Skeleton with avatar — used for Characters
const SkeletonAvatarItem = () => (
  <View style={styles.item}>
    <View style={styles.avatar} />
    <View style={styles.info}>
      <View style={[styles.line, { width: '65%', height: 14 }]} />
      <View style={[styles.line, { width: '40%', height: 11, marginTop: 6 }]} />
      <View style={[styles.line, { width: '28%', height: 10, marginTop: 6 }]} />
    </View>
  </View>
);

// Skeleton without avatar — used for Locations and Episodes
const SkeletonTextItem = () => (
  <View style={styles.item}>
    <View style={styles.iconBox} />
    <View style={styles.info}>
      <View style={[styles.line, { width: '70%', height: 14 }]} />
      <View style={[styles.line, { width: '45%', height: 11, marginTop: 6 }]} />
      <View style={[styles.line, { width: '55%', height: 10, marginTop: 6 }]} />
    </View>
  </View>
);

interface SkeletonListProps {
  count?: number;
  variant?: 'avatar' | 'text';
}

export const SkeletonList = ({ count = 8, variant = 'text' }: SkeletonListProps) => (
  <View style={styles.container}>
    {Array.from({ length: count }).map((_, i) =>
      variant === 'avatar' ? (
        <SkeletonAvatarItem key={i} />
      ) : (
        <SkeletonTextItem key={i} />
      )
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.sm,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SKELETON_COLOR,
    borderRadius: theme.borderRadius.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.04)',
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
    height: 72,
  },
  avatar: {
    width: 72,
    height: 72,
    backgroundColor: SKELETON_HIGHLIGHT,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: SKELETON_HIGHLIGHT,
    marginLeft: theme.spacing.md,
    marginRight: theme.spacing.md,
  },
  info: {
    flex: 1,
    paddingHorizontal: theme.spacing.md,
  },
  line: {
    borderRadius: 4,
    backgroundColor: SKELETON_HIGHLIGHT,
  },
});
