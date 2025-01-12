import { Router } from "express";
import { getUserByIdController } from "../controllers/userController";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.use(authMiddleware);

router.get('/:id', getUserByIdController);

export default router;
