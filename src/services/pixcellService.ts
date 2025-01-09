import Pixcell from "../models/pixcellModel";

const createPixcell = async (userId: string, data: { r: number, g: number, b: number }[][]) => {
    const creationDate = Date.now();
    const newPixcell = new Pixcell({ userId, creationDate, data });
    return await newPixcell.save();
};

const getPixcellsByOwner = async (userId: string) => {
    return Pixcell.find({ userId });
};

const getPixcellById = async (id: string) => {
    return Pixcell.findById(id);
};

const deletePixcell = async (id: string) => {
    return Pixcell.findByIdAndDelete(id);
};

const getAllPixcells = async () => {
    return Pixcell.find();
};

const updatePixcell = async (id: string, data: { r: number, g: number, b: number }[][]) => {
    return Pixcell.findByIdAndUpdate(id, { data }, { new: true, runValidators: true });
};

export { createPixcell, getPixcellsByOwner, getPixcellById, deletePixcell, getAllPixcells, updatePixcell };
