import { Router } from "express";
import {
    createPixcellController,
    getPixcellsController,
    getPixcellController,
    deletePixcellController,
    getAllPixcellsController
} from "../controllers/pixcellController";
import authMiddleware from "../middlewares/authMiddleware";
import { createPixcellSchema } from "../schemas/pixcell/createPixcellSchema";
import validateRequest from "../middlewares/validateRequest";

const router = Router();

router.use(authMiddleware);

router.post("/", validateRequest(createPixcellSchema), createPixcellController);
router.get("/all", getAllPixcellsController);
router.get("/", getPixcellsController);
router.get("/:id", getPixcellController);
router.delete("/:id", deletePixcellController);

export default router;
