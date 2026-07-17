import React from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  label: string;
  value: string;
  placeholder: string;
  keyboardType?: KeyboardTypeOptions;
  onChangeText: (text: string) => void;
};

export default function FormInput({
  label,
  value,
  placeholder,
  keyboardType = 'default',
  onChangeText,
}: Props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        keyboardType={keyboardType}
        onChangeText={onChangeText}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 14 },
  label: { color: '#d9f99d', fontWeight: '700', marginBottom: 6 },
  input: {
    backgroundColor: '#17211b',
    color: '#ffffff',
    borderWidth: 1,
    borderColor: '#3f6212',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
});
