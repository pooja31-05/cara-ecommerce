import mongoose from "mongoose";

const NewsLetterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
});

export default mongoose.model("newsLetter", NewsLetterSchema);
