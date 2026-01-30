import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from "firebase/auth";
import { auth, googleProvider } from "./config";
import { createUserProfile, getUserProfile } from "./firestore";

// Register with email and password
export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update display name
  await updateProfile(user, { displayName });

  // Create user profile in Firestore
  await createUserProfile(user.uid, {
    email: user.email!,
    displayName,
    photoURL: user.photoURL,
    createdAt: new Date(),
    isAdmin: false,
  });

  return user;
};

// Sign in with email and password
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<User> => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
};

// Sign in with Google
export const signInWithGoogle = async (): Promise<User> => {
  const userCredential = await signInWithPopup(auth, googleProvider);
  const user = userCredential.user;

  // Check if user profile exists, if not create one
  const existingProfile = await getUserProfile(user.uid);
  if (!existingProfile) {
    await createUserProfile(user.uid, {
      email: user.email!,
      displayName: user.displayName || "Anonymous",
      photoURL: user.photoURL,
      createdAt: new Date(),
      isAdmin: false,
    });
  }

  return user;
};

// Sign out
export const logOut = async (): Promise<void> => {
  await signOut(auth);
};

// Reset password
export const resetPassword = async (email: string): Promise<void> => {
  await sendPasswordResetEmail(auth, email);
};
