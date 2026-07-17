import React, { useCallback, useState } from 'react';
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { supabase } from '../supabase/config';

export default function ListaDatosScreen() {
  const [cazadores, setCazadores] = useState<any[]>([]);
  const [armas, setArmas] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);

  const cargarDatos = useCallback(async () => {
    setCargando(true);

    const { data: datosCazadores, error: errorCazadores } =
      await supabase
        .from('cazador')
        .select('*')
        .order('id');

    const { data: datosArmas, error: errorArmas } =
      await supabase
        .from('arma')
        .select('*')
        .order('id');

    if (errorCazadores) {
      console.log(errorCazadores);
    } else {
      setCazadores(datosCazadores || []);
    }

    if (errorArmas) {
      console.log(errorArmas);
    } else {
      setArmas(datosArmas || []);
    }

    setCargando(false);
  }, []);

  useFocusEffect(
    useCallback(() => {
      cargarDatos();
    }, [cargarDatos])
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={cargando}
          onRefresh={cargarDatos}
          tintColor="#bef264"
        />
      }
    >
      <Text style={styles.title}>
        📋 Cazadores y armas
      </Text>

      {cazadores.length === 0 && !cargando && (
        <Text style={styles.empty}>
          No hay cazadores registrados.
        </Text>
      )}

      {cazadores.map((cazador) => {
        const armasCazador = armas.filter(
          (arma) => arma.id_cazador === cazador.id
        );

        return (
          <View key={cazador.id} style={styles.card}>
            <Text style={styles.name}>
              🧑 {cazador.nombre}
            </Text>

            <Text style={styles.stat}>
              Nivel: {cazador.nivel}
            </Text>

            <Text style={styles.stat}>
              Vida: {cazador.vida_maxima}
            </Text>

            <Text style={styles.stat}>
              Defensa: {cazador.defensa}
            </Text>

            <Text style={styles.weaponTitle}>
              Armas:
            </Text>

            {armasCazador.length === 0 ? (
              <Text style={styles.empty}>
                Sin armas asignadas
              </Text>
            ) : (
              armasCazador.map((arma) => (
                <Text key={arma.id} style={styles.weapon}>
                  • {arma.nombre} | Daño: {arma.danio} | Munición:{' '}
                  {arma.municiones === null
                    ? '∞'
                    : arma.municiones}
                </Text>
              ))
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#08110d',
  },

  content: {
    padding: 18,
    paddingBottom: 36,
  },

  title: {
    color: '#bef264',
    fontSize: 26,
    fontWeight: '900',
    marginBottom: 16,
  },

  card: {
    backgroundColor: '#111c16',
    borderColor: '#365314',
    borderWidth: 1,
    borderRadius: 14,
    padding: 15,
    marginBottom: 12,
  },

  name: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
    marginBottom: 8,
  },

  stat: {
    color: '#d1d5db',
    marginBottom: 4,
  },

  weaponTitle: {
    color: '#a3e635',
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 4,
  },

  weapon: {
    color: '#e5e7eb',
    lineHeight: 22,
  },

  empty: {
    color: '#94a3b8',
    fontStyle: 'italic',
  },
});