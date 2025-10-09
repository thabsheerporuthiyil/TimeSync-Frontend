// context/AuthContext.jsx
import { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "./UserContext";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const res = await axios.get(`http://localhost:5000/users?email=${email}`);
      if (res.data.length === 0) {
        throw new Error("Invalid credentials");
      }

      const foundUser = res.data[0];

      if (foundUser.blocked) {
        throw new Error("Your account has been blocked. Contact support.");
      }

      if (foundUser.password !== password) {
        throw new Error("Invalid credentials");
      }

      localStorage.setItem("user", JSON.stringify(foundUser));
      setUser(foundUser);
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return <AuthContext.Provider value={{ login, logout }}>{children}</AuthContext.Provider>;
}
