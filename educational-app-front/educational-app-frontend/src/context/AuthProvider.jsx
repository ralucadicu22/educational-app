import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [role, setRole] = useState(null);



    useEffect(() => {
        if (token) {
            fetch("http://localhost:8081/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Failed to fetch user data");
                    }
                    return res.json();
                })
                .then((data) => {
                    setUser(data);
                    setRole(data.role);


                    localStorage.setItem("userId", data.id);

                })
                .catch(() => logout());
        }
    }, [token]);

    const login = (token) => {
        localStorage.setItem("token", token);
        setToken(token);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        setToken(null);
        setUser(null);
        setRole(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, role, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
