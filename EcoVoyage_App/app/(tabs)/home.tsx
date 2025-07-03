import { StyleSheet, TextInput } from 'react-native';
import React, { useState } from 'react';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TabOneScreen() {
  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome To Eco Voyage!</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="#000" />
      <View style={styles.grayBox}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="name@example.com"
          placeholderTextColor="#ccc"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="password"
          placeholderTextColor="#ccc"
          autoCapitalize="none"
        />
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  separator: {
    marginVertical: 20,
    height: 2,
    borderRadius: 100,
    width: '80%',
  },
  grayBox: {
    width: '80%',
    height: 200,
    backgroundColor: '#39a465',
    borderRadius: 10,
    marginTop: 10,
  },
    label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 8,
    marginLeft: 8,
    padding: 8,
  },
  input: {
    width: '90%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 6,
    paddingHorizontal: 10,
    fontSize: 13,
    marginLeft: 16,
  },
});
