import { Request, Response, NextFunction } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    if (err.isJoi) {
        return res.status(400).json({ error: err.details[0].message });
    }
    res.status(err.status || 500).json({ error: err.message || "Une erreur inconnue s'est produite." });
};

export default errorHandler;
