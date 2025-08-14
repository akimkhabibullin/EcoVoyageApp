import { auth } from '@/components/firebaseConfig';
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
        localStorage.setItem("uid", uid);
        localStorage.setItem("email", data.email);
        localStorage.setItem("points", data.points.toString());
        localStorage.setItem("achievements", data.achievements.toString());
        localStorage.setItem("username", data.username);
        return true;
    }
    else {
        return false;
    }
}
