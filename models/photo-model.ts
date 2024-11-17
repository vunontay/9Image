import { model, models, Schema } from "mongoose";

const photoSchema = new Schema(
    {
        title: String,
        slug: String,
        public_id: String,
        imgUrl: String,
        imgName: String,
        blurHash: String,
        tags: [],
        public: {
            type: Boolean,
            default: false,
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "users",
        },
        favorite_users: [
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

const PhotoModel = models.photos || model("photos", photoSchema);

export default PhotoModel;
