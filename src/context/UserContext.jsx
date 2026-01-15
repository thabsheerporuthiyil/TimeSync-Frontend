import { createContext, useEffect, useState } from "react";
import api from "../api/axios";
import { ENDPOINTS } from "../api/endpoints";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext();

export function UserProvider({ children }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = !!user;

  
  useEffect(() => {
    const loadUser = async () => {
      const access = localStorage.getItem("access");
      if (!access) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(ENDPOINTS.ME);
        setUser(res.data);
      } catch (err) {
        localStorage.clear();
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);


// login

const login = async (email, password) => {
  try {
    const res = await api.post(ENDPOINTS.LOGIN, { email, password });

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    const me = await api.get(ENDPOINTS.ME);
    setUser(me.data);

    return me.data;
  } catch (err) {
    throw err;
  }
};


  // Google login
  const googleLogin = async (googleToken) => {
    const res = await api.post(ENDPOINTS.GOOGLE_LOGIN, {
      token: googleToken,
    });

    localStorage.setItem("access", res.data.access);
    localStorage.setItem("refresh", res.data.refresh);

    const me = await api.get(ENDPOINTS.ME);
    setUser(me.data);

    return me.data;
  };

  // Logout
  
  const logout = () => {
    localStorage.clear();
    setUser(null);
    navigate("/login");
  };

  return (
    <UserContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        login,
        googleLogin,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
