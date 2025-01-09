import { Router } from "express";
import {
    createPixcellController,
    getPixcellsController,
    getPixcellController,
    deletePixcellController,
    updatePixcellController,
    getAllPixcellsController
} from "../controllers/pixcellController";
import authMiddleware from "../middlewares/authMiddleware";
import { createPixcellSchema } from "../schemas/pixcell/createPixcellSchema";
import { updatePixcellSchema } from "../schemas/pixcell/updatePixcellSchema";
import validateRequest from "../middlewares/validateRequest";

const router = Router();

router.use(authMiddleware);

router.post("/", validateRequest(createPixcellSchema), createPixcellController);
router.put("/:id", validateRequest(updatePixcellSchema), updatePixcellController);
router.get("/all", getAllPixcellsController);
router.get("/", getPixcellsController);
router.get("/:id", getPixcellController);
router.delete("/:id", deletePixcellController);

export default router;
