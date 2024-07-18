import mongoose, { model, Schema } from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      requried: true,
    },
    coverImage: {
      type: String,
      requried: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
);

export const Blog = model("Blogs", blogSchema);
