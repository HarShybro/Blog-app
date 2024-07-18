import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useUser } from "../../zustand/user";

export default function BlogScreen({ route }) {
  const { user } = useUser();
  const commentSchema = Yup.object().shape({
    content: Yup.string()
      .min(4, "too short")
      .max(1000, "too long")
      .required("Enter the Comment"),
  });

  const { blogId, blogBody, blogImage, blogTitle } = route.params;
  const [blog, setBlog] = useState(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const response = await axios.get(`/blog/${blogId}`);
        setBlog(response.data);
        console.log("Hello", blog);
      } catch (error) {
        console.error("Error fetching blog details:", error);
      }
    };

    fetchBlogDetails();
  }, [blogId]);

  const handleFormSubmit = async (values) => {
    try {
      console.log("Form values", values, user.email);

      const response = await axios.post(`/blog/comment/${blogId}`, {
        content: values.content,
        email: user.email,
      });
      console.log("result", response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Text>{blogId}</Text>
      <Text>{blogTitle}</Text>
      <Image
        source={{ uri: `http://192.168.1.5:8080/public${blogImage}` }}
        style={{ width: 100, height: 100 }}
      />
      <Text>{blogBody}</Text>

      {blog?.blog?.createdBy && (
        <View className="mt-5 flex-row items-center gap-3">
          <Image
            source={{
              uri: `http://192.168.1.5:8080/public${blog?.blog.createdBy.avatar}`,
            }}
            style={{ width: 30, height: 30 }}
          />
          <Text className="font-bold">{blog?.blog?.createdBy?.fullName}</Text>
        </View>
      )}
      <Text>Comments</Text>

      <View className="m-5">
        <Controller
          control={control}
          name="content"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="content"
              numberOfLines={1}
              multiline={true}
              onChangeText={onChange}
              onBlur={onBlur}
              value={value}
              className="mb-2 p-2 rounded bg-slate-300"
            />
          )}
        />
        {errors.content && (
          <Text className="text-red-600 mb-2">{errors.content.message}</Text>
        )}

        <TouchableOpacity onPress={handleSubmit(handleFormSubmit)}>
          <Text className="bg-blue-500 p-4 w-16 h-15 rounded">Add</Text>
        </TouchableOpacity>
      </View>

      {Array.isArray(blog?.comments) && blog.comments.length > 0 ? (
        blog.comments.map((comment) => (
          <View key={comment._id} className="mb-4">
            <Text className="font-bold">{comment.createdBy.fullName}</Text>
            <Text>{comment.content}</Text>
            <Image
              source={{
                uri: `http://192.168.1.5:8080/public${comment.createdBy.avatar}`,
              }}
              style={{ width: 30, height: 30 }}
            />
          </View>
        ))
      ) : (
        <Text>No comments yet</Text>
      )}
    </View>
  );
}
