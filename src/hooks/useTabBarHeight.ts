import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TAB_BAR_HEIGHT = 64;
const TAB_BAR_MARGIN = 8;

export function useTabBarHeight(): number {
  const { bottom } = useSafeAreaInsets();
  const safeBottom = Math.max(bottom, 16);
  return safeBottom + TAB_BAR_MARGIN + TAB_BAR_HEIGHT + TAB_BAR_MARGIN;
}

export function useTabBarBottom(): number {
  const { bottom } = useSafeAreaInsets();
  return Math.max(bottom, 16) + TAB_BAR_MARGIN;
}
