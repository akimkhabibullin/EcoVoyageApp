import { StyleSheet, FlatList, Pressable, Image } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import { Text, View } from '@/components/Themed';

type UserScore = {
  id: string;
  name: string;
  points: number;
  avatar: string;
  rank: number;
};

export default function LeaderboardScreen() {
  const router = useRouter();

  //Change to link to real accounts
  // Sample data for leaderboard
  const leaderboardData: UserScore[] = [
    { id: '1', name: 'EcoWarrior42', points: 1250, avatar: '🌱', rank: 1 },
    { id: '2', name: 'GreenThumb', points: 980, avatar: '🌍', rank: 2 },
    { id: '3', name: 'RecycleMaster', points: 875, avatar: '♻️', rank: 3 },
    { id: '4', name: 'SustainableSam', points: 760, avatar: '🌿', rank: 4 },
    { id: '5', name: 'EcoExplorer', points: 650, avatar: '🌲', rank: 5 },
    { id: '6', name: 'You', points: 420, avatar: '👤', rank: 6 },
    { id: '7', name: 'NatureLover', points: 390, avatar: '🍃', rank: 7 },
  ];

  const renderLeaderboardItem = ({ item }: { item: UserScore }) => (
    <View style={styles.leaderboardItem}>
      <Text style={styles.rank}>{item.rank}</Text>
      <Text style={styles.avatar}>{item.avatar}</Text>
      <Text style={[styles.name, item.name === 'You' ? styles.highlight : null]}>{item.name}</Text>
      <Text style={styles.points}>{item.points} pts</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Eco Warriors</Text>
      {/* <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" /> */}
      
      <FlatList
        data={leaderboardData}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item.id}
        style={styles.leaderboardList}
        scrollEnabled={false}
      />
      
      <Pressable
        style={styles.statsButton}
        onPress={() => router.push('/(tabs)/profile')}
      >
        <Text style={styles.title}>Your Stats</Text>
        <Text style={styles.statsButtonText}>Points: 200</Text>
        <Text style={styles.statsButtonText}>CO2 Saved: 200</Text>
      </Pressable>

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
    justifyContent: 'flex-start',
    paddingTop: 60,
    backgroundColor: '#97e28f',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    alignSelf: 'flex-start',
    marginTop: 20,
    marginBottom: 10,
  },
  separator: {
    marginVertical: 10,
    height: 2,
    borderRadius: 100,
    width: '80%',
  },
  leaderboardList: {
    width: '100%',
    backgroundColor: '#39a465',
    borderRadius: 10,
    padding: 10,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
    backgroundColor: 'transparent',
  },
  rank: {
    width: 30,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  avatar: {
    width: 30,
    fontSize: 20,
    textAlign: 'center',
  },
  name: {
    flex: 1,
    fontSize: 16,
    color: '#fff',
    marginLeft: 10,
  },
  highlight: {
    fontWeight: 'bold',
    color: '#ffeb3b',
  },
  points: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#fff',
    width: 80,
    textAlign: 'right',
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
  statsButton: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 30,
    width: 325, 
    marginTop: 10,
    marginBottom: 5,
  },
  statsButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    paddingBottom: 10,
  },
});