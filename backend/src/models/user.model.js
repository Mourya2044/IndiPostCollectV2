import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  verified: {type:Boolean, required: true},
  address: { 
    locality: {type:String, required: true},
    district: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    pin: { type: Number, required: true }
   }
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
