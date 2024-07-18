import { View, Text } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import AddBlogScreen from "./src/screens/AddBlogScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import BlogScreen from "./src/screens/BlogScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function StackHomeScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }}>
      <Stack.Screen
        name="stackHome"
        component={HomeScreen}
        options={{ title: "Hello" }}
      />
      <Stack.Screen name="blog" component={BlogScreen} />
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: true }}>
        <Tab.Screen
          name="home"
          component={StackHomeScreen}
          options={{
            tabBarIcon: () => <AntDesign name="home" size={24} color="black" />,
            title: "ome",
          }}
        />
        <Tab.Screen
          name="add"
          component={AddBlogScreen}
          options={{
            tabBarIcon: () => (
              <AntDesign name="plussquareo" size={24} color="black" />
            ),
            title: "Blog",
          }}
        />

        <Tab.Screen
          name="profile"
          component={ProfileScreen}
          options={{
            tabBarIcon: () => (
              <Ionicons name="person-circle-outline" size={24} color="black" />
            ),
            title: "Profile",
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
