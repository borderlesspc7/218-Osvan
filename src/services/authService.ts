import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebaseConfig";
import type {
  LoginData,
  RegisterData,
  AuthResponse,
  UserData,
} from "../types/auth";

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );
      const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

      if (!userDoc.exists()) {
        throw new Error("Usuário não encontrado");
      }

      const userData = userDoc.data() as UserData;

      return {
        user: userData,
        token: await userCredential.user.getIdToken(),
      };
    } catch {
      throw new Error("Erro ao fazer login");
    }
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const userData: UserData = {
        uid: userCredential.user.uid,
        name: data.name,
        email: data.email,
        role: data.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await setDoc(doc(db, "users", userCredential.user.uid), userData);

      return {
        user: userData,
        token: await userCredential.user.getIdToken(),
      };
    } catch {
      throw new Error("Erro ao registrar usuário");
    }
  },

  async logout(): Promise<void> {
    try {
      await signOut(auth);
    } catch {
      throw new Error("Erro ao fazer logout");
    }
  },

  async getCurrentUser(): Promise<UserData | null> {
    try {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        return null;
      }

      const userDoc = await getDoc(doc(db, "users", currentUser.uid));

      if (!userDoc.exists()) {
        return null;
      }

      return userDoc.data() as UserData;
    } catch {
      return null;
    }
  },

  onAuthStateChange(callback: (user: UserData | null) => void) {
    return onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          try {
            // Buscar dados do usuário no Firestore
            const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));

            if (userDoc.exists()) {
              const userData = userDoc.data() as UserData;
              callback(userData);
            } else {
              callback(null);
            }
          } catch {
            callback(null);
          }
        } else {
          callback(null);
        }
      }
    );
  },
};
