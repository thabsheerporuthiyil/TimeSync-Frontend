// import { createContext, useContext, useEffect, useState } from "react";
// import api from "../api/axios";
// import { ENDPOINTS } from "../api/endpoints";
// import { UserContext } from "./UserContext";
// import { useNavigate } from "react-router-dom";

// export const AuthContext = createContext();

// export function AuthProvider({ children }) {
//   const { setUser } = useContext(UserContext);
//   const navigate = useNavigate();

//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [loading, setLoading] = useState(true);

//   // 🔑 Check auth on app load
//   useEffect(() => {
//     const token = localStorage.getItem("access");

//     if (!token) {
//       setIsAuthenticated(false);
//       setLoading(false);
//       return;
//     }

//     api.get(ENDPOINTS.ME)
//       .then((res) => {
//         setUser(res.data);
//         setIsAuthenticated(true);
//       })
//       .catch(() => {
//         localStorage.clear();
//         setIsAuthenticated(false);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const login = async (email, password) => {
//     const res = await api.post(ENDPOINTS.LOGIN, { email, password });

//     localStorage.setItem("access", res.data.access);
//     localStorage.setItem("refresh", res.data.refresh);

//     const me = await api.get(ENDPOINTS.ME);
//     setUser(me.data);

//     setIsAuthenticated(true);
//     navigate("/");
//   };

//   const logout = () => {
//     localStorage.clear();
//     setUser(null);
//     setIsAuthenticated(false);
//     navigate("/login");
//   };

//   return (
//     <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }
