import mongoose from "mongoose";

const VideoSchema = mongoose.Schema({
  title: { type: String, required: true },
  summary: { type: String, required: true },
  createdAt: { type: Date, default: new Date() },
});

const Video = mongoose.model("Video", VideoSchema);

export default Video;
