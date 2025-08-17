import { auth } from '@/components/firebaseConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { addUser, getUserInfo } from './firebaseFunctions';



// to login existing users
export async function loginUser(email: string, password: string): Promise<boolean> {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await getDataLocal(user.uid);
        return true;
    } 
    catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error("Error logging in user:", errorCode, errorMessage);

        if (errorCode === 'auth/invalid-credential') {
            console.error("The email or password entered is incorrect.");
        }
        else if (errorCode === 'auth/too-many-requests') {
            console.error("Too many requests. Please try again later.");
        } 
        else if (errorCode === 'auth/invalid-email') {
            console.error("The email entered is invalid.");
        }
        return false;
    }
}

// to create an account
export async function createUser(email: string, password: string, username: string): Promise<boolean> {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user
        await addUser(user, username);
        getDataLocal(user.uid);
        return true;
    }
    catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error("Error creating user:", errorCode, errorMessage);

        if (errorCode === 'auth/email-already-in-use') {
            console.error("The email address is already in use by another account.");
        }
        else if (errorCode === 'auth/invalid-email') {
            console.error("The email address is not valid.");
        }

        return false;
    }
}

export async function getDataLocal(uid: string): Promise<boolean> {
    const data = await getUserInfo(uid);
    if (data != null) {
        await AsyncStorage.setItem("uid", uid);
        await AsyncStorage.setItem("email", data.email);
        await AsyncStorage.setItem("points", data.points.toString());
        await AsyncStorage.setItem("achievements", data.achievements.toString());
        await AsyncStorage.setItem("username", data.username);
        return true;
    }
    else {
        return false;
    }
}

export async function logoutUser() {
    await AsyncStorage.removeItem("uid");
    await AsyncStorage.removeItem("email");
    await AsyncStorage.removeItem("points");
    await AsyncStorage.removeItem("achievements");
    await AsyncStorage.removeItem("username");
}
