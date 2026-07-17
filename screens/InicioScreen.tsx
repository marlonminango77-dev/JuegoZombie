import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

type Props = {
  navigation: DrawerNavigationProp<Record<string, object | undefined>>;
};

export default function InicioScreen({ navigation }: Props) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.emoji}>🧟‍♂️</Text>
      <Text style={styles.title}>Zombie Hunter</Text>
      <Text style={styles.subtitle}>Última supervivencia</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Objetivo</Text>
        <Text style={styles.text}>
          Selecciona un cazador, elige un zombi y usa tus armas antes de que el enemigo termine con tu vida.
        </Text>
      </View>

      

      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Jugar')}>
        <Text style={styles.buttonText}>🔫 Empezar partida</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#08110d',
    padding: 22,
    alignItems: 'center',
  },
  emoji: { fontSize: 92, marginTop: 18 },
  title: { color: '#bef264', fontSize: 34, fontWeight: '900', marginTop: 6 },
  subtitle: { color: '#e2e8f0', fontSize: 18, marginBottom: 22 },
  card: {
    width: '100%',
    backgroundColor: '#111c16',
    borderColor: '#365314',
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: { color: '#a3e635', fontSize: 20, fontWeight: '800', marginBottom: 8 },
  text: { color: '#e5e7eb', fontSize: 16, lineHeight: 24, marginBottom: 3 },
  button: {
    width: '100%',
    backgroundColor: '#4d7c0f',
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  buttonText: { color: '#ffffff', textAlign: 'center', fontSize: 18, fontWeight: '900' },
});
