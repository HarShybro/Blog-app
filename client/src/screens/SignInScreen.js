import { View, Text, ToastAndroid, TouchableOpacity } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import { TextInput } from "react-native-paper";
import { Button } from "react-native-paper";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../components/AuthProvider";
import HomeScreen from "./HomeScreen";
import { jwtDecode } from "jwt-decode";
import { UserContext } from "../contexts/user-context";
import { useUser } from "../../zustand/user";

export default function SignInScreen({ navigation }) {
  const { userToken, setUserToken } = useContext(AuthContext);
  const { setUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // useEffect(() => {
  //   const fetchUser = () => {
  //     const token = AsyncStorage.getItem("jwt");
  //     axios
  //       .get(`/user/check?token=${token}`)
  //       .then((res) => {
  //         setUser(res.data.user);
  //         navigation.navigate("home");
  //       })
  //       .catch((err) => {

  //         console.log(err);
  //       });
  //   };
  //   fetchUser();
  // }, []);

  const sumbitResult = async () => {
    const baseUrl = `http://192.168.1.6:8080`;
    const form = JSON.stringify({
      email,
      password,
    });
    console.log("Formdata", form);
    axios
      .post(`/user/signin`, form, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        ToastAndroid.show("Request sent successfully!", ToastAndroid.SHORT);
        console.log(res.data);
        AsyncStorage.setItem("jwt", res.data.token);
        setUserToken(AsyncStorage.getItem("jwt"));
        console.log("User Token:", res.data.token);
        const decoded = jwtDecode(res.data.token);
        console.log("Decoded", decoded);
        setUser(decoded);
      })
      .catch((err) => {
        console.error("Error:", err.response?.data?.error || err.message);
        ToastAndroid.show(
          "Login failed: " + (err.response?.data?.error || err.message),
          ToastAndroid.LONG
        );
      });
  };

  return (
    <View className="bg-purple-100 flex-1">
      <View>
        <Text className="text-2xl mx-4 font-bold my-7">Login Page</Text>
        <TextInput
          mode="outlined"
          label="Email"
          placeholder="Enter your Email"
          placeholderTextColor="gray"
          style={{ margin: 10 }}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          mode="outlined"
          label="Password"
          placeholder="Enter your Password"
          placeholderTextColor="gray"
          style={{ margin: 10 }}
          onChangeText={(text) => setPassword(text)}
        />

        <Button
          mode="elevated"
          onPress={() => sumbitResult()}
          style={{ margin: 10 }}
        >
          Log in
        </Button>
      </View>
      <TouchableOpacity onPress={() => navigation.navigate("signup")}>
        <Text className="text-center text-blue-400">Create an Account</Text>
      </TouchableOpacity>
    </View>
  );
}
