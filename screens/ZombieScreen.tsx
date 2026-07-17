import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';

import FormInput from '../components/FormInput';
import { supabase } from '../supabase/config';

export default function ZombiScreen() {
  const [nombre, setNombre] = useState('');
  const [vida, setVida] = useState('100');
  const [danio, setDanio] = useState('10');
  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    if (!nombre || !vida || !danio) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    setGuardando(true);

    const { error } = await supabase
      .from('zombi')
      .insert({
        nombre: nombre,
        vida_maxima: Number(vida),
        vida_actual: Number(vida),
        danio: Number(danio),
      });

    setGuardando(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    Alert.alert('Correcto', 'Zombi guardado');

    setNombre('');
    setVida('100');
    setDanio('10');
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>
        🧟 Registrar zombi
      </Text>

      <Text style={styles.help}>
        Registra un nuevo enemigo para el juego.
      </Text>

      <FormInput
        label="Nombre"
        value={nombre}
        placeholder="Ej. Zombi corredor"
        onChangeText={setNombre}
      />

      <FormInput
        label="Vida máxima"
        value={vida}
        placeholder="100"
        keyboardType="numeric"
        onChangeText={setVida}
      />

      <FormInput
        label="Daño"
        value={danio}
        placeholder="10"
        keyboardType="numeric"
        onChangeText={setDanio}
      />

      <TouchableOpacity
        style={styles.button}
        disabled={guardando}
        onPress={guardar}
      >
        <Text style={styles.buttonText}>
          {guardando
            ? 'Guardando...'
            : 'Guardar zombi'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#08110d',
    padding: 20,
  },

  title: {
    color: '#bef264',
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 8,
  },

  help: {
    color: '#cbd5e1',
    marginBottom: 20,
    lineHeight: 20,
  },

  button: {
    backgroundColor: '#4d7c0f',
    padding: 15,
    borderRadius: 10,
    marginTop: 4,
  },

  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '900',
  },
});