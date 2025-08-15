import { getAllUsers } from '@/components/firebaseFunctions';
import { Text, View } from '@/components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, StyleSheet } from 'react-native';

type UserScore = {
  rank: string;
  name: string;
  points: number;
  numAch: number;
};

function comparePoints(a: { points: number }, b: { points: number }) {
  return b.points - a.points;
}

export default function LeaderboardScreen() {
  const router = useRouter();
  const [leaderboardData, setLeaderboardData] = React.useState<UserScore[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchUsers = async () => {
        const uid = await AsyncStorage.getItem("uid");
        if (uid == null) {
          throw new Error("User not logged in");
        }
        const userArray = await getAllUsers(uid);

        let mappedData: UserScore[] = userArray.map((element: any, index: number) => ({
          rank: '',
          name: element.username || "Unknown",
          points: element.points || 0,
          numAch: (element.achievements.match(new RegExp("true", "g")) || []).length || 0
        }));

        mappedData = mappedData.sort(comparePoints).map((item, idx) => ({
          ...item,
          rank: `${idx + 1}`,
        }));

        setLeaderboardData(mappedData);
      };

      fetchUsers();
    }, [])
  );

  const renderLeaderboardItem = ({ item }: { item: UserScore }) => (
    <View style={styles.leaderboardItem}>
      <Text style={styles.rank}>{item.rank}</Text>
      <Text style={[styles.name, item.name === 'You' ? styles.highlight : null]}>{item.name}</Text>
      <Text style={styles.points}>Ach: {item.numAch}</Text>
      <Text style={styles.points}>{item.points} pts</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top Eco Warriors</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      <FlatList
        data={leaderboardData}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item.rank}
        style={styles.leaderboardList}
        scrollEnabled={false}
      />
      
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
  rewardsList: {
    width: '100%',
    marginBottom: 20,
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#39a465',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  claimedReward: {
    opacity: 0.7,
  },
  rewardIcon: {
    fontSize: 30,
    marginRight: 15,
  },
  rewardTextContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  rewardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  rewardDesc: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
  },
  rewardPoints: {
    fontSize: 12,
    color: '#ffeb3b',
    marginTop: 5,
  },
  claimButton: {
    backgroundColor: '#ffeb3b',
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  claimedButton: {
    backgroundColor: '#ccc',
  },
  claimButtonText: {
    color: '#000',
    fontWeight: 'bold',
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