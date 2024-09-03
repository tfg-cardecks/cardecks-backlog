import { Router } from "express";

//local imports
import { checkAdmin } from "../middlewares/checkAdmin";
import {
  deleteUser,
  getUserById,
  getUsers,
} from "../controllers/user.controller";

const router = Router();

router.get("/users", checkAdmin, getUsers);
router.get("/user/:id", checkAdmin, getUserById);
router.delete("/user/:id", checkAdmin, deleteUser);

export default router;
