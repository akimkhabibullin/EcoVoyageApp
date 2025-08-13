
import { User } from "firebase/auth";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "./firebaseConfig"; // Assuming your db instance is in ../firebase/config


export interface BareItem {
  id?: string; // Optional, as Firestore generates it on addDoc
  name: string;
}

export interface UserInformation {
  username: string,
  points: number,
  email: string,
  achievements: string,
}

export async function addUser(userData: User, username: string) {
  try {
    const userDocRef = doc(collection(db, "users"), userData.uid);
    await setDoc(userDocRef, {
      username: username,
      points: 0,
      email: userData.email,
      achievements: '{"1":false, "2":false, "3":false, "4":false, "5":false}',
    });
  }
  catch (e: any) {
    console.error("Error adding user:", e);
    throw new Error(`Failed to add user: ${e.message}`);
  }
}

export async function getUserInfo(uid: string): Promise<UserInformation | null> {
  const userDocRef = doc(collection(db, "users"), uid);
  const docSnap = await getDoc(userDocRef);

  if (docSnap.exists()) {
    return docSnap.data() as UserInformation;
  }
  else {
    return null;
  }
}

export async function updateUserInfo(uid: string, updatedFields: Partial<UserInformation>): Promise<void> {
  try {
    const userDocRef = doc(collection(db, "users"), uid);
    await updateDoc(userDocRef, updatedFields);
  }
  catch (e: any) {
    console.error("Error updating user: ", e);
    throw new Error(`Failed to update user information: ${e.message}`);
  }
}


export async function updateItem(id: string, updatedFields: Partial<BareItem>): Promise<void> {
  try {
    const itemRef = doc(db, "items", id);
    await updateDoc(itemRef, updatedFields);
    console.log("Bare item updated successfully!");
  } catch (e: any) {
    console.error("Error updating bare item: ", e);
    throw new Error(`Failed to update bare item ${id}: ${e.message}`);
  }
}


export async function deleteItem(id: string): Promise<void> {
  try {
    const itemRef = doc(db, "items", id);
    await deleteDoc(itemRef);
    console.log("Bare item deleted successfully!");
  } catch (e: any) {
    console.error("Error deleting bare item: ", e);
    throw new Error(`Failed to delete bare item ${id}: ${e.message}`);
  }
}


export async function getAllUsers(uid: string) {
  const usersRef = collection(db, "users");
  const q = query(usersRef);
  const users: Document[] = [];

  const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      users.push(doc.data());
    });

  return users;
}