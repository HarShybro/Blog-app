import {
  View,
  TextInput,
  StatusBar,
  ScrollView,
  Image,
  Touchable,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Avatar, Button, Card, Modal, Portal, Text } from "react-native-paper";
import axios from "axios";
import { AuthContext } from "../components/AuthProvider";
import { useUser } from "../../zustand/user";
import { jwtDecode } from "jwt-decode";

export default function HomeScreen({ navigation }) {
  const { userToken, setUserToken } = useContext(AuthContext);
  const [visible, setVisible] = React.useState(false);
  const [data, setData] = useState(null); // initialize as null
  const { setUser } = useUser();

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const containerStyle = {
    backgroundColor: "white",
    padding: 5,
    margin: 10,
    borderRadius: 10,
  };

  const getData = async () => {
    try {
      const res = await AsyncStorage.getItem("jwt");
      setUserToken(res);
      const decoded = jwtDecode(userToken);
      console.log("Decoded ID", decoded);
      setUser(decoded);
      if (res === null) {
        navigation.navigate("signin");
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
  };

  const ClearData = async () => {
    try {
      await AsyncStorage.clear();
      setUserToken(null);
      console.log("Data cleared.");
      navigation.push("signin");
    } catch (error) {
      console.error("Error clearing data:", error);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get("/home");
      setData(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    getData();
    fetchUser();
  }, []);

  return (
    <>
      <ScrollView>
        {data && data.blogs && data.blogs.length ? (
          data.blogs.map((blog) => (
            <TouchableOpacity
              key={blog._id}
              className="p-3"
              onPress={() =>
                navigation.navigate("blog", {
                  blogId: blog._id,
                  blogTitle: blog.title,
                  blogBody: blog.body,
                  blogImage: blog.coverImage,
                })
              }
            >
              <Card>
                <Card.Cover
                  source={{
                    uri: `http://192.168.1.5:8080/public${blog.coverImage}`,
                  }}
                />
                <Card.Content>
                  <Text variant="titleLarge">{blog.title}</Text>
                  <Text variant="bodyMedium">{blog.body}</Text>
                  {/* <Text variant="bodyMedium">{blog.createdby.fullName}</Text> */}
                </Card.Content>
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          <Text>Empty</Text>
        )}
      </ScrollView>
    </>
  );
}
