import mongoose from "mongoose";
import bcrypt from "bcrypt";
const UserSchema = mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String },
  email: { type: String, required: true },
  name: { type: String, required: true },
});

UserSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 5);
});

const User = mongoose.model("User", UserSchema);

export default User;
