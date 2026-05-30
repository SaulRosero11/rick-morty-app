import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppTabParamList } from './types';
import { theme } from '../styles/theme';

import { CharactersScreen } from '../screens/characters/CharactersScreen';
import { LocationsScreen } from '../screens/locations/LocationsScreen';
import { EpisodesScreen } from '../screens/episodes/EpisodesScreen';
import { ProfileScreen } from '../screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator<AppTabParamList>();

const ICONS: Record<keyof AppTabParamList, [string, string]> = {
  Characters: ['people', 'people-outline'],
  Locations: ['location', 'location-outline'],
  Episodes: ['film', 'film-outline'],
  Profile: ['person', 'person-outline'],
};

const TabBarBackground = () =>
  Platform.OS === 'ios' ? (
    <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
  ) : (
    <View style={[StyleSheet.absoluteFill, styles.androidTabBg]} />
  );

export const AppTabs = () => {
  const { bottom } = useSafeAreaInsets();
  const tabBarBottom = Math.max(bottom, 16) + 8;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.inactive,
        tabBarLabelStyle: styles.tabLabel,
        tabBarStyle: [styles.tabBar, { bottom: tabBarBottom }],
        tabBarBackground: () => <TabBarBackground />,
        tabBarIcon: ({ focused, color, size }) => {
          const [active, inactive] = ICONS[route.name];
          return (
            <Ionicons
              name={(focused ? active : inactive) as any}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Characters"
        component={CharactersScreen}
        options={{ tabBarLabel: 'Personajes' }}
      />
      <Tab.Screen
        name="Locations"
        component={LocationsScreen}
        options={{ tabBarLabel: 'Ubicaciones' }}
      />
      <Tab.Screen
        name="Episodes"
        component={EpisodesScreen}
        options={{ tabBarLabel: 'Episodios' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Perfil' }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: theme.colors.tabBarBorder,
    backgroundColor: 'transparent',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  tabLabel: { fontSize: 10, fontWeight: '500' },
  androidTabBg: {
    backgroundColor: 'rgba(11, 12, 16, 0.92)',
    borderRadius: 32,
  },
});
