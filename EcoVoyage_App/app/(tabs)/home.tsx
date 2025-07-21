import { StyleSheet, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function TabTwoScreen() {
  const router = useRouter();
  
  return (
    <View style={styles.container}>
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
    width: 310,
    alignItems: 'center',
  },
  enterText: {
    margin: 20,
    fontSize: 25,
    fontWeight: 'bold',
  },
});
