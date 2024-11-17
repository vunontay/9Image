import { model, models, Schema } from "mongoose";

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        avatar: String,
        public_id: String,
        followers: [
            {
                type: Schema.Types.ObjectId,
                ref: "users",
            },
        ],
        followings: [
            {
                type: Schema.Types.ObjectId,
                ref: "users",
            },
        ],
    },
    {
        timestamps: true,
    }
);

const UserModel = models.users || model("users", userSchema);

export default UserModel;
