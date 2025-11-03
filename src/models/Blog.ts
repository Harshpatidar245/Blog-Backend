import { Schema, model, Document } from "mongoose";

export interface IBlog extends Document {
  title: string;
  image?: string;
  description?: string;
  content?: string;
  date: Date;
}

const BlogSchema = new Schema<IBlog>({
  title: { type: String, required: true },
  image: { type: String, default: "" },
  description: { type: String, default: "" },
  content: { type: String, default: "" },
  date: { type: Date, default: Date.now },
});

export default model<IBlog>("Blog", BlogSchema);
