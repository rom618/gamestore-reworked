import { createContext, useState, useEffect} from "react";
import type { ReactNode } from "react";
import { customerAccountApi } from "../api/customerAccount";
import type { CustomerAccount } from "../types";

// ─────────────────────────────────────────────
// Shape of the context value
// ─────────────────────────────────────────────

interface AuthContextValue {
  currentUser: CustomerAccount | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
}

// ─────────────────────────────────────────────
// Create context
// ─────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// ─────────────────────────────────────────────
// Storage key
// ─────────────────────────────────────────────

const STORAGE_KEY = "gamestore_user";

// ─────────────────────────────────────────────
// Provider
// ─────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<CustomerAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Rehydrate user from sessionStorage on first load
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCurrentUser(JSON.parse(stored));
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const user = await customerAccountApi.login(email, password);
    setCurrentUser(user);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  };

  const logout = () => {
    // Invalidate server-side Spring session
    fetch(`${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080"}/api/customer-account/logout`, {
      method: "POST",
      credentials: "include",
    }).catch(() => {}); // fire-and-forget; clear client state regardless
    setCurrentUser(null);
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isLoading,
        login,
        logout,
        isLoggedIn: currentUser !== null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ─────────────────────────────────────────────
// Raw context export (used by useAuth hook)
// ─────────────────────────────────────────────

export { AuthContext };