import mongoose from 'mongoose';

const ticketSchema = mongoose.Schema({
    id: { type: String, required: true, unique: true }, 
    title: { type: String, required: true, min: 3 },
    ticketPrice: { type: Number, required: true },
    fromLocation: { type: String, required: true },
    toLocation: { type: String, required: true },
    toLocationPhotoUrl: { type: String, required: true },
});

export default mongoose.model("Ticket", ticketSchema);
