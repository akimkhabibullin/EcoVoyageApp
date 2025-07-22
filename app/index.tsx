import { auth } from '@/components/firebaseConfig';
import { Text, View } from '@/components/Themed';
import { useRouter } from 'expo-router';
import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';


export default function TabOneScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  // to login existing users
  function loginUser() {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      router.push('/(tabs)/home')
      console.log(user);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;

      console.error("Error creating user:", errorCode, errorMessage);

      if (errorCode === 'auth/invalid-credential') {
        console.error("The email or password entered is incorrect.");
      }
      else if (errorCode === 'auth/too-many-requests') {
        console.error("Too many requests. Please try again later.");
      } 
      else if (errorCode === 'auth/invalid-email') {
        console.error("The email entered is invalid.")
      }
    });
  }
  

  return (
    <ScrollView keyboardShouldPersistTaps="handled">
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
            value={password}
            onChangeText={setPassword}
            placeholder="password"
            placeholderTextColor="#ccc"
            autoCapitalize="none"
            secureTextEntry
          />
        </View>
        <Pressable
          style={styles.enterButton}
          onPress={loginUser}
          >
          <Text style={styles.enterText}>Login</Text>
        </Pressable>
        <Pressable
          style={styles.enterButton}
          onPress={() => router.push('./signup')}
          >
          <Text style={styles.enterText}>Sign Up</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start', 
    paddingTop: 160,
    backgroundColor: '#97e28f', 
    paddingBottom: 225
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
  enterButton: {
    backgroundColor: '#39a465',
    marginTop: 10,
    borderRadius: 10,
  },
  enterText: {
    margin: 10,
    fontWeight: 'bold',
  },
});
