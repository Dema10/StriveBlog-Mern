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
            required: true,
            unique: true,
        },

        date_of_birth: {
            type: String,
            required: true,
        },

        avatar: {
            type: String,
        },

        password: {
            type: String,
            required: true
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

    } catch (err) {
        next(err)
    }
});

export default mongoose.model('author', authorSchema);