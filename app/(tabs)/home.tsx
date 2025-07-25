import { useRouter } from 'expo-router';
import { Pressable, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';

export default function TabTwoScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Pressable
        style={styles.enterButton}
        onPress={() => router.push('/(tabs)/map')}
        >
        <Text style={styles.enterText}>Map</Text>
      </Pressable>
      <Pressable
        style={styles.enterButton}
        onPress={() => router.push('/(tabs)/leaderboard')}
        >
        <Text style={styles.enterText}>Leaderboard</Text>
      </Pressable>
      <Pressable
        style={styles.enterButton}
        onPress={() => router.push('/(tabs)/rewards')}
        >
        <Text style={styles.enterText}>Rewards</Text>
      </Pressable>
      <Pressable
        style={styles.enterButton}
        onPress={() => router.push('../')}
        >
        <Text style={styles.enterText}>Log Out (doesnt work)</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },

  enterButton: {
    backgroundColor: '#39a465',
    marginTop: 10,
    borderRadius: 10,
  },
  enterText: {
    margin: 20,
    fontSize: 25,
    fontWeight: 'bold',
  },
});