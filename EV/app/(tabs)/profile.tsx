import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

export default function TabTwoScreen() {
  const router = useRouter();

  const uid = localStorage.getItem("uid");
  if (uid == null) {
    throw new Error("User not logged in");
  }

  const points = localStorage.getItem("points");
  const username = localStorage.getItem("username")
  
  return (
    <View style={styles.container}>
        <Text style={styles.title}>Your Stats</Text>
        <br></br>
        <br></br>
        <Text style={styles.detail}>User ID: {uid}</Text>
        <br></br>
        <Text style={styles.detail}>Points: {points}</Text>
        <br></br>
        <Text style={styles.detail}>Username: {username}</Text>
        <br></br>
        <Text style={styles.detail}>CO2 Saved: tbd</Text>
        <br></br>
        <br></br>
        <br></br>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  detail: {
    fontSize: 15,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  backButton: {
    backgroundColor: '#39a465',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginTop: 10,
    marginBottom: 20,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});