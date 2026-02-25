import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "sonner";
import { api, unwrapResponse } from "@/lib/api";

export type Role = "customer" | "admin";

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    token?: string; // Optional because /auth/me doesn't return it
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isAdmin: boolean;
    isInitializing: boolean;
    login: (email: string, password?: string) => Promise<boolean>;
    register: (firstName: string, lastName: string, email: string, password?: string) => Promise<boolean>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isInitializing, setIsInitializing] = useState(true);

    const mapApiUser = (data: any, token?: string): User => {
        const isAdmin = data.roles?.some((r: string) => r.toLowerCase() === "admin");
        return {
            id: data.userId,
            name: `${data.firstName || ''} ${data.lastName || ''}`.trim() || data.email,
            email: data.email,
            role: isAdmin ? "admin" : "customer",
            token,
        };
    };

    const persistUserToken = (userObj: User) => {
        // We only persist the token and basic info locally so the interceptor can grab it
        localStorage.setItem("ecommerce_auth_user", JSON.stringify(userObj));
        setUser(userObj);
    };

    // Load session via /auth/me on mount if token exists
    useEffect(() => {
        const checkAuth = async () => {
            const storedUser = localStorage.getItem("ecommerce_auth_user");
            if (storedUser) {
                try {
                    const parsed = JSON.parse(storedUser);
                    if (parsed.token) {
                        // verify token with /auth/me
                        const res = await api.get("/auth/me");
                        const env = unwrapResponse(res.data);
                        setUser(mapApiUser(env.data, parsed.token));
                    }
                } catch (e) {
                    console.error("Session rehydration failed", e);
                    localStorage.removeItem("ecommerce_auth_user");
                    setUser(null);
                }
            }
            setIsInitializing(false);
        };
        checkAuth();
    }, []);

    const login = async (email: string, password = "Password123!"): Promise<boolean> => {
        try {
            const res = await api.post("/auth/login", { email, password });
            const env = unwrapResponse(res.data);
            persistUserToken(mapApiUser(env.data, env.data.token));
            toast.success("Successfully logged in.");
            return true;
        } catch (error: any) {
            console.error("Login Error:", error);
            toast.error(error.message || "Failed to login. Please check your credentials.");
            return false;
        }
    };

    const register = async (firstName: string, lastName: string, email: string, password = "Password123!"): Promise<boolean> => {
        try {
            const res = await api.post("/auth/register", { firstName, lastName, email, password });
            const env = unwrapResponse(res.data);
            persistUserToken(mapApiUser(env.data, env.data.token));
            toast.success("Account created successfully!");
            return true;
        } catch (error: any) {
            console.error("Register Error:", error);
            toast.error(error.message || "Email already in use or invalid data.");
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("ecommerce_auth_user");
        toast.info("You have been logged out.");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isAdmin: user?.role === "admin",
                isInitializing,
                login,
                register,
                logout,
            }}
        >
            {!isInitializing ? children : null}
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
