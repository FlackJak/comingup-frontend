"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { client } from "@/lib/graphqlClient";
import { SIGNIN_MUTATION, SIGNUP_MUTATION } from "@/graphql/queries";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Optionally, verify token or fetch user data
      // For now, assume token is valid
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(userData);
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const data: any = await client.request(SIGNIN_MUTATION, { email, password });
      const { token, user } = data.login;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      // Update client headers with token
      client.setHeader("Authorization", `Bearer ${token}`);
    } catch (error) {
      throw new Error("Login failed");
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const data: any = await client.request(SIGNUP_MUTATION, { name, email, password });
      const { token, user } = data.signup;
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);
      client.setHeader("Authorization", `Bearer ${token}`);
    } catch (error) {
      throw new Error("Signup failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    client.setHeader("Authorization", "");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
