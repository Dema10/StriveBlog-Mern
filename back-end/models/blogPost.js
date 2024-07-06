import mongoose from "mongoose";

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
                required: true
            },

            unit: {
                type: String,
                required: true
            }
        },

        author: {
            type: String,
            required: true,  // nel placeholder del frontend chiedere email autore
        },

        content: {
            type: String,
            required: true
        }
    },

    {
        collection: "blogPost",
        timestamps: true
    }
);

export default mongoose.model('blogPost', blogPostSchema);