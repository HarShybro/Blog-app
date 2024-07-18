import { View, Text } from "react-native";
import React, { createContext, useContext, useState } from "react";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [loading, isLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  return (
    <AuthContext.Provider
      value={{ loading, isLoading, userToken, setUserToken }}
    >
      {children}
    </AuthContext.Provider>
  );
}
