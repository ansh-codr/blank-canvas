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
import { createUserProfile, getUserProfile, updateUserProfile } from "./firestore";
import { ADMIN_EMAILS } from "@/constants";

// Check if email should be admin
const isAdminEmail = (email: string): boolean => {
  return ADMIN_EMAILS.includes(email.toLowerCase() as typeof ADMIN_EMAILS[number]);
};

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
  const shouldBeAdmin = isAdminEmail(user.email!);
  await createUserProfile(user.uid, {
    email: user.email!,
    displayName,
    photoURL: user.photoURL,
    createdAt: new Date(),
    isAdmin: shouldBeAdmin,
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
  const shouldBeAdmin = isAdminEmail(user.email!);
  
  if (!existingProfile) {
    await createUserProfile(user.uid, {
      email: user.email!,
      displayName: user.displayName || "Anonymous",
      photoURL: user.photoURL,
      createdAt: new Date(),
      isAdmin: shouldBeAdmin,
    });
  } else if (shouldBeAdmin && !existingProfile.isAdmin) {
    // Upgrade existing user to admin if their email is in the admin list
    await updateUserProfile(user.uid, { isAdmin: true });
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
