// 認証状態のグローバル管理コンテキスト
import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { AuthUser } from "../types";
import { mockUsers } from "../data/mockData";

type AuthContextType = {
  currentUser: AuthUser | null;
  login: (employeeNumber: string, password: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);

  // ログイン処理（パスワードは '1234' 固定）
  function login(employeeNumber: string, password: string): boolean {
    if (password !== '1234') return false;
    const user = mockUsers.find((u) => u.employeeNumber === employeeNumber);
    if (!user) return false;
    setCurrentUser(user);
    return true;
  }

  // ログアウト処理
  function logout() {
    setCurrentUser(null);
  }

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth フック
export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
