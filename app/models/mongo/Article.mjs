import mongoose from "../../config/mongo.mjs";
const Schema = mongoose.Schema;

const ArticleSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    cover: String,
    content: { type: String, required: true },
    admin: {
      name: String,
      email: String,
    },
    status: { type: String, required: true},
    published_at: { type: Date },
    meta: {
      title: String,
      description: String,
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    versionKey: false,
  }
);

const Article = mongoose.model("Article", ArticleSchema);

export default Article;
