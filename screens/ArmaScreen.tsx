import React, { useEffect, useState } from 'react';
import {Alert,ScrollView,StyleSheet,Text,TouchableOpacity,View,} from 'react-native';

import FormInput from '../components/FormInput';
import { supabase } from '../supabase/config';

export default function ArmaScreen() {
  const [cazadores, setCazadores] = useState<any[]>([]);
  const [idCazador, setIdCazador] = useState<number | null>(null);

  const [nombre, setNombre] = useState('');
  const [danio, setDanio] = useState('15');
  const [municiones, setMuniciones] = useState('10');
  const [infinita, setInfinita] = useState(false);

  useEffect(() => {
    cargarCazadores();
  }, []);

  async function cargarCazadores() {
    const { data, error } = await supabase
      .from('cazador')
      .select('*')
      .order('id');

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    setCazadores(data || []);

    if (data && data.length > 0) {
      setIdCazador(data[0].id);
    }
  }

  async function guardar() {
    if (!idCazador || !nombre || !danio) {
      Alert.alert('Error', 'Completa los campos');
      return;
    }

    if (!infinita && !municiones) {
      Alert.alert('Error', 'Ingresa las municiones');
      return;
    }

    const { error } = await supabase
      .from('arma')
      .insert({
        nombre: nombre,
        danio: Number(danio),
        municiones: infinita ? null : Number(municiones),
        id_cazador: idCazador,
      });

    if (error) {
      Alert.alert('Error', error.message);
    } else {
      Alert.alert('Correcto', 'Arma guardada');

      setNombre('');
      setDanio('15');
      setMuniciones('10');
      setInfinita(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>🔫 Registrar arma</Text>

      <Text style={styles.label}>Selecciona un cazador</Text>

      <View style={styles.options}>
        {cazadores.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.option,
              idCazador === item.id && styles.optionSelected,
            ]}
            onPress={() => setIdCazador(item.id)}
          >
            <Text style={styles.optionText}>
              {item.nombre}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FormInput
        label="Nombre del arma"
        value={nombre}
        placeholder="Ej. Escopeta"
        onChangeText={setNombre}
      />

      <FormInput
        label="Daño"
        value={danio}
        placeholder="15"
        keyboardType="numeric"
        onChangeText={setDanio}
      />

      <TouchableOpacity
        style={styles.checkRow}
        onPress={() => setInfinita(!infinita)}
      >
        <Text style={styles.check}>
          {infinita ? '☑' : '☐'}
        </Text>

        <Text style={styles.checkText}>
          Municiones infinitas
        </Text>
      </TouchableOpacity>

      {!infinita && (
        <FormInput
          label="Municiones"
          value={municiones}
          placeholder="10"
          keyboardType="numeric"
          onChangeText={setMuniciones}
        />
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={guardar}
      >
        <Text style={styles.buttonText}>
          Guardar arma
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
    marginBottom: 18,
  },

  label: {
    color: '#d9f99d',
    fontWeight: '700',
    marginBottom: 8,
  },

  options: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 18,
  },

  option: {
    backgroundColor: '#1f2937',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 8,
    marginBottom: 8,
  },

  optionSelected: {
    backgroundColor: '#4d7c0f',
  },

  optionText: {
    color: '#ffffff',
    fontWeight: '700',
  },

  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  check: {
    color: '#a3e635',
    fontSize: 24,
    marginRight: 8,
  },

  checkText: {
    color: '#e5e7eb',
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