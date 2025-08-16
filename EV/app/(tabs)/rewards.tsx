import { updateUserInfo } from '@/components/firebaseFunctions';
import { Text, View } from '@/components/Themed';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet } from 'react-native';

export type Reward = {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  icon: string;
  claimed: boolean;
};

export type UserPoints = {
  userId: string;
  points: number;
};

export interface Database {
  // Reward methods
  createReward(reward: Omit<Reward, 'id'>): Promise<Reward>;
  getRewards(): Promise<Reward[]>;
  getRewardById(id: string): Promise<Reward | null>;
  
  // Points methods
  getUserPoints(userId: string): Promise<UserPoints>;
  updateUserPoints(userId: string, pointsChange: number): Promise<UserPoints>;
}

export default function RewardsScreen() {
  const [oneClaimed, setOneClaimed] = useState<boolean>(false);
  const [twoClaimed, setTwoClaimed] = useState<boolean>(false);
  const [threeClaimed, setThreeClaimed] = useState<boolean>(false);
  const [fourClaimed, setFourClaimed] = useState<boolean>(false);
  const [fiveClaimed, setFiveClaimed] = useState<boolean>(false);
  const [points, setPoints] = useState<number>();
  const [achievements, setAchievements] = useState(JSON.parse('{"1":false, "2":false, "3":false, "4":false, "5":false}'));
  const [uid, setuid] = useState<string>();
  const [username, setUsername] = useState<string>();

  React.useEffect(() => {
    const fetchInfo = async () => {
      const achievementsJSON = await AsyncStorage.getItem("achievements");
      const uidTemp = await AsyncStorage.getItem("uid");
      const pointsTemp = await AsyncStorage.getItem("points");
      const usernameTemp = await AsyncStorage.getItem("username");
      if (achievementsJSON !== null) {
        setAchievements(JSON.parse(achievementsJSON));
      }
      if (uidTemp !== null) {
        setuid(uidTemp);
      }
      if (pointsTemp !== null) {
        setPoints(Number(pointsTemp));
      }
      if (usernameTemp !== null) {
        setUsername(usernameTemp);
      }
    };
    fetchInfo();
  }, []);

  function updateClaimed(id: string): void {
    if (id == '1') {
      setOneClaimed(true);
    }
    else if (id == '2') {
      setTwoClaimed(true);
    }
    else if (id == '3') {
      setThreeClaimed(true);
    }
    else if (id == '4') {
      setFourClaimed(true);
    }
    else if (id == '5') {
      setFiveClaimed(true);
    }
  }

  const router = useRouter();
  
  const pointsData: UserPoints = {
    userId: `${username}: `,
    points: points ?? 0
  }

  //Change to real rewards
  // Sample data for rewards
  const rewardsData: Reward[] = [
    { id: '1', title: 'Eco Badge', description: 'Beginner eco warrior', pointsRequired: 100, icon: '🛡️', claimed: oneClaimed },
    { id: '2', title: 'Discount Coupon', description: '10% off eco products', pointsRequired: 300, icon: '🎟️', claimed: twoClaimed },
    { id: '3', title: 'Exclusive Content', description: 'Access to eco tips', pointsRequired: 500, icon: '🔓', claimed: threeClaimed },
    { id: '4', title: 'Plant a Tree', description: 'We plant a tree in your name', pointsRequired: 800, icon: '🌳', claimed: fourClaimed },
    { id: '5', title: 'VIP Event', description: 'Invitation to eco summit', pointsRequired: 1200, icon: '🎪', claimed: fiveClaimed },
  ];

  React.useEffect(() => {
  for (let i = 0; i < rewardsData.length; i++) {
    if (achievements[(i + 1).toString()] === true) {
      updateClaimed(rewardsData[i].id);
    }
  }
  }, [achievements]);

  const renderRewardItem = ({ item }: { item: Reward }) => (
    <View style={[styles.rewardItem, item.claimed ? styles.claimedReward : null]}>
      <Text style={styles.rewardIcon}>{item.icon}</Text>
      <View style={styles.rewardTextContainer}>
        <Text style={styles.rewardTitle}>{item.title}</Text>
        <Text style={styles.rewardDesc}>{item.description}</Text>
        <Text style={styles.rewardPoints}>{item.pointsRequired} points</Text>
      </View>
      <Pressable 
        style={({ pressed }) => [
          styles.claimButton, 
          item.claimed ? styles.claimedButton : null,
          pressed && !item.claimed && item.pointsRequired <= 420 && styles.claimedButton
        ]}
        disabled={item.claimed}
        onPress={async () => {
          if (points !== undefined && points !== null && points >= item.pointsRequired) {
            // update points
            updateClaimed(item.id);

            const newPoints = points - item.pointsRequired;
            setPoints(newPoints);
            await AsyncStorage.setItem("points", newPoints.toString());

            await updateUserInfo(uid ?? "", { points: newPoints });

            // update achievements
            const updatedAchievements = { ...achievements, [item.id]: true };
            setAchievements(updatedAchievements);
            const achievementsToSave = JSON.stringify(updatedAchievements);
            await AsyncStorage.setItem("achievements", achievementsToSave);
            await updateUserInfo(uid ?? "", { achievements: achievementsToSave });
          }
          }
        }
      >
          <Text style={styles.claimButtonText}>
            {item.claimed ? 'Claimed' : 'Claim'}
          </Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Pressable onPress={() => {
        if (points !== undefined) {
          setPoints(points + 100)
        }
      }}><Text>add 100 points! (testing)</Text></Pressable>
      <Text style={styles.title}>Your Points</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      <View style={[styles.pointItem]}>
        <Text style={styles.title}>{pointsData.userId}</Text>
        <Text style={styles.title}>{pointsData.points}</Text>
      </View>

      <Text style={styles.title}>Your Rewards</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <ScrollView style={styles.scrollStyle}>
      <FlatList
        data={rewardsData}
        renderItem={renderRewardItem}
        keyExtractor={(item) => item.id}
        style={styles.rewardsList}
        scrollEnabled={false}
      />
      </ScrollView>
      
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
  scrollStyle: {
    width: "90%"
  },
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

  pointItem: {
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
