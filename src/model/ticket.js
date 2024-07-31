import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const tickedModel = mongoose.Schema({
    id: { type: String, default: uuidv4 },
    title: { type: String, required: true },
    ticket_price: { type: Number, required: true },
    from_location: { type: String, required: true },
    to_location: { type: String, required: true },
    to_location_photo_url: { type: String, required: true },
    owner_id: { type: String, required: true }
});

export default mongoose.model("Ticked", tickedModel)