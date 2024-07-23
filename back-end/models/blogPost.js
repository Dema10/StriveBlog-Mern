import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true },
      content: { 
        type: String, 
        required: true,
      }
    },
    {
      timestamps: true,
      _id: true
    }
  );

const blogPostSchema = new mongoose.Schema (
    {
        category: {
            type: String,
            required: true
        },

        title: {
            type: String,
            required: true
        },

        cover: {
            type: String,
            required: true
        },

        readTime: {
            value: {
                type: Number,
                default: 0
            },

            unit: {
                type: String,
                default: "minuto"
            }
        },

        author: {
            type: String,
        },

        content: {
            type: String,
            required: true
        },

        comments: [commentSchema]
    },

    {
        collection: "blogPost",
        timestamps: true
    }
);

export default mongoose.model('blogPost', blogPostSchema);