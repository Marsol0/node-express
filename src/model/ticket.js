import mongoose from 'mongoose';

const tickedModel = mongoose.Schema({
    id: { type: String, required: ture },
    title: { type: String, required: ture },
    ticket_price: { type: Number, required: ture },
    from_location: { type: String, required: ture },
    to_location: { type: String, required: ture },
    to_location_photo_url: { type: String, required: ture },
    owner_id: { type: String, required: ture }
});

export default mongoose.model("Ticked", tickedModel)