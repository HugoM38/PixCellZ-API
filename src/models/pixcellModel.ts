// src/models/pixcellModel.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IPixcell extends Document {
    owner: string;
    pixcell: number[];
}

const PixcellSchema: Schema = new Schema({
    owner: { type: String, required: true },
    pixcell: { type: [Number], required: true },
});

export default mongoose.model<IPixcell>("Pixcell", PixcellSchema);
