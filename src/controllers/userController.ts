// src/controllers/userController.ts
import { Request, Response } from "express";
import { getUserById } from "../services/userService";

const getUserByIdController = async (req: Request & { user?: string }, res: Response) => {
    try {
        const { id } = req.params;
        const authenticatedUserId = req.user;

        if (!authenticatedUserId) {
            return res.status(401).json({ error: "Non autorisé. Aucun utilisateur authentifié." });
        }

        const user = await getUserById(id);
        if (!user) {
            return res.status(404).json({ error: "Utilisateur non trouvé." });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        if (error instanceof Error) {
            if (error.message === "ID de l'utilisateur invalide.") {
                return res.status(400).json({ error: "ID de l'utilisateur invalide." });
            }
            res.status(400).json({ error: error.message });
        } else {
            res.status(500).json({ error: "Une erreur inconnue s'est produite." });
        }
    }
};

export { getUserByIdController };
