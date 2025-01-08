import { Request, Response } from "express";
import {
    createPixcell,
    getPixcellsByOwner,
    getPixcellById,
    deletePixcell,
    getAllPixcells
} from "../services/pixcellService";

const createPixcellController = async (req: Request & { user?: string }, res: Response) => {
    try {
        const { pixcell } = req.body;
        const owner = req.user;
        if (!pixcell || !Array.isArray(pixcell)) {
            return res.status(400).json({ error: "Le champ 'pixcell' est requis et doit être un tableau de nombres." });
        }
        const newPixcell = await createPixcell(owner as string, pixcell);
        res.status(201).json({ pixcell: newPixcell });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Une erreur inconnue s'est produite." });
        }
    }
};

const getPixcellsController = async (req: Request & { user?: string }, res: Response) => {
    try {
        const owner = req.user;
        const pixcells = await getPixcellsByOwner(owner as string);
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
        console.error(error);
        if (error instanceof Error) {
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
        if (pixcell.owner !== req.user) {
            return res.status(403).json({ error: "Accès refusé. Vous ne pouvez pas supprimer ce Pixcell." });
        }
        const deletedPixcell = await deletePixcell(id);
        res.status(200).json({ message: "Pixcell supprimé avec succès.", pixcell: deletedPixcell });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
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
    deletePixcellController,
    getAllPixcellsController
};
