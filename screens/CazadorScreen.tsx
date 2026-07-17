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

export default function CazadorScreen() {
  const [nombre, setNombre] = useState('');
  const [nivel, setNivel] = useState('1');
  const [vida, setVida] = useState('100');
  const [defensa, setDefensa] = useState('5');
  const [guardando, setGuardando] = useState(false);

  async function guardar() {
    if (!nombre || !nivel || !vida || !defensa) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    setGuardando(true);

    const { error } = await supabase
      .from('cazador')
      .insert({
        nombre: nombre,
        nivel: Number(nivel),
        vida_maxima: Number(vida),
        vida_actual: Number(vida),
        defensa: Number(defensa),
      });

    setGuardando(false);

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    Alert.alert('Correcto', 'Cazador guardado');

    setNombre('');
    setNivel('1');
    setVida('100');
    setDefensa('5');
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>🧑‍🚒 Registrar cazador</Text>

      <Text style={styles.help}>
        Registra un nuevo cazador en Supabase.
      </Text>

      <FormInput
        label="Nombre"
        value={nombre}
        placeholder="Ej. Andrea"
        onChangeText={setNombre}
      />

      <FormInput
        label="Nivel"
        value={nivel}
        placeholder="1"
        keyboardType="numeric"
        onChangeText={setNivel}
      />

      <FormInput
        label="Vida máxima"
        value={vida}
        placeholder="100"
        keyboardType="numeric"
        onChangeText={setVida}
      />

      <FormInput
        label="Defensa"
        value={defensa}
        placeholder="5"
        keyboardType="numeric"
        onChangeText={setDefensa}
      />

      <TouchableOpacity
        style={styles.button}
        disabled={guardando}
        onPress={guardar}
      >
        <Text style={styles.buttonText}>
          {guardando ? 'Guardando...' : 'Guardar cazador'}
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