import Pixcell from "../models/pixcellModel";

const createPixcell = async (owner: string, pixcell: number[]) => {
    const newPixcell = new Pixcell({ owner, pixcell });
    return await newPixcell.save();
};

const getPixcellsByOwner = async (owner: string) => {
    return Pixcell.find({owner});
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

export { createPixcell, getPixcellsByOwner, getPixcellById, deletePixcell, getAllPixcells };
