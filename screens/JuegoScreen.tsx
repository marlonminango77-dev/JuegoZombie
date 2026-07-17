import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import HealthBar from '../components/HealthBar';
import { supabase } from '../supabase/config';

type EstadoBatalla =
  | 'preparacion'
  | 'batalla'
  | 'victoria'
  | 'derrota';

type Municiones = Record<number, number | null>;

export default function JuegoScreen() {
  const [cazadores, setCazadores] = useState<any[]>([]);
  const [zombis, setZombis] = useState<any[]>([]);
  const [armas, setArmas] = useState<any[]>([]);

  const [cazador, setCazador] = useState<any>(null);
  const [zombi, setZombi] = useState<any>(null);

  const [vidaCazador, setVidaCazador] = useState(0);
  const [vidaZombi, setVidaZombi] = useState(0);
  const [municiones, setMuniciones] = useState<Municiones>({});

  const [estado, setEstado] =
    useState<EstadoBatalla>('preparacion');

  const [mensaje, setMensaje] = useState(
    'Selecciona un cazador para comenzar.'
  );

  const [animando, setAnimando] = useState(false);

  const cazadorX = useRef(new Animated.Value(0)).current;
  const zombiX = useRef(new Animated.Value(0)).current;
  const cazadorShake = useRef(new Animated.Value(0)).current;
  const zombiOpacity = useRef(new Animated.Value(1)).current;
  const resultadoScale =
    useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    const { data: datosCazadores, error: errorCazadores } =
      await supabase
        .from('cazador')
        .select('*')
        .order('id');

    const { data: datosZombis, error: errorZombis } =
      await supabase
        .from('zombi')
        .select('*')
        .order('id');

    if (errorCazadores) {
      Alert.alert('Error', errorCazadores.message);
      return;
    }

    if (errorZombis) {
      Alert.alert('Error', errorZombis.message);
      return;
    }

    setCazadores(datosCazadores || []);

    const listaZombis = (datosZombis || []).map(
      (item: any) => ({
        ...item,
        emoji:
          item.id === 3
            ? '👹'
            : item.id === 2
              ? '🧟‍♂️'
              : '🧟',
      })
    );

    setZombis(listaZombis);
  }

  const sinMuniciones = useMemo(() => {
    if (armas.length === 0) {
      return true;
    }

    return armas.every((arma) => {
      return (
        arma.municiones !== null &&
        (municiones[arma.id] || 0) <= 0
      );
    });
  }, [armas, municiones]);

  async function seleccionarCazador(item: any) {
    const { data, error } = await supabase
      .from('arma')
      .select('*')
      .eq('id_cazador', item.id)
      .order('id');

    if (error) {
      Alert.alert('Error', error.message);
      return;
    }

    const armasCazador = data || [];
    const municionesIniciales: Municiones = {};

    armasCazador.forEach((arma: any) => {
      municionesIniciales[arma.id] = arma.municiones;
    });

    setCazador(item);
    setArmas(armasCazador);
    setMuniciones(municionesIniciales);
    setVidaCazador(item.vida_maxima);

    setMensaje(
      'Ahora selecciona el zombi al que enfrentarás.'
    );
  }

  function seleccionarZombi(item: any) {
    setZombi(item);
    setVidaZombi(item.vida_maxima);
    setMensaje(`${item.nombre} está listo para atacar.`);

    zombiOpacity.setValue(1);
  }

  function iniciarBatalla() {
    if (!cazador || !zombi || armas.length === 0) {
      Alert.alert(
        'Error',
        'Selecciona un cazador con armas y un zombi.'
      );
      return;
    }

    setEstado('batalla');
    setMensaje('Tu turno: selecciona un arma.');
  }

  function animarVictoria() {
    Animated.parallel([
      Animated.timing(zombiOpacity, {
        toValue: 0,
        duration: 700,
        useNativeDriver: true,
      }),

      Animated.spring(resultadoScale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function animarDerrota() {
    Animated.spring(resultadoScale, {
      toValue: 1,
      friction: 4,
      useNativeDriver: true,
    }).start();
  }

  function ataqueDelZombi(
    vidaRestanteZombi: number,
    sinBalasDespues: boolean
  ) {
    if (
      !cazador ||
      !zombi ||
      vidaRestanteZombi <= 0
    ) {
      setAnimando(false);
      return;
    }

    setMensaje(`${zombi.nombre} contraataca...`);

    Animated.sequence([
      Animated.timing(zombiX, {
        toValue: -38,
        duration: 160,
        useNativeDriver: true,
      }),

      Animated.timing(zombiX, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.sequence([
        Animated.timing(cazadorShake, {
          toValue: -10,
          duration: 55,
          useNativeDriver: true,
        }),

        Animated.timing(cazadorShake, {
          toValue: 10,
          duration: 55,
          useNativeDriver: true,
        }),

        Animated.timing(cazadorShake, {
          toValue: 0,
          duration: 55,
          useNativeDriver: true,
        }),
      ]).start();

      const danioRecibido = Math.max(
        1,
        zombi.danio - cazador.defensa
      );

      const nuevaVida = Math.max(
        0,
        vidaCazador - danioRecibido
      );

      setVidaCazador(nuevaVida);

      if (nuevaVida <= 0) {
        setEstado('derrota');
        setMensaje(
          `💀 ${cazador.nombre} ha sido derrotado.`
        );

        animarDerrota();
        setAnimando(false);

        Alert.alert(
          'Derrota',
          'El zombi derrotó a tu cazador.'
        );

        return;
      }

      if (sinBalasDespues) {
        setEstado('derrota');
        setMensaje(
          '💀 Te quedaste sin municiones.'
        );

        animarDerrota();
        setAnimando(false);

        Alert.alert(
          'Derrota',
          'No tienes armas disponibles.'
        );

        return;
      }

      setMensaje(
        `Recibiste ${danioRecibido} de daño. Tu turno.`
      );

      setAnimando(false);
    });
  }

  function atacar(arma: any) {
    if (
      !cazador ||
      !zombi ||
      estado !== 'batalla' ||
      animando
    ) {
      return;
    }

    const balasActuales = municiones[arma.id];

    if (
      balasActuales !== null &&
      (balasActuales || 0) <= 0
    ) {
      Alert.alert(
        'Sin municiones',
        `${arma.nombre} no tiene municiones.`
      );

      return;
    }

    setAnimando(true);
    setMensaje(
      `${cazador.nombre} usa ${arma.nombre}.`
    );

    const nuevasMuniciones = {
      ...municiones,
    };

    if (balasActuales !== null) {
      nuevasMuniciones[arma.id] = Math.max(
        0,
        (balasActuales || 0) - 1
      );

      setMuniciones(nuevasMuniciones);
    }

    const sinBalasDespues = armas.every(
      (item) =>
        item.municiones !== null &&
        (nuevasMuniciones[item.id] || 0) <= 0
    );

    Animated.sequence([
      Animated.timing(cazadorX, {
        toValue: 42,
        duration: 150,
        useNativeDriver: true,
      }),

      Animated.timing(cazadorX, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      Animated.sequence([
        Animated.timing(zombiX, {
          toValue: -12,
          duration: 55,
          useNativeDriver: true,
        }),

        Animated.timing(zombiX, {
          toValue: 12,
          duration: 55,
          useNativeDriver: true,
        }),

        Animated.timing(zombiX, {
          toValue: 0,
          duration: 55,
          useNativeDriver: true,
        }),
      ]).start();

      const danioTotal =
        arma.danio + cazador.nivel * 2;

      const nuevaVidaZombi = Math.max(
        0,
        vidaZombi - danioTotal
      );

      setVidaZombi(nuevaVidaZombi);

      if (nuevaVidaZombi <= 0) {
        setEstado('victoria');

        setMensaje(
          `🏆 Derrotaste a ${zombi.nombre}.`
        );

        animarVictoria();
        setAnimando(false);

        Alert.alert(
          'Victoria',
          '¡Has derrotado al zombi!'
        );

        return;
      }

      setMensaje(
        `Causaste ${danioTotal} de daño.`
      );

      setTimeout(() => {
        ataqueDelZombi(
          nuevaVidaZombi,
          sinBalasDespues
        );
      }, 400);
    });
  }

  function reiniciarBatalla() {
    if (!cazador || !zombi) {
      return;
    }

    const municionesIniciales: Municiones = {};

    armas.forEach((arma) => {
      municionesIniciales[arma.id] =
        arma.municiones;
    });

    setMuniciones(municionesIniciales);
    setVidaCazador(cazador.vida_maxima);
    setVidaZombi(zombi.vida_maxima);
    setEstado('batalla');
    setMensaje('Nueva batalla. Tu turno.');
    setAnimando(false);

    zombiOpacity.setValue(1);
    resultadoScale.setValue(0.8);
  }

  function cambiarPersonajes() {
    setCazador(null);
    setZombi(null);
    setArmas([]);
    setMuniciones({});
    setVidaCazador(0);
    setVidaZombi(0);
    setEstado('preparacion');
    setMensaje(
      'Selecciona un cazador para comenzar.'
    );
    setAnimando(false);

    zombiOpacity.setValue(1);
    resultadoScale.setValue(0.8);
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.title}>
        🧟 Zombie Hunter
      </Text>

      <Text style={styles.message}>
        {mensaje}
      </Text>

      {!cazador && (
        <View>
          <Text style={styles.sectionTitle}>
            1. Selecciona un cazador
          </Text>

          {cazadores.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.selectionCard}
              onPress={() =>
                seleccionarCazador(item)
              }
            >
              <Text style={styles.cardName}>
                🧑 {item.nombre}
              </Text>

              <Text style={styles.cardInfo}>
                Nivel {item.nivel} · Vida{' '}
                {item.vida_maxima} · Defensa{' '}
                {item.defensa}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {cazador && !zombi && (
        <View>
          <Text style={styles.selected}>
            Cazador: {cazador.nombre}
          </Text>

          <Text style={styles.sectionTitle}>
            2. Selecciona un zombi
          </Text>

          {zombis.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.selectionCard}
              onPress={() =>
                seleccionarZombi(item)
              }
            >
              <Text style={styles.cardName}>
                {item.emoji} {item.nombre}
              </Text>

              <Text style={styles.cardInfo}>
                Vida {item.vida_maxima} · Daño{' '}
                {item.danio}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={cambiarPersonajes}
          >
            <Text style={styles.secondaryText}>
              Cambiar cazador
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {cazador &&
        zombi &&
        estado === 'preparacion' && (
          <View>
            <Text style={styles.sectionTitle}>
              Preparación
            </Text>

            <Text style={styles.selected}>
              🧑 {cazador.nombre} contra{' '}
              {zombi.emoji} {zombi.nombre}
            </Text>

            <Text style={styles.weaponTitle}>
              Armas disponibles
            </Text>

            {armas.map((arma) => (
              <Text
                key={arma.id}
                style={styles.weaponLine}
              >
                • {arma.nombre}: daño {arma.danio},
                munición {arma.municiones ?? '∞'}
              </Text>
            ))}

            {armas.length === 0 && (
              <Text style={styles.warning}>
                Este cazador no tiene armas.
              </Text>
            )}

            <TouchableOpacity
              style={styles.mainButton}
              onPress={iniciarBatalla}
            >
              <Text style={styles.mainButtonText}>
                ⚔️ Iniciar batalla
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={cambiarPersonajes}
            >
              <Text style={styles.secondaryText}>
                Cambiar selección
              </Text>
            </TouchableOpacity>
          </View>
        )}

      {cazador &&
        zombi &&
        estado !== 'preparacion' && (
          <View style={styles.battleCard}>
            <HealthBar
              label={cazador.nombre}
              value={vidaCazador}
              max={cazador.vida_maxima}
            />

            <HealthBar
              label={zombi.nombre}
              value={vidaZombi}
              max={zombi.vida_maxima}
            />

            <View style={styles.arena}>
              <Animated.View
                style={{
                  transform: [
                    { translateX: cazadorX },
                    { translateX: cazadorShake },
                  ],
                }}
              >
                <Text style={styles.fighter}>
                  🧑‍🚒
                </Text>

                <Text style={styles.fighterName}>
                  {cazador.nombre}
                </Text>
              </Animated.View>

              <Text style={styles.vs}>VS</Text>

              <Animated.View
                style={{
                  opacity: zombiOpacity,
                  transform: [
                    { translateX: zombiX },
                  ],
                }}
              >
                <Text style={styles.fighter}>
                  {zombi.emoji}
                </Text>

                <Text style={styles.fighterName}>
                  {zombi.nombre}
                </Text>
              </Animated.View>
            </View>

            {estado === 'batalla' && (
              <>
                <Text style={styles.weaponTitle}>
                  Selecciona un arma
                </Text>

                {armas.map((arma) => {
                  const disponibles =
                    municiones[arma.id];

                  const agotada =
                    disponibles !== null &&
                    (disponibles || 0) <= 0;

                  return (
                    <TouchableOpacity
                      key={arma.id}
                      disabled={
                        agotada || animando
                      }
                      style={[
                        styles.weaponButton,
                        (agotada || animando) &&
                          styles.disabledButton,
                      ]}
                      onPress={() =>
                        atacar(arma)
                      }
                    >
                      <Text
                        style={
                          styles.weaponButtonText
                        }
                      >
                        {arma.nombre}
                      </Text>

                      <Text
                        style={
                          styles.weaponButtonInfo
                        }
                      >
                        Daño: {arma.danio} ·
                        Munición:{' '}
                        {disponibles ?? '∞'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}

                {sinMuniciones && (
                  <Text style={styles.warning}>
                    No quedan municiones.
                  </Text>
                )}
              </>
            )}

            {(estado === 'victoria' ||
              estado === 'derrota') && (
              <Animated.View
                style={[
                  styles.resultBox,
                  {
                    transform: [
                      {
                        scale: resultadoScale,
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.resultTitle}>
                  {estado === 'victoria'
                    ? '🏆 VICTORIA'
                    : '💀 DERROTA'}
                </Text>

                <TouchableOpacity
                  style={styles.mainButton}
                  onPress={reiniciarBatalla}
                >
                  <Text
                    style={styles.mainButtonText}
                  >
                    🔄 Jugar otra vez
                  </Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={cambiarPersonajes}
            >
              <Text style={styles.secondaryText}>
                Elegir otros personajes
              </Text>
            </TouchableOpacity>
          </View>
        )}
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
    paddingBottom: 40,
  },

  title: {
    color: '#bef264',
    textAlign: 'center',
    fontSize: 29,
    fontWeight: '900',
  },

  message: {
    color: '#ffffff',
    backgroundColor: '#1f2a22',
    borderRadius: 10,
    padding: 12,
    marginVertical: 15,
    textAlign: 'center',
    fontWeight: '700',
  },

  sectionTitle: {
    color: '#a3e635',
    fontSize: 21,
    fontWeight: '900',
    marginBottom: 10,
  },

  selected: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 12,
  },

  selectionCard: {
    backgroundColor: '#111c16',
    borderWidth: 1,
    borderColor: '#365314',
    padding: 15,
    borderRadius: 13,
    marginBottom: 10,
  },

  cardName: {
    color: '#ffffff',
    fontSize: 19,
    fontWeight: '900',
  },

  cardInfo: {
    color: '#cbd5e1',
    marginTop: 5,
  },

  battleCard: {
    backgroundColor: '#101813',
    borderColor: '#365314',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
  },

  arena: {
    minHeight: 190,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1a241d',
    borderRadius: 14,
    marginVertical: 12,
    paddingHorizontal: 8,
  },

  fighter: {
    fontSize: 70,
    textAlign: 'center',
  },

  fighterName: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    maxWidth: 105,
  },

  vs: {
    color: '#facc15',
    fontSize: 20,
    fontWeight: '900',
  },

  weaponTitle: {
    color: '#d9f99d',
    fontSize: 18,
    fontWeight: '900',
    marginTop: 8,
    marginBottom: 8,
  },

  weaponLine: {
    color: '#e5e7eb',
    lineHeight: 23,
  },

  weaponButton: {
    backgroundColor: '#3f6212',
    borderRadius: 11,
    padding: 13,
    marginBottom: 9,
  },

  disabledButton: {
    backgroundColor: '#3f3f46',
    opacity: 0.65,
  },

  weaponButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
  },

  weaponButtonInfo: {
    color: '#e2e8f0',
    marginTop: 3,
  },

  mainButton: {
    backgroundColor: '#4d7c0f',
    borderRadius: 11,
    padding: 15,
    marginTop: 14,
  },

  mainButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '900',
    textAlign: 'center',
  },

  secondaryButton: {
    borderColor: '#84cc16',
    borderWidth: 1,
    borderRadius: 11,
    padding: 13,
    marginTop: 10,
  },

  secondaryText: {
    color: '#bef264',
    fontWeight: '800',
    textAlign: 'center',
  },

  warning: {
    color: '#fbbf24',
    marginTop: 8,
    fontWeight: '700',
  },

  resultBox: {
    marginTop: 10,
  },

  resultTitle: {
    color: '#facc15',
    textAlign: 'center',
    fontSize: 28,
    fontWeight: '900',
  },
});