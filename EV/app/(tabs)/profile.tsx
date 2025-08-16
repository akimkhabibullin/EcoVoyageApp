import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const router = useRouter();
  const [uid, setUid] = useState<string | null>(null);
  const [points, setPoints] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const storedUid = await AsyncStorage.getItem("uid");
      const storedPoints = await AsyncStorage.getItem("points");
      const storedUsername = await AsyncStorage.getItem("username");
      setUid(storedUid);
      setPoints(storedPoints);
      setUsername(storedUsername);
    };
    fetchData();
  }, []);

  if (uid == null) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>User not logged in</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Stats</Text>
      <View style={styles.card}>
        <Text style={styles.label}>User ID:</Text>
        <Text style={styles.value}>{uid}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Points:</Text>
        <Text style={styles.value}>{points}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>Username:</Text>
        <Text style={styles.value}>{username}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.label}>CO₂ Saved:</Text>
        <Text style={styles.value}>tbd</Text>
      </View>
      <Pressable
        style={styles.backButton}
        onPress={() => router.push('/(tabs)/home')}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#97e28f',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
    color: '#222',
  },
  card: {
    width: '100%',
    backgroundColor: '#52cb72',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    color: '#000000ff',
    fontWeight: '600',
  },
  value: {
    fontSize: 16,
    color: '#222',
    fontWeight: '400',
  },
  backButton: {
    backgroundColor: '#39a465',
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 24,
    marginBottom: 8,
    alignSelf: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
