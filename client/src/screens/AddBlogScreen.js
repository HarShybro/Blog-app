import { View, Text, Image, TouchableOpacity } from "react-native";
import { useUser } from "../../zustand/user";
import React, { useContext, useState } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import { Button, TextInput } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { UserContext } from "../contexts/user-context";

const BlogSchema = Yup.object().shape({
  title: Yup.string()
    .min(4, "too short")
    .max(50, "too long")
    .required("Enter the title"),
  body: Yup.string()
    .min(4, "too short")
    .max(1000, "too long")
    .required("Enter the body"),
});

export default function AddBlogScreen({ navigation }) {
  const { user, setUser } = useUser();
  const pickImage = async (setFieldValue) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setFieldValue("img", result.assets[0].uri);
    }
  };

  const handleFormSubmit = async (values) => {
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("body", values.body);
    formData.append("email", user?.email);

    if (values.img) {
      const uriParts = values.img.split(".");
      const fileType = uriParts[uriParts.length - 1];
      formData.append("coverImage", {
        uri: values.img,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });
    }

    try {
      const response = await axios.post("/blog/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      navigation.navigate("home");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Formik
      initialValues={{ title: "", body: "", img: "" }}
      validationSchema={BlogSchema}
      onSubmit={handleFormSubmit}
    >
      {({
        handleChange,
        handleBlur,
        handleSubmit,
        values,
        errors,
        touched,
        setFieldTouched,
        isValid,
        setFieldValue,
      }) => {
        return (
          <View className="m-5">
            {values.img ? (
              <TouchableOpacity onPress={() => pickImage(setFieldValue)}>
                <Image
                  source={{ uri: values.img }}
                  style={{
                    width: 120,
                    height: 120,
                    borderRadius: 20,
                    borderColor: "",
                    borderWidth: 1,
                  }}
                />
              </TouchableOpacity>
            ) : (
              <Button
                className="mb-3 w-40"
                mode="contained-tonal"
                onPress={() => pickImage(setFieldValue)}
              >
                Choose Image
              </Button>
            )}

            <TextInput
              label="Title"
              mode="outlined"
              value={values.title}
              onChangeText={handleChange("title")}
              onBlur={handleBlur("title")}
              className="mb-2"
            />
            {errors.title && (
              <Text className="text-red-600 mb-2">{errors.title}</Text>
            )}
            <TextInput
              label="Body"
              numberOfLines={5}
              multiline={true}
              value={values.body}
              mode="outlined"
              onChangeText={handleChange("body")}
              onBlur={handleBlur("body")}
              className="mb-2"
            />
            {errors.body && (
              <Text className="text-red-600 mb-2">{errors.body}</Text>
            )}

            <Button icon="post" mode="elevated" onPress={handleSubmit}>
              Submit
            </Button>
          </View>
        );
      }}
    </Formik>
  );
}
