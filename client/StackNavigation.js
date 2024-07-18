import { View, Text, ActivityIndicator } from "react-native";
import React, { useContext, useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import SignUpScreen from "./src/screens/SignUpScreen";
import SignInScreen from "./src/screens/SignInScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { AuthContext } from "./src/components/AuthProvider";
import AddBlogScreen from "./src/screens/AddBlogScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AntDesign } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import BlogScreen from "./src/screens/BlogScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useUser } from "./zustand/user";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function StackHomeScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="stackHome"
        component={HomeScreen}
        options={{ title: "Home" }}
      />
      <Stack.Screen
        name="blog"
        component={BlogScreen}
        options={({ route }) => ({ title: route.params.blogTitle })}
      />
    </Stack.Navigator>
  );
}

export default function StackNavigation() {
  const { setUser } = useUser();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("jwt");
        console.log("Fetch User Token", token);

        if (token) {
          const response = await axios.get(`/user/check?token=${token}`);
          console.log("User data", response.data.user);
          setUser(response.data.user);
        } else {
          console.log("Token not found");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <NavigationContainer>
      {AsyncStorage.getItem("jwt") ? (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
          <Tab.Screen
            name="home"
            component={StackHomeScreen}
            options={{
              title: "Home",
              headerTintColor: "white",
              headerStyle: {
                backgroundColor: "#CF9FFF",
              },
              tabBarLabel: "Home",
              tabBarActiveBackgroundColor: "#CF9FFF",
              tabBarActiveTintColor: "white",
              tabBarIcon: ({ focused }) => (
                <AntDesign
                  name="home"
                  size={24}
                  color={focused ? "white" : "black"}
                />
              ),
            }}
          />
          <Tab.Screen
            name="blog"
            component={AddBlogScreen}
            options={{
              title: "Add Blog",
              headerTintColor: "white",
              headerStyle: {
                backgroundColor: "rgba(249, 105, 14, 0.6)",
              },

              tabBarLabel: "Add",
              tabBarActiveBackgroundColor: "#CF9FFF",
              tabBarActiveTintColor: "white",
              tabBarIcon: ({ focused }) => (
                <MaterialIcons
                  name="post-add"
                  size={24}
                  color={focused ? "white" : "black"}
                />
              ),
            }}
          />
          <Tab.Screen name="profile" component={ProfileScreen} />
        </Tab.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName="signin"
        >
          <Stack.Screen name="signin" component={SignInScreen} />
          <Stack.Screen name="signup" component={SignUpScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
