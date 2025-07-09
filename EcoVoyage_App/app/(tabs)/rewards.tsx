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

type Reward = {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  icon: string;
  claimed: boolean;
};

export default function LeaderboardScreen() {
  const router = useRouter();

  //Change to real rewards
  // Sample data for rewards
  const rewardsData: Reward[] = [
    { id: '1', title: 'Eco Badge', description: 'Beginner eco warrior', pointsRequired: 100, icon: '🛡️', claimed: true },
    { id: '2', title: 'Discount Coupon', description: '10% off eco products', pointsRequired: 300, icon: '🎟️', claimed: true },
    { id: '3', title: 'Exclusive Content', description: 'Access to eco tips', pointsRequired: 500, icon: '🔓', claimed: false },
    { id: '4', title: 'Plant a Tree', description: 'We plant a tree in your name', pointsRequired: 800, icon: '🌳', claimed: false },
    { id: '5', title: 'VIP Event', description: 'Invitation to eco summit', pointsRequired: 1200, icon: '🎪', claimed: false },
  ];

  const renderRewardItem = ({ item }: { item: Reward }) => (
    <View style={[styles.rewardItem, item.claimed ? styles.claimedReward : null]}>
      <Text style={styles.rewardIcon}>{item.icon}</Text>
      <View style={styles.rewardTextContainer}>
        <Text style={styles.rewardTitle}>{item.title}</Text>
        <Text style={styles.rewardDesc}>{item.description}</Text>
        <Text style={styles.rewardPoints}>{item.pointsRequired} points</Text>
      </View>
      <Pressable 
        style={[styles.claimButton, item.claimed ? styles.claimedButton : null]}
        disabled={item.claimed || item.pointsRequired > 420} // 420 is current user's points
      >
        <Text style={styles.claimButtonText}>{item.claimed ? 'Claimed' : 'Claim'}</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Rewards</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      <FlatList
        data={rewardsData}
        renderItem={renderRewardItem}
        keyExtractor={(item) => item.id}
        style={styles.rewardsList}
        scrollEnabled={false}
      />
      
      <Pressable
              style={styles.backButton}
              onPress={() => router.push('/(tabs)/history')}
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