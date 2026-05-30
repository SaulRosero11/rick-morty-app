import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { LoginForm, RegisterForm } from '../types/auth';

export const loginWithEmail = (data: LoginForm): Promise<UserCredential> =>
  signInWithEmailAndPassword(auth, data.email, data.password);

export const registerWithEmail = (data: RegisterForm): Promise<UserCredential> =>
  createUserWithEmailAndPassword(auth, data.email, data.password);

export const logout = (): Promise<void> => signOut(auth);
