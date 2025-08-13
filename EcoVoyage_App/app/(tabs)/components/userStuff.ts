import { auth } from '@/components/firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { addUser, getUserInfo } from './firebaseFunctions';

// to login existing users
export function loginUser(email: string, password: string) {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        getDataLocal(user.uid);
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

// to create an account
export function createUser(email: string, password: string, username: string) {
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        addUser(user, username)
        getDataLocal(user.uid);
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.error("Error creating user:", errorCode, errorMessage);

        if (errorCode === 'auth/email-already-in-use') {
            console.error("The email address is already in use by another account.");
        }
        else if (errorCode === 'auth/invalid-email') {
            console.error("The email address is not valid.");
        }
    });
}

export async function getDataLocal(uid: string): Promise<boolean> {
    const data = await getUserInfo(uid);
    if (data != null) {
        localStorage.setItem("uid", uid);
        localStorage.setItem("email", data.email);
        localStorage.setItem("points", data.points.toString());
        localStorage.setItem("achievements", data.achievements.toString());
        console.log(`uid: ${uid}, email: ${data.email}, points: ${data.points}`);
        return true;
    }
    else {
        return false;
    }
}