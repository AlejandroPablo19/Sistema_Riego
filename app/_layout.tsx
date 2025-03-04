import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Home, Info, Leaf, Flower, User } from 'lucide-react-native'; 
import { View } from 'react-native';
import { router } from 'expo-router';
import { auth } from '@/lib/firebase '; 
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth'; 


SplashScreen.preventAutoHideAsync();

const GreenTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4CAF50',
    background: '#E8F5E9',
    card: '#A5D6A7',
    text: '#1B5E20',
    border: '#81C784',
    notification: '#66BB6A',
  },
};

export default function RootLayout() {
  const [user, setUser] = useState<FirebaseUser | null>(null); 
  const [isReady, setIsReady] = useState(false);
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsReady(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loaded && isReady) {
      SplashScreen.hideAsync();
    }
  }, [loaded, isReady]);

  if (!loaded || !isReady) {
    return <View />;
  }

  if (!user) {
    return (
      <ThemeProvider value={GreenTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="autentication/login"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider value={GreenTheme}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer 
          screenOptions={{
            headerShown: false 
          }}
        >
          <Drawer.Screen
            name="home"
            options={{
              drawerLabel: 'Inicio',
              title: 'SISTEMA DE RIEGO INTELIGENTE PARA JARDINES',
              drawerIcon: ({ color }) => <Home size={28} color={color} />,
              headerShown: true 
            }}
          />
          <Drawer.Screen
            name="trefle"
            options={{
              drawerLabel: 'Plantas',
              title: 'Plantas',
              drawerIcon: ({ color }) => <Leaf size={28} color={color} />,
              headerShown: true 
            }}
          />
          <Drawer.Screen
            name="user"
            options={{
              drawerLabel: 'Usuario',
              title: 'Usuario',
              drawerIcon: ({ color }) => <User size={28} color={color} />,
              headerShown: true 
            }}
          />
          <Drawer.Screen
            name="acerca"
            options={{
              drawerLabel: 'Acerca de',
              title: 'Acerca de',
              drawerIcon: ({ color }) => <Info size={28} color={color} />,
              headerShown: true 
            }}
          />
          <Drawer.Screen
            name="index"
            options={{ 
              drawerItemStyle: { display: 'none' },
              headerShown: false 
            }}
          />
          {['+not-found', 'autentication'].map((screen) => (
            <Drawer.Screen
              key={screen}
              name={screen}
              options={{ 
                drawerItemStyle: { display: 'none' },
                headerShown: false 
              }}
            />
          ))}
        </Drawer>
      </GestureHandlerRootView>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}