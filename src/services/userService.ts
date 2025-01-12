import User from "../models/userModel";
import mongoose from "mongoose";

const getUserById = async (id: string) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("ID de l'utilisateur invalide.");
    }
    return User.findById(id).select('username');
};

export { getUserById };
