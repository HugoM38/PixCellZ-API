// src/models/pixcellModel.ts
import mongoose, { Document, Schema } from "mongoose";

export interface IPixcell extends Document {
    userId: string;
    creationDate: number;
    data: { r: number, g: number, b: number }[][];
}

const PixelSchema: Schema = new Schema({
    r: { type: Number, required: true, min: 0, max: 255 },
    g: { type: Number, required: true, min: 0, max: 255 },
    b: { type: Number, required: true, min: 0, max: 255 }
}, { _id: false });

const PixcellSchema: Schema = new Schema({
    userId: { type: String, required: true },
    creationDate: { type: Number, required: true },
    data: { type: [[PixelSchema]], required: true }
});

export default mongoose.model<IPixcell>("Pixcell", PixcellSchema);
