import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Navigation from "./Navigation";
import StackNavigation from "./StackNavigation";
import { Provider as PaperProvider } from "react-native-paper";
import axios from "axios";
import AuthProvider from "./src/components/AuthProvider";
import { UserProvider } from "./src/contexts/user-context";

export default function App() {
  axios.defaults.baseURL = "http://192.168.1.5:8080";
  axios.defaults.withCredentials = true;
  return (
    <AuthProvider>
      <PaperProvider>
        <UserProvider>
          <StatusBar
            translucent={false}
            style="light"
            backgroundColor="black"
          />
        </UserProvider>
        <StackNavigation />
      </PaperProvider>
    </AuthProvider>
  );
}
