import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchMe, login as loginRequest, register as registerRequest } from "../api/auth.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("civictract_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("civictract_token");
    if (!token) {
      setReady(true);
      return;
    }
    fetchMe()
      .then((data) => {
        setUser(data.user);
        localStorage.setItem("civictract_user", JSON.stringify(data.user));
      })
      .catch(() => {
        localStorage.removeItem("civictract_token");
        localStorage.removeItem("civictract_user");
        setUser(null);
      })
      .finally(() => setReady(true));
  }, []);

  const value = useMemo(() => {
    function persist(data) {
      localStorage.setItem("civictract_token", data.token);
      localStorage.setItem("civictract_user", JSON.stringify(data.user));
      setUser(data.user);
    }
    return {
      user,
      ready,
      login: async (body) => {
        const data = await loginRequest(body);
        persist(data);
        return data.user;
      },
      register: async (body) => {
        const data = await registerRequest(body);
        persist(data);
        return data.user;
      },
      logout: () => {
        localStorage.removeItem("civictract_token");
        localStorage.removeItem("civictract_user");
        setUser(null);
      },
    };
  }, [user, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
