import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';
import { useAuth } from '../context/AuthContext';
import { theme } from '../styles/theme';
import { CharacterDetailScreen } from '../screens/characters/CharacterDetailScreen';
import { LocationDetailScreen } from '../screens/locations/LocationDetailScreen';
import { EpisodeDetailScreen } from '../screens/episodes/EpisodeDetailScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const detailHeader = {
  headerShown: true,
  headerStyle: { backgroundColor: theme.colors.background },
  headerTintColor: theme.colors.primary,
  headerTitleStyle: { color: theme.colors.textPrimary, fontWeight: '700' as const },
  headerShadowVisible: false,
};

export const RootNavigator = () => {
  const { user, loading } = useAuth();

  if (loading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? (
        <>
          <Stack.Screen name="App" component={AppTabs} />
          <Stack.Screen
            name="CharacterDetail"
            component={CharacterDetailScreen}
            options={detailHeader}
          />
          <Stack.Screen
            name="LocationDetail"
            component={LocationDetailScreen}
            options={detailHeader}
          />
          <Stack.Screen
            name="EpisodeDetail"
            component={EpisodeDetailScreen}
            options={detailHeader}
          />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
};
