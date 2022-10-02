import { createContext } from "react";

export const AuthContext = createContext({
  isLoggedIn: false,
  userId: null,
  name: "",
  email: "",
  token: null,
  login: () => {},
  logout: () => {},
});
