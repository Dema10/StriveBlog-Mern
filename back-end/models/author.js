import mongoose from "mongoose";

const authorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },

        surname: {
            type: String,
            required: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
        },

        date_of_birth: {
            type: String,
            required: true,
        },

        avatar: {
            type: String,
            required: true,
            unique: true,
        }
    },

    {
        collection: "authors",
        timestamps: true
    }
);

export default mongoose.model('author', authorSchema);