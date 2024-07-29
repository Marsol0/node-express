import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const userModel = mongoose.Schema({
    id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    money_balance: { type: Number, required: false },
});

export default mongoose.model("User", userModel)