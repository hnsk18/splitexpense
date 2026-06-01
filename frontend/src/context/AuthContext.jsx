import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import { getProfile } from "../services/userApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    async function loadUser() {
        try {
            const token =
                localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            const profile =
                await getProfile();

            setUser(profile.user);
        } catch (err) {
            localStorage.removeItem("token");
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading,
                logout,
                loadUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);