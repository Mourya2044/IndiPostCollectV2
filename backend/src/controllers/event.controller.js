import { error } from "console";
import Event from "../models/event.model";

export const setupEvent = async (req,res) => {
    const {name, description, image, date, createdBy} = req.body
    
    if(!name || !description || !image){
        return res.status(400).json({message: "All address fields are required"})
    }
    try{
        const event = await Event.create({
            name,
            description,
            image,
            date,
            registrationLink,
            createdBy
        })
       return res.status(201).json({ message: "Event created successfully", event });
    }catch(err){
        return res.status(500).json({message:"Error setting up Event", error: err.message})
    }
}

export const registerEvent = async (req,res) => {

}

