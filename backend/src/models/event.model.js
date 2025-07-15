import mongoose from "mongoose";

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  date: { type: Date },
  registeredUsers: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},{timestamps: true});

const Event = mongoose.model("Event",EventSchema);
export default Event;