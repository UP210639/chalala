import React from 'react';
import { Text, StyleSheet } from 'react-native';

interface TextAtomProps {
  children: React.ReactNode;
  style?: object;
}

const TextAtom: React.FC<TextAtomProps> = ({ children, style }) => {
  return <Text style={[styles.text, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
  },
});

export default TextAtom;