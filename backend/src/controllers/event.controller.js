import { error } from "console";
import Event from "../models/event.model.js";
import EventRegistration from "../models/eventRegistration.model.js";

export const setupEvent = async (req,res) => {

    const {name, description, image, date} = req.body
    const createdBy = req.user._id;
    
    if(!name || !description || !image){
        return res.status(400).json({message: "All address fields are required"})
    }
    try{
        const event = await Event.create({
            name,
            description,
            image,
            date,
            createdBy
        })
       return res.status(201).json({ message: "Event created successfully", event });
    }catch(err){
        return res.status(500).json({message:"Error setting up Event", err: error.message})
    }
}


export const registerEvent = async (req, res) => {
  const { eventId } = req.body;
  const userId = req.user?._id;

  if (!eventId || !userId) {
    return res.status(400).json({ message: "Event ID and user must be provided" });
  }

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.registeredUsers.includes(userId)) {
      return res.status(400).json({ message: "User already registered for this event" });
    }

    event.registeredUsers.push(userId);
    await event.save();

    return res.status(201).json({ message: "Successfully registered", event });
  } catch (err) {
    return res.status(500).json({ message: "Error registering for event", error: err.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    return res.status(200).json({ events });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to fetch events', error: err.message });
  }
};

export const deleteEvent = async (req,res) => {
    const {eventId} = req.params;
  try{
    const event = await Event.findById(eventId);
    if(!event){
      return res.status(404).json({ message: "Event Not found"});
    }
    await Event.deleteOne({_id: eventId});
    return res.status(200).json({ message: "Event deleted successfully" });
  } catch(err){
    return res.status(500).json({ message: 'Failed to delete events', error: err.message });
  }
};