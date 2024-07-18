import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ToastAndroid,
} from "react-native";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

import { Button } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthContext } from "../components/AuthProvider";

export default function SignUpScreen({ navigation }) {
  const { userToken, setUserToken } = useContext(AuthContext);
  const [fullName, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchRequest = (token) => {
      if (!token) return;
      axios
        .get(`/user/check?token=${token}`)
        .then((res) => {
          console.log("Response:", res.data);
          setUserToken(AsyncStorage.getItem("jwt"));
        })
        .catch((err) => {
          console.log("Error:", err);
        });
    };

    const checkSignIn = async () => {
      const token = await AsyncStorage.getItem("jwt");
      console.log("Token1", token);
      if (token !== null) {
        fetchRequest(token);
      }
    };

    checkSignIn();
  }, [navigation]);

  const SubmitResult = async () => {
    setIsLoading(true);
    const baseUrl = `http://192.168.1.6:8080`;

    const form = {
      fullName,
      email,
      password,
    };

    axios
      .post(`/user/signup`, form, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        ToastAndroid.show("Request sent successfully!", ToastAndroid.SHORT);
        console.log(res);
      })
      .catch((err) => {
        console.log("Error", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View style={{ paddingHorizontal: 10, flex: 1, gap: 3, paddingTop: 20 }}>
        <Text style={{ fontWeight: "bold", fontSize: 24 }}>Sign Up</Text>
        <View>
          <Text style={{ fontWeight: "600", fontSize: 18 }}>Full Name:</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderRadius: 10,
              fontSize: 18,
              padding: 8,
            }}
            value={fullName}
            onChangeText={(text) => setName(text)}
          />
        </View>

        <View>
          <Text style={{ fontWeight: "600", fontSize: 18 }}>Email:</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderRadius: 10,
              fontSize: 18,
              padding: 8,
            }}
            value={email}
            keyboardType="email-address"
            onChangeText={(text) => setEmail(text)}
          />
          <Text style={{ color: "gray", fontSize: 12 }}>
            We'll not share your email with anyone.
          </Text>
        </View>

        <View>
          <Text style={{ fontWeight: "600", fontSize: 18 }}>Password:</Text>
          <TextInput
            style={{
              borderWidth: 1,
              borderRadius: 10,
              fontSize: 18,
              padding: 8,
            }}
            value={password}
            secureTextEntry={true}
            onChangeText={(text) => setPassword(text)}
          />
        </View>

        <Button mode="elevated" disabled={isLoading} onPress={SubmitResult}>
          Submit
        </Button>

        <TouchableOpacity onPress={() => navigation.navigate("signin")}>
          <Text style={{ color: "blue", textAlign: "center" }}>
            Already have an Account? Login ....
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
