import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: { type: Boolean, required: true },
  profilePic: { type: String, default: "" },
  type: { type: String, enum: ["user", "admin"], default: "user" },
  address: {
    locality: { type: String },
    district: { type: String },
    state: { type: String },
    city: { type: String },
    pin: { type: Number }
  },
  cart: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: "Stamp", required: true },
      quantity: { type: Number, required: true, min: 1 }
    }
  ]
}, { timestamps: true });

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
UserSchema.methods.comparePasswords = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", UserSchema);
export default User;
