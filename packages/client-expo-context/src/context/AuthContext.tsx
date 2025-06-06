import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User, LoginUser, NewUser } from "../types";
import { apiClient } from "../api/client";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (user: LoginUser) => Promise<void>;
  register: (user: NewUser) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "@auth_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load stored user data on mount
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          // Set the token on the API client
          apiClient.setToken(userData.token);
        }
      } catch (err) {
        console.error("Failed to load stored user:", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStoredUser();
  }, []);

  const storeUser = async (userData: User | null) => {
    try {
      if (userData) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      } else {
        await AsyncStorage.removeItem(STORAGE_KEY);
      }
    } catch (err) {
      console.error("Failed to store user data:", err);
    }
  };

  const login = useCallback(async (userData: LoginUser) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.login(userData);
      setUser(response.user);
      await storeUser(response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (userData: NewUser) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiClient.register(userData);
      setUser(response.user);
      await storeUser(response.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setUser(null);
    apiClient.setToken(null);
    await storeUser(null);
  }, []);

  const updateUser = useCallback(async (userData: User) => {
    setUser(userData);
    apiClient.setToken(userData.token);
    await storeUser(userData);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, isLoading, error, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
