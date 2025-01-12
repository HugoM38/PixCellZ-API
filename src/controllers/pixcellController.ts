// src/controllers/pixcellController.ts
import { Request, Response } from "express";
import {
    createPixcell,
    getPixcellsByOwner,
    getPixcellById,
    deletePixcell,
    updatePixcell,
    getAllPixcells
} from "../services/pixcellService";
import mongoose from "mongoose";

const createPixcellController = async (req: Request & { user?: string }, res: Response) => {
    try {
        const { data } = req.body;
        const userId = req.user;
        if (!data || !Array.isArray(data) || !data.every(row => Array.isArray(row))) {
            return res.status(400).json({ error: "Le champ 'data' est requis et doit être une matrice de pixels." });
        }
        const newPixcell = await createPixcell(userId as string, data);
        res.status(201).json({ pixcell: newPixcell });
    } catch (error) {
        console.error(error);
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ error: error.message });
        } else if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Une erreur inconnue s'est produite." });
        }
    }
};

const getPixcellsController = async (req: Request & { user?: string }, res: Response) => {
    try {
        const userId = req.user;
        const pixcells = await getPixcellsByOwner(userId as string);
        res.status(200).json({ pixcells });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Une erreur inconnue s'est produite." });
        }
    }
};

const getPixcellController = async (req: Request & { user?: string }, res: Response) => {
    try {
        const { id } = req.params;
        const pixcell = await getPixcellById(id);
        if (!pixcell) {
            return res.status(404).json({ error: "Pixcell non trouvé." });
        }
        res.status(200).json({ pixcell });
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            res.status(400).json({ error: "ID de Pixcell invalide." });
        } else if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Une erreur inconnue s'est produite." });
        }
    }
};

const updatePixcellController = async (req: Request & { user?: string }, res: Response) => {
    try {
        const { id } = req.params;
        const { data } = req.body;
        if (!data || !Array.isArray(data) || !data.every(row => Array.isArray(row))) {
            return res.status(400).json({ error: "Le champ 'data' est requis et doit être une matrice de pixels." });
        }
        const existingPixcell = await getPixcellById(id);
        if (!existingPixcell) {
            return res.status(404).json({ error: "Pixcell non trouvé." });
        }
        if (existingPixcell.userId !== req.user) {
            return res.status(403).json({ error: "Accès refusé. Vous ne pouvez pas modifier ce Pixcell." });
        }
        const updatedPixcell = await updatePixcell(id, data);
        res.status(200).json({ pixcell: updatedPixcell });
    } catch (error) {
        console.error(error);
        if (error instanceof mongoose.Error.ValidationError) {
            res.status(400).json({ error: error.message });
        } else if (error instanceof mongoose.Error.CastError) {
            res.status(400).json({ error: "ID de Pixcell invalide." });
        } else if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Une erreur inconnue s'est produite." });
        }
    }
};

const deletePixcellController = async (req: Request & { user?: string }, res: Response) => {
    try {
        const { id } = req.params;
        const pixcell = await getPixcellById(id);
        if (!pixcell) {
            return res.status(404).json({ error: "Pixcell non trouvé." });
        }
        if (pixcell.userId !== req.user) {
            return res.status(403).json({ error: "Accès refusé. Vous ne pouvez pas supprimer ce Pixcell." });
        }
        const deletedPixcell = await deletePixcell(id);
        res.status(200).json({ message: "Pixcell supprimé avec succès.", pixcell: deletedPixcell });
    } catch (error) {
        console.error(error);
        if (error instanceof mongoose.Error.CastError) {
            res.status(400).json({ error: "ID de Pixcell invalide." });
        } else if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Une erreur inconnue s'est produite." });
        }
    }
};

const getAllPixcellsController = async (req: Request & { user?: string }, res: Response) => {
    try {
        const pixcells = await getAllPixcells();
        res.status(200).json({ pixcells });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Une erreur inconnue s'est produite." });
        }
    }
};

export {
    createPixcellController,
    getPixcellsController,
    getPixcellController,
    updatePixcellController,
    deletePixcellController,
    getAllPixcellsController
};
