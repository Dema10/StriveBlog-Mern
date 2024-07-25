import mongoose from "mongoose";
import bcrypt from "bcrypt";

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
            unique: true,
            required: true
        },

        date_of_birth: {
            type: String,
        },

        avatar: {
            type: String,
            unique: true,
            default: "https://www.shutterstock.com/image-vector/default-avatar-profile-icon-social-600nw-1677509740.jpg"
        },

        password: {
            type: String,
        },

        googleId: {
            type: String
        }
    },

    {
        collection: "authors",
        timestamps: true
    }
);

authorSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

authorSchema.pre("save", async function (next) {
    if(!this.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();

    } catch (error) {
        next(error);
    }
});

export default mongoose.model('author', authorSchema);