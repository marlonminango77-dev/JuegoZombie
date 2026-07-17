import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';

type Props = {
  label: string;
  value: number;
  max: number;
};

export default function HealthBar({ label, value, max }: Props) {
  const progress = useRef(new Animated.Value(100)).current;
  const percentage = max > 0 ? Math.max(0, Math.min(100, (value / max) * 100)) : 0;

  useEffect(() => {
    Animated.timing(progress, {
      toValue: percentage,
      duration: 350,
      useNativeDriver: false,
    }).start();
  }, [percentage, progress]);

  const width = progress.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.wrapper}>
      <View style={styles.row}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{Math.max(0, Math.ceil(value))}/{max}</Text>
      </View>
      <View style={styles.track}>
        <Animated.View style={[styles.fill, { width }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: '100%', marginVertical: 6 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { color: '#d9f99d', fontWeight: '700' },
  value: { color: '#ffffff', fontWeight: '700' },
  track: {
    height: 15,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#3f3f46',
    borderWidth: 1,
    borderColor: '#71717a',
  },
  fill: { height: '100%', backgroundColor: '#65a30d' },
});
