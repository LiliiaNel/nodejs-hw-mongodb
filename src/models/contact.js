import mongoose from "mongoose";

const contactsSchema = new mongoose.Schema({
    name: {
        type:String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
       type: String,
       required: false,
    },
    isFavourite: {
        type: Boolean,
        default: false,
    },
    contactType: {
       type: String,
       required: true,
       enum: ["home", "work", "personal"],
       default: "personal",
    },
},
    { 
        timestamps: true, 
    });

export const ContactCollection = mongoose.model('Contact', contactsSchema, 'contacts');