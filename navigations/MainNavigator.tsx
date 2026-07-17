import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import InicioScreen from '../screens/InicioScreen';
import JuegoScreen from '../screens/JuegoScreen';
import CazadorScreen from '../screens/CazadorScreen';
import ArmaScreen from '../screens/ArmaScreen';
import ListaDatosScreen from '../screens/ListaDatosScreen';
import ZombiScreen from '../screens/ZombieScreen';

const Drawer = createDrawerNavigator();

const theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: '#08110d',
    card: '#111c16',
    primary: '#a3e635',
    text: '#ffffff',
    border: '#365314',
    notification: '#facc15',
  },
};

export function MainNavigator() {
  return (
    <NavigationContainer theme={theme}>
      <Drawer.Navigator
        initialRouteName="Inicio"
        screenOptions={{
          headerStyle: { backgroundColor: '#111c16' },
          headerTintColor: '#ffffff',
          drawerStyle: { backgroundColor: '#101813' },
          drawerActiveTintColor: '#08110d',
          drawerActiveBackgroundColor: '#a3e635',
          drawerInactiveTintColor: '#e5e7eb',
        }}
      >
        <Drawer.Screen name="Inicio" component={InicioScreen} options={{ title: '🏠 Inicio' }} />
        <Drawer.Screen name="Jugar" component={JuegoScreen} options={{ title: '🧟 Jugar' }} />
        <Drawer.Screen name="Registrar cazador" component={CazadorScreen} options={{ title: '🧑 Registrar cazador' }} />
        <Drawer.Screen name="Registrar arma" component={ArmaScreen} options={{ title: '🔫 Registrar arma' }} />
        <Drawer.Screen name="Registrar Zombie" component={ZombiScreen} options={{ title: '🧟 Registrar Zombie' }} />
        <Drawer.Screen name="Datos" component={ListaDatosScreen} options={{ title: '📋 Ver datos' }} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
